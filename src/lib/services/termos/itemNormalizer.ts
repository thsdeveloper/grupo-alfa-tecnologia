/**
 * Serviço de Normalização de Itens
 * 
 * Usa LLM (OpenAI/Anthropic) para transformar descrições brutas de itens
 * em objetos estruturados com campos padronizados.
 */

import type {
    DadosNormalizados,
    CategoriaEquipamento,
    RespostaNormalizacaoLLM
} from './types'

// Prompt do sistema para normalização
const SYSTEM_PROMPT = `Você é um engenheiro especialista em infraestrutura de TI e sistemas de CFTV.
Sua tarefa é analisar descrições de itens de licitação e extrair informações técnicas estruturadas.

Você deve retornar APENAS um JSON válido, sem explicações adicionais.

Categorias válidas: camera, switch, nobreak, servidor, rack, acessorio, software, outros

Para CÂMERAS, extraia:
- categoria: "camera"
- tecnologia: "IP" ou "analógica"
- formato: "bullet", "dome", "ptz", "fisheye", "box", etc.
- tipo_lente: "fixa", "varifocal", "motorizada"
- ptz: true/false
- varifocal: true/false
- resolucao_min_mp: número em megapixels (ex: 2, 4, 8)
- poe: true/false (se mencionar PoE ou alimentação via cabo de rede)
- ir_metros: alcance do infravermelho em metros

Para SWITCHES, extraia:
- categoria: "switch"
- tecnologia: "PoE", "PoE+", "Gigabit", etc.
- poe: true/false
- portas: número de portas
- velocidade: "10/100", "gigabit", "10G", etc.

Para NO-BREAKS, extraia:
- categoria: "nobreak"
- formato: "torre", "rack-mount"
- potencia_va: potência em VA
- tecnologia: "senoidal", "online", "interativo", etc.

Para SERVIDORES/NVRs, extraia:
- categoria: "servidor"
- formato: "torre", "rack-mount"
- tecnologia: "NVR", "DVR", "Servidor"
- capacidade_armazenamento_tb: capacidade em TB
- portas: número de canais (para NVR/DVR)

Para RACKS, extraia:
- categoria: "rack"
- formato: tamanho em U (ex: "12U", "24U", "44U")

Sempre inclua:
- observacoes: resumo curto com características não mapeadas
- confidence: 0.0 a 1.0 indicando sua confiança na interpretação`

/**
 * Monta o prompt do usuário para normalização
 */
function montarPromptNormalizacao(descricaoBruta: string, contextoGrupo?: string): string {
    let prompt = `Analise a seguinte descrição de item de licitação e retorne um JSON estruturado:\n\n`

    if (contextoGrupo) {
        prompt += `Contexto (grupo/local): ${contextoGrupo}\n\n`
    }

    prompt += `Descrição do item: "${descricaoBruta}"\n\n`
    prompt += `Retorne APENAS o JSON, sem markdown ou explicações.`

    return prompt
}

/**
 * Valida e corrige a resposta do LLM
 */
function validarResposta(resposta: unknown): DadosNormalizados {
    const dados = resposta as RespostaNormalizacaoLLM

    // Validar categoria
    const categoriasValidas: CategoriaEquipamento[] = [
        'camera', 'switch', 'nobreak', 'servidor', 'rack', 'acessorio', 'software', 'outros'
    ]

    const categoria = categoriasValidas.includes(dados.categoria as CategoriaEquipamento)
        ? dados.categoria
        : 'outros'

    // Garantir confidence entre 0 e 1
    const confidence = typeof dados.observacoes === 'string'
        ? Math.min(1, Math.max(0, 0.8)) // Default se não informado
        : 0.5

    return {
        categoria,
        tecnologia: dados.tecnologia,
        formato: dados.formato,
        tipo_lente: dados.tipo_lente,
        ptz: dados.ptz,
        varifocal: dados.varifocal,
        resolucao_min_mp: dados.resolucao_min_mp,
        poe: dados.poe,
        ir_metros: dados.ir_metros,
        potencia_va: dados.potencia_va,
        portas: dados.portas,
        velocidade: dados.velocidade,
        capacidade_armazenamento_tb: dados.capacidade_armazenamento_tb,
        observacoes: dados.observacoes,
        confidence,
    }
}

/**
 * Normaliza um item usando a API da OpenAI
 */
export async function normalizarItemOpenAI(
    descricaoBruta: string,
    contextoGrupo?: string,
    apiKey?: string
): Promise<DadosNormalizados> {
    const key = apiKey || process.env.OPENAI_API_KEY

    if (!key) {
        throw new Error('OPENAI_API_KEY não configurada')
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${key}`,
        },
        body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
                { role: 'system', content: SYSTEM_PROMPT },
                { role: 'user', content: montarPromptNormalizacao(descricaoBruta, contextoGrupo) },
            ],
            temperature: 0.2,
            response_format: { type: 'json_object' },
        }),
    })

    if (!response.ok) {
        const error = await response.text()
        throw new Error(`Erro na API OpenAI: ${error}`)
    }

    const data = await response.json()
    const content = data.choices[0]?.message?.content

    if (!content) {
        throw new Error('Resposta vazia da API OpenAI')
    }

    const parsed = JSON.parse(content)
    return validarResposta(parsed)
}

/**
 * Normaliza um item usando a API da Anthropic (Claude)
 */
export async function normalizarItemAnthropic(
    descricaoBruta: string,
    contextoGrupo?: string,
    apiKey?: string
): Promise<DadosNormalizados> {
    const key = apiKey || process.env.ANTHROPIC_API_KEY

    if (!key) {
        throw new Error('ANTHROPIC_API_KEY não configurada')
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': key,
            'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
            model: 'claude-3-haiku-20240307',
            max_tokens: 1024,
            system: SYSTEM_PROMPT,
            messages: [
                { role: 'user', content: montarPromptNormalizacao(descricaoBruta, contextoGrupo) },
            ],
        }),
    })

    if (!response.ok) {
        const error = await response.text()
        throw new Error(`Erro na API Anthropic: ${error}`)
    }

    const data = await response.json()
    const content = data.content[0]?.text

    if (!content) {
        throw new Error('Resposta vazia da API Anthropic')
    }

    // Extrair JSON da resposta (Claude pode incluir texto adicional)
    const jsonMatch = content.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
        throw new Error('JSON não encontrado na resposta')
    }

    const parsed = JSON.parse(jsonMatch[0])
    return validarResposta(parsed)
}

/**
 * Normaliza um item usando o provedor configurado
 * Tenta OpenAI primeiro, depois Anthropic como fallback
 */
export async function normalizarItem(
    descricaoBruta: string,
    contextoGrupo?: string
): Promise<DadosNormalizados> {
    // Tentar OpenAI primeiro
    if (process.env.OPENAI_API_KEY) {
        try {
            return await normalizarItemOpenAI(descricaoBruta, contextoGrupo)
        } catch (error) {
            console.warn('Falha na OpenAI, tentando Anthropic:', error)
        }
    }

    // Tentar Anthropic como fallback
    if (process.env.ANTHROPIC_API_KEY) {
        return await normalizarItemAnthropic(descricaoBruta, contextoGrupo)
    }

    throw new Error('Nenhuma API de IA configurada (OPENAI_API_KEY ou ANTHROPIC_API_KEY)')
}

/**
 * Normaliza múltiplos itens em paralelo (com rate limiting)
 */
export async function normalizarItensEmLote(
    itens: Array<{ descricao: string; contexto?: string }>,
    concorrencia: number = 3
): Promise<DadosNormalizados[]> {
    const resultados: DadosNormalizados[] = []

    // Processar em lotes para evitar rate limiting
    for (let i = 0; i < itens.length; i += concorrencia) {
        const lote = itens.slice(i, i + concorrencia)
        const promessas = lote.map(item =>
            normalizarItem(item.descricao, item.contexto)
        )

        const resultadosLote = await Promise.all(promessas)
        resultados.push(...resultadosLote)

        // Pequeno delay entre lotes
        if (i + concorrencia < itens.length) {
            await new Promise(resolve => setTimeout(resolve, 500))
        }
    }

    return resultados
}

