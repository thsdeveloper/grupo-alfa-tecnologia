/**
 * Serviço de parsing de PDF
 * 
 * Extrai texto e tabelas de PDFs de Termos de Referência.
 * Para MVP, usa regex para identificar grupos e itens.
 * Em produção, pode-se integrar com pdfplumber (Python) ou serviços especializados.
 */

import type { ResultadoParsing, GrupoExtraido, ItemExtraido } from './types'

// Regex para identificar grupos (ex: "GRUPO I – CAMPUS CERES")
const REGEX_GRUPO = /GRUPO\s+([IVXLCDM]+|\d+)\s*[-–—]\s*(.+?)(?=GRUPO\s+[IVXLCDM]+|\d+|$)/gi

// Regex para identificar itens de tabela (simplificado)
const REGEX_ITEM = /(\d+)\s*[.)\-]?\s*((?:CÂMERA|CAMERA|SWITCH|NO-?BREAK|NOBREAK|SERVIDOR|NVR|RACK|HD|DISCO).+?)(?:\s*(?:UN|UNIDADE|PÇ|PEÇA|CJ|CONJUNTO)\s*)(\d+)?/gi

// Regex para identificar número do edital
const REGEX_EDITAL = /(?:PREGÃO|PREGAO|EDITAL|PE)\s*(?:ELETRÔNICO|ELETRONICO)?\s*(?:N[º°]?\.?\s*)?(\d+[\d\/\-\.]*)/i

// Regex para identificar órgão
const REGEX_ORGAO = /(?:INSTITUTO|UNIVERSIDADE|SECRETARIA|MINISTÉRIO|MINISTERIO|PREFEITURA|CÂMARA|CAMARA|TRIBUNAL).+?(?=\n|PREGÃO|PREGAO|EDITAL)/i

/**
 * Extrai texto de um PDF usando unpdf
 * @param pdfBuffer Buffer do arquivo PDF
 * @returns Texto extraído do PDF
 */
export async function extrairTextoPDF(pdfBuffer: Buffer): Promise<string> {
    try {
        // unpdf é uma biblioteca simples que funciona bem no Node.js
        const { extractText } = await import('unpdf')

        // Converter Buffer para Uint8Array (aceito pelo extractText)
        const uint8Array = new Uint8Array(pdfBuffer)

        // Extrair texto do PDF
        const { text } = await extractText(uint8Array)

        // text é um array de strings (uma por página), juntar com quebras de linha
        return Array.isArray(text) ? text.join('\n\n') : (text || '')
    } catch (error) {
        console.error('Erro ao extrair texto do PDF:', error)
        throw new Error(`Falha ao processar PDF: ${error instanceof Error ? error.message : 'Erro desconhecido'}`)
    }
}

/**
 * Identifica o número do edital no texto
 */
function identificarEdital(texto: string): string | undefined {
    const match = texto.match(REGEX_EDITAL)
    return match ? match[1].trim() : undefined
}

/**
 * Identifica o órgão licitante no texto
 */
function identificarOrgao(texto: string): string | undefined {
    const match = texto.match(REGEX_ORGAO)
    return match ? match[0].trim() : undefined
}

/**
 * Extrai itens de um bloco de texto de grupo
 */
function extrairItensDoGrupo(textoGrupo: string, nomeGrupo: string): ItemExtraido[] {
    const itens: ItemExtraido[] = []
    let match: RegExpExecArray | null

    // Reset do regex
    REGEX_ITEM.lastIndex = 0

    while ((match = REGEX_ITEM.exec(textoGrupo)) !== null) {
        const numeroItem = parseInt(match[1], 10)
        const descricao = match[2].trim()
        const quantidade = match[3] ? parseInt(match[3], 10) : 1

        itens.push({
            grupo: nomeGrupo,
            numero_item: numeroItem,
            descricao_bruta: descricao,
            unidade: 'un',
            quantidade,
        })
    }

    return itens
}

/**
 * Extrai grupos e itens do texto do PDF
 */
function extrairGrupos(texto: string): GrupoExtraido[] {
    const grupos: GrupoExtraido[] = []
    let match: RegExpExecArray | null

    // Reset do regex
    REGEX_GRUPO.lastIndex = 0

    // Primeiro, encontrar todos os grupos
    const matches: Array<{ numero: string; nome: string; inicio: number; fim: number }> = []

    while ((match = REGEX_GRUPO.exec(texto)) !== null) {
        matches.push({
            numero: match[1],
            nome: match[2].trim(),
            inicio: match.index,
            fim: match.index + match[0].length,
        })
    }

    // Se não encontrou grupos, criar um grupo padrão
    if (matches.length === 0) {
        const itens = extrairItensDoGrupo(texto, 'GRUPO ÚNICO')
        if (itens.length > 0) {
            grupos.push({
                numero: 1,
                nome: 'GRUPO ÚNICO',
                itens,
            })
        }
        return grupos
    }

    // Processar cada grupo
    for (let i = 0; i < matches.length; i++) {
        const grupoMatch = matches[i]
        const proximoInicio = matches[i + 1]?.inicio ?? texto.length
        const textoGrupo = texto.slice(grupoMatch.inicio, proximoInicio)

        // Converter número romano para decimal se necessário
        const numeroGrupo = converterRomanoParaDecimal(grupoMatch.numero)
        const nomeCompleto = `GRUPO ${grupoMatch.numero} – ${grupoMatch.nome}`

        const itens = extrairItensDoGrupo(textoGrupo, nomeCompleto)

        grupos.push({
            numero: numeroGrupo,
            nome: nomeCompleto,
            local: grupoMatch.nome,
            itens,
        })
    }

    return grupos
}

/**
 * Converte número romano para decimal
 */
function converterRomanoParaDecimal(romano: string): number {
    // Se já é número, retorna
    const num = parseInt(romano, 10)
    if (!isNaN(num)) return num

    const valores: Record<string, number> = {
        I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000
    }

    let resultado = 0
    const chars = romano.toUpperCase().split('')

    for (let i = 0; i < chars.length; i++) {
        const atual = valores[chars[i]] || 0
        const proximo = valores[chars[i + 1]] || 0

        if (atual < proximo) {
            resultado -= atual
        } else {
            resultado += atual
        }
    }

    return resultado || 1
}

/**
 * Faz o parsing completo do PDF e retorna estrutura organizada
 * @param pdfBuffer Buffer do arquivo PDF
 * @param nomeArquivo Nome original do arquivo
 * @returns Estrutura com grupos e itens extraídos
 */
export async function parsePDF(
    pdfBuffer: Buffer,
    nomeArquivo: string
): Promise<ResultadoParsing> {
    // Extrair texto do PDF
    const texto = await extrairTextoPDF(pdfBuffer)

    // Identificar metadados
    const numeroEdital = identificarEdital(texto)
    const orgao = identificarOrgao(texto)

    // Extrair grupos e itens
    const grupos = extrairGrupos(texto)

    return {
        nome_documento: nomeArquivo.replace(/\.pdf$/i, ''),
        numero_edital: numeroEdital,
        orgao,
        grupos,
        texto_completo: texto,
    }
}

/**
 * Extrai itens de forma simplificada (para testes/debug)
 * Útil quando o PDF não tem estrutura de grupos clara
 */
export function extrairItensSimplificado(texto: string): ItemExtraido[] {
    return extrairItensDoGrupo(texto, 'ITENS EXTRAÍDOS')
}

