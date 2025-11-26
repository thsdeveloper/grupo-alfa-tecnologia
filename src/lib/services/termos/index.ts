/**
 * Módulo de Termos de Referência
 * 
 * Exporta todos os serviços relacionados ao processamento
 * de Termos de Referência de licitações.
 */

// Tipos
export * from './types'

// Serviços
export { parsePDF, extrairTextoPDF, extrairItensSimplificado } from './pdfParser'
export {
    normalizarItem,
    normalizarItemOpenAI,
    normalizarItemAnthropic,
    normalizarItensEmLote
} from './itemNormalizer'
export {
    buscarCandidatosPorCategoria,
    buscarCandidatosComFiltros,
    matchingComLLM,
    matchingSimples,
    executarMatching
} from './matchingService'

