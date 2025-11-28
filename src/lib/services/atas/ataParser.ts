/**
 * Serviço de Parsing de ATAs de Registro de Preço
 * 
 * Usa LLM (OpenAI/Anthropic) para extrair dados estruturados de PDFs de ATAs.
 * Também usa regex para extrair dados do cabeçalho quando possível.
 */

import type { DadosAtaExtraidos, RespostaExtracao, ResultadoParsingAta } from './types';

// Regex para extrair dados do cabeçalho da ATA - múltiplos padrões para maior cobertura
const REGEX_NUMERO_ATA_PATTERNS = [
  /ATA\s*DE\s*REGISTRO\s*DE\s*PRE[ÇC]OS?\s*N[º°]?\s*:?\s*([0-9]+[\/\-\.][0-9]+(?:\s*[-–]\s*[IVX\d]+)?)/i,
  /N[º°]?\s*(?:da\s*)?ATA\s*:?\s*([0-9]+[\/\-\.][0-9]+(?:\s*[-–]\s*[IVX\d]+)?)/i,
  /ATA\s*(?:DE\s*)?(?:RP|REGISTRO)\s*N[º°]?\s*:?\s*([0-9]+[\/\-\.][0-9]+(?:\s*[-–]\s*[IVX\d]+)?)/i,
  /REGISTRO\s*DE\s*PRE[ÇC]OS?\s*N[º°]?\s*:?\s*([0-9]+[\/\-\.][0-9]+(?:\s*[-–]\s*[IVX\d]+)?)/i,
  /ARP\s*N[º°]?\s*:?\s*([0-9]+[\/\-\.][0-9]+(?:\s*[-–]\s*[IVX\d]+)?)/i,
  // Padrão específico: procura por números no formato XXX/YYYY - I após "ATA"
  /ATA[^\d]*(\d{1,4}\/\d{4}\s*[-–]\s*[IVX]+)/i,
];

const REGEX_ORGAO_PATTERNS = [
  /(?:Gerenciador|GERENCIADOR|Órgão\s*Gerenciador)\s*:?\s*([^\n]+)/i,
  /(?:ÓRGÃO|ORGAO)\s*:?\s*([^\n]+)/i,
  /SECRETARIA\s+DE\s+ESTADO\s+DE\s+[^\n]+/i,
];

const REGEX_PLANEJAMENTO_PATTERNS = [
  /(?:Planejamento|PLANEJAMENTO)\s*n[º°]?\s*:?\s*([0-9]+[\/\-\.][0-9]+)/i,
  /Registro\s*de\s*Preços?\s*[-–]\s*Planejamento\s*n[º°]?\s*([0-9]+[\/\-\.][0-9]+)/i,
  /PE\s*n[º°]?\s*([0-9]+[\/\-\.][0-9]+)/i,
];

const REGEX_LEI = /(Lei\s*(?:Federal\s*)?n[º°]?\s*[\d\.]+[,\s]*(?:de\s*)?[\d\/]*)/gi;
const REGEX_DECRETO = /(Decreto\s*n[º°]?\s*[\d\.]+[,\s]*(?:de\s*)?[\d\/]*)/gi;

const REGEX_FORNECEDOR_PATTERNS = [
  /(?:FORNECEDOR|Fornecedor|Beneficiário|BENEFICIÁRIO|Detentora?|DETENTORA)\s*:?\s*([^\n]+?(?:LTDA|Ltda|ME|EPP|EIRELI|S\.?A\.?|TECNOLOGIA)[^\n]*)/i,
  /Alfa\s*Tecnologia[^\n]*/i,
];

const REGEX_CNPJ = /(\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2})/g;
const REGEX_VIGENCIA = /vig[êe]ncia\s*(?:de)?\s*(\d+)\s*(?:\(\w+\))?\s*meses?/i;

// Siglas de órgãos conhecidos
const ORGAOS_CONHECIDOS: Record<string, { nome: string; sigla: string }> = {
  'SEPLAG': { nome: 'Secretaria de Estado de Planejamento e Gestão de Minas Gerais', sigla: 'SEPLAG-MG' },
  'PLANEJAMENTO E GESTÃO': { nome: 'Secretaria de Estado de Planejamento e Gestão', sigla: 'SEPLAG' },
  'TCU': { nome: 'Tribunal de Contas da União', sigla: 'TCU' },
  'TJMG': { nome: 'Tribunal de Justiça de Minas Gerais', sigla: 'TJMG' },
};

/**
 * Extrai dados do cabeçalho usando regex (fallback antes da IA)
 */
function extrairDadosCabecalho(texto: string): Partial<DadosAtaExtraidos> {
  const dados: Partial<DadosAtaExtraidos> = {};

  // Número da ATA - tentar múltiplos padrões
  for (const pattern of REGEX_NUMERO_ATA_PATTERNS) {
    const match = texto.match(pattern);
    if (match && match[1]) {
      dados.numero_ata = match[1].trim().replace(/\s+/g, ' ');
      console.log('Número da ATA encontrado com padrão:', pattern.source, '→', dados.numero_ata);
      break;
    }
  }

  // Órgão gerenciador - tentar múltiplos padrões
  for (const pattern of REGEX_ORGAO_PATTERNS) {
    const match = texto.match(pattern);
    if (match) {
      const orgao = match[1] ? match[1].trim() : match[0].trim();
      dados.orgao_gerenciador = orgao.replace(/\s+/g, ' ');
      console.log('Órgão encontrado:', dados.orgao_gerenciador);
      break;
    }
  }

  // Verificar órgãos conhecidos para extrair sigla
  for (const [chave, info] of Object.entries(ORGAOS_CONHECIDOS)) {
    if (texto.toUpperCase().includes(chave)) {
      dados.orgao_gerenciador_sigla = info.sigla;
      if (!dados.orgao_gerenciador) {
        dados.orgao_gerenciador = info.nome;
      }
      console.log('Órgão conhecido identificado:', info.sigla);
      break;
    }
  }

  // Número do planejamento - tentar múltiplos padrões
  for (const pattern of REGEX_PLANEJAMENTO_PATTERNS) {
    const match = texto.match(pattern);
    if (match && match[1]) {
      dados.numero_planejamento = match[1].trim();
      console.log('Planejamento encontrado:', dados.numero_planejamento);
      break;
    }
  }

  // Base legal (leis e decretos)
  const leis: string[] = [];
  let leiMatch;
  const regexLei = new RegExp(REGEX_LEI.source, 'gi');
  while ((leiMatch = regexLei.exec(texto)) !== null) {
    const lei = leiMatch[1].trim();
    if (!leis.some(l => l.includes(lei.substring(0, 20)))) {
      leis.push(lei);
    }
  }
  const regexDecreto = new RegExp(REGEX_DECRETO.source, 'gi');
  while ((leiMatch = regexDecreto.exec(texto)) !== null) {
    const decreto = leiMatch[1].trim();
    if (!leis.some(l => l.includes(decreto.substring(0, 20)))) {
      leis.push(decreto);
    }
  }
  if (leis.length > 0) {
    dados.base_legal = leis.slice(0, 3).join(' e ');
    console.log('Base legal encontrada:', dados.base_legal);
  }

  // Fornecedor - tentar múltiplos padrões
  for (const pattern of REGEX_FORNECEDOR_PATTERNS) {
    const match = texto.match(pattern);
    if (match) {
      const fornecedor = match[1] ? match[1].trim() : match[0].trim();
      dados.fornecedor_nome = fornecedor.replace(/\s+/g, ' ');
      console.log('Fornecedor encontrado:', dados.fornecedor_nome);
      break;
    }
  }

  // Verificar se é Alfa Tecnologia especificamente
  if (!dados.fornecedor_nome && /alfa\s*tecnologia/i.test(texto)) {
    dados.fornecedor_nome = 'Alfa Tecnologia em Engenharia e Infraestrutura de Redes Ltda.';
    dados.fornecedor_cnpj = '31.837.899/0001-25';
    console.log('Alfa Tecnologia identificada no texto');
  }

  // CNPJs encontrados no documento
  const cnpjs = texto.match(REGEX_CNPJ);
  if (cnpjs && cnpjs.length > 0) {
    console.log('CNPJs encontrados:', cnpjs);
    // O CNPJ da Alfa Tecnologia é 31.837.899/0001-25
    const cnpjAlfa = cnpjs.find(c => c === '31.837.899/0001-25');
    if (cnpjAlfa) {
      dados.fornecedor_cnpj = cnpjAlfa;
    } else if (cnpjs.length >= 2 && !dados.fornecedor_cnpj) {
      // Segundo CNPJ geralmente é do fornecedor
      dados.fornecedor_cnpj = cnpjs[1];
    }
  }

  // Vigência
  const vigMatch = texto.match(REGEX_VIGENCIA);
  if (vigMatch) {
    dados.vigencia_meses = parseInt(vigMatch[1], 10);
    console.log('Vigência encontrada:', dados.vigencia_meses, 'meses');
  }

  return dados;
}

// Prompt do sistema para extração de dados de ATA
const SYSTEM_PROMPT = `Você é um especialista em análise de documentos de licitação pública brasileira, especialmente Atas de Registro de Preço (ARPs).

Sua tarefa é analisar o texto de uma ATA e extrair TODAS as informações estruturadas.

IMPORTANTE: Você deve retornar APENAS um JSON válido, sem explicações ou markdown.

O documento geralmente tem este formato:
- No cabeçalho: "ATA DE REGISTRO DE PREÇOS Nº XXX/YYYY" ou similar
- Seção "Gerenciador:" com nome do órgão e CNPJ
- Seção com dados do fornecedor beneficiário
- Tabelas com lotes e itens contendo número, descrição, unidade, quantidade e preço

Extraia os seguintes campos:

1. DADOS GERAIS DA ATA:
   - numero_ata: O número completo da ATA (procure por "ATA DE REGISTRO DE PREÇOS Nº" seguido do número, ex: "264/2025 - I")
   - orgao_gerenciador: Nome completo do órgão gerenciador (procure após "Gerenciador:")
   - orgao_gerenciador_sigla: Sigla do órgão (ex: "SEPLAG-MG" se for Secretaria de Planejamento de MG)
   - modalidade: Tipo de licitação (ex: "Pregão Eletrônico")
   - numero_planejamento: Número do processo/planejamento (procure "Planejamento nº")
   - base_legal: Leis e decretos citados (ex: "Lei nº 14.133/2021 e Decreto nº 48.779/2024")
   - objeto: Descrição resumida do objeto da contratação
   - vigencia_meses: Prazo de vigência em meses (número inteiro, geralmente 12)

2. DADOS DO FORNECEDOR BENEFICIÁRIO:
   - fornecedor_nome: Nome/Razão Social completa do fornecedor (procure após "Fornecedor:" ou "Beneficiário:")
   - fornecedor_cnpj: CNPJ do fornecedor (formato XX.XXX.XXX/XXXX-XX)

3. LOTES E ITENS:
   - lotes: Array de lotes, cada um contendo:
     - numero: Número do lote (ex: "2", "LOTE 2")
     - descricao: Descrição do lote se houver
     - itens: Array de itens do lote:
       - numero_item: Número do item (ex: "23", "1")
       - descricao: Descrição completa do item/serviço
       - unidade: Unidade de medida (ex: "UNIDADE", "METRO LINEAR")
       - quantidade: Quantidade total (número inteiro)
       - preco_unitario: Preço unitário (número decimal, usar ponto)

4. CONFIANÇA:
   - confidence: Número de 0.0 a 1.0 indicando sua confiança na extração

REGRAS IMPORTANTES:
- PROCURE ATIVAMENTE pelo número da ATA no início do documento
- Para preços em reais, converta "R$ 201,99" para 201.99
- Para quantidades com pontos de milhar, converta "66.147" para 66147
- Se não encontrar algum campo, use null (não string vazia)
- Extraia TODOS os itens que conseguir identificar
- O CNPJ do fornecedor é diferente do CNPJ do órgão gerenciador`;

/**
 * Extrai texto de um PDF usando unpdf
 */
export async function extrairTextoPDF(pdfBuffer: Buffer): Promise<string> {
  try {
    const { extractText } = await import('unpdf');
    const uint8Array = new Uint8Array(pdfBuffer);
    const { text } = await extractText(uint8Array);
    return Array.isArray(text) ? text.join('\n\n') : (text || '');
  } catch (error) {
    console.error('Erro ao extrair texto do PDF:', error);
    throw new Error(`Falha ao processar PDF: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
  }
}

/**
 * Monta o prompt do usuário para extração
 */
function montarPromptExtracao(textoPdf: string): string {
  // Limitar o texto para não exceder limites da API
  const textoLimitado = textoPdf.length > 100000 
    ? textoPdf.slice(0, 100000) + '\n\n[... texto truncado ...]'
    : textoPdf;

  return `Analise o texto a seguir, que foi extraído de um PDF de Ata de Registro de Preço, e extraia todas as informações estruturadas:

---
${textoLimitado}
---

Retorne APENAS o JSON estruturado, sem markdown ou explicações.`;
}

/**
 * Valida e normaliza a resposta do LLM
 */
function validarResposta(resposta: unknown): DadosAtaExtraidos {
  const dados = resposta as RespostaExtracao;

  // Garantir que lotes é um array
  const lotes = Array.isArray(dados.lotes) ? dados.lotes : [];

  // Normalizar os lotes e itens
  const lotesNormalizados = lotes.map(lote => ({
    numero: String(lote.numero || '1'),
    descricao: lote.descricao || undefined,
    itens: Array.isArray(lote.itens) 
      ? lote.itens.map(item => ({
          numero_item: String(item.numero_item || ''),
          descricao: String(item.descricao || ''),
          unidade: String(item.unidade || 'Unidade'),
          quantidade: Number(item.quantidade) || 0,
          preco_unitario: Number(item.preco_unitario) || 0,
        }))
      : [],
  }));

  return {
    numero_ata: dados.numero_ata || '',
    orgao_gerenciador: dados.orgao_gerenciador || '',
    orgao_gerenciador_sigla: dados.orgao_gerenciador_sigla || undefined,
    modalidade: dados.modalidade || 'Pregão Eletrônico',
    numero_planejamento: dados.numero_planejamento || undefined,
    fornecedor_nome: dados.fornecedor_nome || '',
    fornecedor_cnpj: dados.fornecedor_cnpj || '',
    vigencia_meses: dados.vigencia_meses || undefined,
    base_legal: dados.base_legal || undefined,
    objeto: dados.objeto || undefined,
    data_inicio: dados.data_inicio || undefined,
    data_fim: dados.data_fim || undefined,
    lotes: lotesNormalizados,
  };
}

/**
 * Extrai dados da ATA usando OpenAI
 */
export async function extrairDadosOpenAI(
  textoPdf: string,
  apiKey?: string
): Promise<DadosAtaExtraidos> {
  const key = apiKey || process.env.OPENAI_API_KEY;

  if (!key) {
    throw new Error('OPENAI_API_KEY não configurada');
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
        { role: 'user', content: montarPromptExtracao(textoPdf) },
      ],
      temperature: 0.1,
      max_tokens: 16000,
      response_format: { type: 'json_object' },
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Erro na API OpenAI: ${error}`);
  }

  const data = await response.json();
  const content = data.choices[0]?.message?.content;

  if (!content) {
    throw new Error('Resposta vazia da API OpenAI');
  }

  const parsed = JSON.parse(content);
  return validarResposta(parsed);
}

/**
 * Extrai dados da ATA usando Anthropic (Claude)
 */
export async function extrairDadosAnthropic(
  textoPdf: string,
  apiKey?: string
): Promise<DadosAtaExtraidos> {
  const key = apiKey || process.env.ANTHROPIC_API_KEY;

  if (!key) {
    throw new Error('ANTHROPIC_API_KEY não configurada');
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
      max_tokens: 16000,
      system: SYSTEM_PROMPT,
      messages: [
        { role: 'user', content: montarPromptExtracao(textoPdf) },
      ],
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Erro na API Anthropic: ${error}`);
  }

  const data = await response.json();
  const content = data.content[0]?.text;

  if (!content) {
    throw new Error('Resposta vazia da API Anthropic');
  }

  // Extrair JSON da resposta
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('JSON não encontrado na resposta');
  }

  const parsed = JSON.parse(jsonMatch[0]);
  return validarResposta(parsed);
}

/**
 * Extrai dados da ATA usando o provedor disponível
 */
export async function extrairDadosAta(textoPdf: string): Promise<DadosAtaExtraidos> {
  // Tentar OpenAI primeiro
  if (process.env.OPENAI_API_KEY) {
    try {
      return await extrairDadosOpenAI(textoPdf);
    } catch (error) {
      console.warn('Falha na OpenAI, tentando Anthropic:', error);
    }
  }

  // Tentar Anthropic como fallback
  if (process.env.ANTHROPIC_API_KEY) {
    return await extrairDadosAnthropic(textoPdf);
  }

  throw new Error('Nenhuma API de IA configurada (OPENAI_API_KEY ou ANTHROPIC_API_KEY)');
}

/**
 * Faz o parsing completo do PDF da ATA
 */
export async function parseAtaPDF(
  pdfBuffer: Buffer,
  nomeArquivo: string
): Promise<ResultadoParsingAta> {
  try {
    // 1. Extrair texto do PDF
    console.log('Extraindo texto do PDF:', nomeArquivo);
    const texto = await extrairTextoPDF(pdfBuffer);
    
    if (!texto || texto.trim().length < 100) {
      return {
        sucesso: false,
        erro: 'Não foi possível extrair texto suficiente do PDF. O arquivo pode estar protegido ou ser uma imagem.',
        texto_original: texto,
      };
    }

    console.log('Texto extraído com', texto.length, 'caracteres');
    
    // Log dos primeiros 2000 caracteres para debug
    console.log('Primeiros 2000 caracteres do texto:', texto.slice(0, 2000));

    // 2. Extrair dados do cabeçalho usando regex (mais confiável para campos específicos)
    console.log('Extraindo dados do cabeçalho com regex...');
    const dadosCabecalho = extrairDadosCabecalho(texto);
    console.log('Dados extraídos do cabeçalho:', dadosCabecalho);

    // 3. Extrair dados usando IA
    console.log('Enviando para análise com IA...');
    const dadosIA = await extrairDadosAta(texto);

    // 4. Combinar dados: priorizar regex para campos do cabeçalho, IA para itens
    const dados: DadosAtaExtraidos = {
      numero_ata: dadosCabecalho.numero_ata || dadosIA.numero_ata,
      orgao_gerenciador: dadosCabecalho.orgao_gerenciador || dadosIA.orgao_gerenciador,
      orgao_gerenciador_sigla: dadosCabecalho.orgao_gerenciador_sigla || dadosIA.orgao_gerenciador_sigla,
      modalidade: dadosIA.modalidade || 'Pregão Eletrônico',
      numero_planejamento: dadosCabecalho.numero_planejamento || dadosIA.numero_planejamento,
      fornecedor_nome: dadosCabecalho.fornecedor_nome || dadosIA.fornecedor_nome,
      fornecedor_cnpj: dadosCabecalho.fornecedor_cnpj || dadosIA.fornecedor_cnpj,
      vigencia_meses: dadosCabecalho.vigencia_meses || dadosIA.vigencia_meses,
      base_legal: dadosCabecalho.base_legal || dadosIA.base_legal,
      objeto: dadosIA.objeto,
      data_inicio: dadosIA.data_inicio,
      data_fim: dadosIA.data_fim,
      lotes: dadosIA.lotes, // Lotes e itens vêm da IA
    };

    // 5. Validar dados mínimos
    if (!dados.numero_ata) {
      return {
        sucesso: false,
        erro: 'Não foi possível identificar o número da ATA no documento. Verifique se o PDF contém texto selecionável.',
        texto_original: texto,
        dados,
      };
    }

    // Se não encontrou fornecedor, tentar usar dados padrão da Alfa
    if (!dados.fornecedor_nome && !dados.fornecedor_cnpj) {
      // Verificar se menciona Alfa Tecnologia no texto
      if (/alfa\s*tecnologia/i.test(texto)) {
        dados.fornecedor_nome = 'Alfa Tecnologia em Engenharia e Infraestrutura de Redes Ltda.';
        dados.fornecedor_cnpj = '31.837.899/0001-25';
      } else {
        return {
          sucesso: false,
          erro: 'Não foi possível identificar o fornecedor no documento.',
          texto_original: texto,
          dados,
        };
      }
    }

    console.log('Dados finais extraídos:', {
      numero_ata: dados.numero_ata,
      orgao: dados.orgao_gerenciador_sigla || dados.orgao_gerenciador,
      fornecedor: dados.fornecedor_nome,
      lotes: dados.lotes.length,
      itens: dados.lotes.reduce((acc, l) => acc + l.itens.length, 0),
    });

    return {
      sucesso: true,
      dados,
      texto_original: texto,
      confidence: 0.9,
    };

  } catch (error) {
    console.error('Erro no parsing da ATA:', error);
    return {
      sucesso: false,
      erro: error instanceof Error ? error.message : 'Erro desconhecido ao processar o PDF',
    };
  }
}

/**
 * Gera slug a partir do número da ATA e órgão
 */
export function gerarSlugAta(numeroAta: string, orgaoSigla?: string): string {
  const base = `${numeroAta}${orgaoSigla ? `-${orgaoSigla}` : ''}`;
  return base
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .replace(/[^a-z0-9]+/g, '-') // Substitui caracteres especiais por hífen
    .replace(/^-+|-+$/g, '') // Remove hífens do início e fim
    .slice(0, 100); // Limita tamanho
}

