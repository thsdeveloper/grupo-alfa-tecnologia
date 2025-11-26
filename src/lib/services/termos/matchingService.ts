/**
 * Serviço de Matching de Equipamentos
 * 
 * Compara itens normalizados com o catálogo interno de equipamentos
 * e sugere os melhores matches usando filtros SQL + LLM para ranking.
 */

import { createClient } from '@/lib/supabase/server'
import type {
    DadosNormalizados,
    EquipamentoCandidato,
    ResultadoMatching,
    RespostaMatchingLLM,
    CategoriaEquipamento
} from './types'

// Prompt do sistema para matching
const SYSTEM_PROMPT_MATCHING = `Você é um especialista em equipamentos de TI e CFTV.
Sua tarefa é comparar os requisitos de um item de licitação com equipamentos disponíveis no catálogo.

Você deve avaliar a aderência de cada equipamento aos requisitos e retornar um ranking.

Critérios de avaliação:
1. Categoria e tipo devem corresponder exatamente
2. Especificações técnicas devem atender ou superar os requisitos mínimos
3. Características extras são positivas, mas não essenciais
4. Preço não é critério de exclusão, mas equipamentos mais caros devem ter justificativa

Retorne APENAS um JSON válido com a seguinte estrutura:
{
  "principal": {
    "equipamento_id": "uuid do equipamento escolhido",
    "aderencia_percentual": 0.0 a 1.0,
    "comentario": "explicação curta do porquê este equipamento foi escolhido"
  },
  "alternativas": [
    {
      "equipamento_id": "uuid",
      "aderencia_percentual": 0.0 a 1.0,
      "comentario": "explicação curta"
    }
  ]
}`

/**
 * Busca equipamentos candidatos por categoria
 */
export async function buscarCandidatosPorCategoria(
    categoria: CategoriaEquipamento,
    limite: number = 10
): Promise<EquipamentoCandidato[]> {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('equipamentos')
        .select(`
      id,
      nome_comercial,
      fabricante,
      categoria,
      formato,
      tecnologia,
      resolucao_mp,
      varifocal,
      ptz,
      poe,
      ir_metros,
      potencia_va,
      portas,
      velocidade,
      capacidade_armazenamento_tb,
      caracteristicas_livres,
      preco_venda
    `)
        .eq('categoria', categoria)
        .eq('ativo', true)
        .limit(limite)

    if (error) {
        throw new Error(`Erro ao buscar equipamentos: ${error.message}`)
    }

    return data as EquipamentoCandidato[]
}

/**
 * Busca equipamentos candidatos com filtros mais específicos
 */
export async function buscarCandidatosComFiltros(
    dados: DadosNormalizados,
    limite: number = 10
): Promise<EquipamentoCandidato[]> {
    const supabase = await createClient()

    let query = supabase
        .from('equipamentos')
        .select(`
      id,
      nome_comercial,
      fabricante,
      categoria,
      formato,
      tecnologia,
      resolucao_mp,
      varifocal,
      ptz,
      poe,
      ir_metros,
      potencia_va,
      portas,
      velocidade,
      capacidade_armazenamento_tb,
      caracteristicas_livres,
      preco_venda
    `)
        .eq('categoria', dados.categoria)
        .eq('ativo', true)

    // Aplicar filtros específicos por categoria
    if (dados.categoria === 'camera') {
        if (dados.formato) {
            query = query.eq('formato', dados.formato)
        }
        if (dados.ptz !== undefined) {
            query = query.eq('ptz', dados.ptz)
        }
        if (dados.resolucao_min_mp) {
            query = query.gte('resolucao_mp', dados.resolucao_min_mp)
        }
    }

    if (dados.categoria === 'switch') {
        if (dados.poe !== undefined) {
            query = query.eq('poe', dados.poe)
        }
        if (dados.portas) {
            query = query.gte('portas', dados.portas)
        }
    }

    if (dados.categoria === 'nobreak') {
        if (dados.potencia_va) {
            query = query.gte('potencia_va', dados.potencia_va)
        }
    }

    const { data, error } = await query.limit(limite)

    if (error) {
        throw new Error(`Erro ao buscar equipamentos: ${error.message}`)
    }

    // Se não encontrou com filtros específicos, buscar só por categoria
    if (!data || data.length === 0) {
        return buscarCandidatosPorCategoria(dados.categoria, limite)
    }

    return data as EquipamentoCandidato[]
}

/**
 * Monta o prompt para o LLM fazer o matching
 */
function montarPromptMatching(
    dados: DadosNormalizados,
    descricaoBruta: string,
    candidatos: EquipamentoCandidato[]
): string {
    let prompt = `## Requisitos do Item (do edital)\n\n`
    prompt += `Descrição original: "${descricaoBruta}"\n\n`
    prompt += `Dados interpretados:\n`
    prompt += JSON.stringify(dados, null, 2)
    prompt += `\n\n## Equipamentos Candidatos do Catálogo\n\n`

    candidatos.forEach((eq, index) => {
        prompt += `### Candidato ${index + 1}: ${eq.nome_comercial}\n`
        prompt += `- ID: ${eq.id}\n`
        prompt += `- Fabricante: ${eq.fabricante || 'N/I'}\n`
        prompt += `- Categoria: ${eq.categoria}\n`
        prompt += `- Formato: ${eq.formato || 'N/I'}\n`
        prompt += `- Tecnologia: ${eq.tecnologia || 'N/I'}\n`

        if (eq.resolucao_mp) prompt += `- Resolução: ${eq.resolucao_mp}MP\n`
        if (eq.ptz !== null) prompt += `- PTZ: ${eq.ptz ? 'Sim' : 'Não'}\n`
        if (eq.varifocal !== null) prompt += `- Varifocal: ${eq.varifocal ? 'Sim' : 'Não'}\n`
        if (eq.poe !== null) prompt += `- PoE: ${eq.poe ? 'Sim' : 'Não'}\n`
        if (eq.ir_metros) prompt += `- IR: ${eq.ir_metros}m\n`
        if (eq.potencia_va) prompt += `- Potência: ${eq.potencia_va}VA\n`
        if (eq.portas) prompt += `- Portas: ${eq.portas}\n`
        if (eq.velocidade) prompt += `- Velocidade: ${eq.velocidade}\n`
        if (eq.capacidade_armazenamento_tb) prompt += `- Armazenamento: ${eq.capacidade_armazenamento_tb}TB\n`
        if (eq.caracteristicas_livres) prompt += `- Características: ${eq.caracteristicas_livres}\n`
        if (eq.preco_venda) prompt += `- Preço: R$ ${eq.preco_venda.toFixed(2)}\n`

        prompt += '\n'
    })

    prompt += `\nEscolha o melhor equipamento e até 2 alternativas. Retorne APENAS o JSON.`

    return prompt
}

/**
 * Faz o matching usando LLM (OpenAI)
 */
export async function matchingComLLM(
    dados: DadosNormalizados,
    descricaoBruta: string,
    candidatos: EquipamentoCandidato[],
    apiKey?: string
): Promise<ResultadoMatching[]> {
    const key = apiKey || process.env.OPENAI_API_KEY

    if (!key) {
        // Fallback: matching simples sem LLM
        return matchingSimples(dados, candidatos)
    }

    if (candidatos.length === 0) {
        return []
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
                { role: 'system', content: SYSTEM_PROMPT_MATCHING },
                { role: 'user', content: montarPromptMatching(dados, descricaoBruta, candidatos) },
            ],
            temperature: 0.3,
            response_format: { type: 'json_object' },
        }),
    })

    if (!response.ok) {
        const error = await response.text()
        console.error('Erro na API OpenAI para matching:', error)
        // Fallback para matching simples
        return matchingSimples(dados, candidatos)
    }

    const data = await response.json()
    const content = data.choices[0]?.message?.content

    if (!content) {
        return matchingSimples(dados, candidatos)
    }

    try {
        const parsed: RespostaMatchingLLM = JSON.parse(content)
        const resultados: ResultadoMatching[] = []

        // Adicionar sugestão principal
        if (parsed.principal) {
            const equipamento = candidatos.find(c => c.id === parsed.principal.equipamento_id)
            if (equipamento) {
                resultados.push({
                    equipamento_id: parsed.principal.equipamento_id,
                    nome_comercial: equipamento.nome_comercial,
                    aderencia_percentual: parsed.principal.aderencia_percentual,
                    comentario: parsed.principal.comentario,
                    is_principal: true,
                    ranking: 1,
                })
            }
        }

        // Adicionar alternativas
        if (parsed.alternativas) {
            parsed.alternativas.forEach((alt, index) => {
                const equipamento = candidatos.find(c => c.id === alt.equipamento_id)
                if (equipamento) {
                    resultados.push({
                        equipamento_id: alt.equipamento_id,
                        nome_comercial: equipamento.nome_comercial,
                        aderencia_percentual: alt.aderencia_percentual,
                        comentario: alt.comentario,
                        is_principal: false,
                        ranking: index + 2,
                    })
                }
            })
        }

        return resultados
    } catch {
        return matchingSimples(dados, candidatos)
    }
}

/**
 * Matching simples baseado em regras (fallback sem LLM)
 */
export function matchingSimples(
    dados: DadosNormalizados,
    candidatos: EquipamentoCandidato[]
): ResultadoMatching[] {
    if (candidatos.length === 0) {
        return []
    }

    // Calcular score para cada candidato
    const scored = candidatos.map(candidato => {
        let score = 0.5 // Score base
        let comentarios: string[] = []

        // Categoria correta (obrigatório)
        if (candidato.categoria === dados.categoria) {
            score += 0.1
            comentarios.push('Categoria correta')
        }

        // Formato
        if (dados.formato && candidato.formato === dados.formato) {
            score += 0.1
            comentarios.push(`Formato ${dados.formato}`)
        }

        // Tecnologia
        if (dados.tecnologia && candidato.tecnologia?.toLowerCase().includes(dados.tecnologia.toLowerCase())) {
            score += 0.05
            comentarios.push(`Tecnologia ${dados.tecnologia}`)
        }

        // Específicos para câmeras
        if (dados.categoria === 'camera') {
            if (dados.ptz !== undefined && candidato.ptz === dados.ptz) {
                score += 0.1
                comentarios.push(dados.ptz ? 'PTZ' : 'Fixa')
            }
            if (dados.resolucao_min_mp && candidato.resolucao_mp && candidato.resolucao_mp >= dados.resolucao_min_mp) {
                score += 0.1
                comentarios.push(`${candidato.resolucao_mp}MP >= ${dados.resolucao_min_mp}MP`)
            }
            if (dados.ir_metros && candidato.ir_metros && candidato.ir_metros >= dados.ir_metros) {
                score += 0.05
                comentarios.push(`IR ${candidato.ir_metros}m`)
            }
        }

        // Específicos para switches
        if (dados.categoria === 'switch') {
            if (dados.poe !== undefined && candidato.poe === dados.poe) {
                score += 0.1
                comentarios.push(dados.poe ? 'PoE' : 'Sem PoE')
            }
            if (dados.portas && candidato.portas && candidato.portas >= dados.portas) {
                score += 0.1
                comentarios.push(`${candidato.portas} portas`)
            }
        }

        // Específicos para no-breaks
        if (dados.categoria === 'nobreak') {
            if (dados.potencia_va && candidato.potencia_va && candidato.potencia_va >= dados.potencia_va) {
                score += 0.2
                comentarios.push(`${candidato.potencia_va}VA >= ${dados.potencia_va}VA`)
            }
        }

        return {
            candidato,
            score: Math.min(1, score),
            comentario: comentarios.join(', ') || 'Equipamento compatível',
        }
    })

    // Ordenar por score
    scored.sort((a, b) => b.score - a.score)

    // Retornar top 3
    return scored.slice(0, 3).map((item, index) => ({
        equipamento_id: item.candidato.id,
        nome_comercial: item.candidato.nome_comercial,
        aderencia_percentual: item.score,
        comentario: item.comentario,
        is_principal: index === 0,
        ranking: index + 1,
    }))
}

/**
 * Executa o matching completo para um item
 */
export async function executarMatching(
    dados: DadosNormalizados,
    descricaoBruta: string
): Promise<ResultadoMatching[]> {
    // Buscar candidatos com filtros
    const candidatos = await buscarCandidatosComFiltros(dados)

    if (candidatos.length === 0) {
        return []
    }

    // Fazer matching com LLM (ou fallback para simples)
    return matchingComLLM(dados, descricaoBruta, candidatos)
}

