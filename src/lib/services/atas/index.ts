/**
 * Serviço de ATAs de Registro de Preço
 * 
 * Fornece funcionalidades para:
 * - Parsing de PDFs de ATAs usando IA
 * - Extração de dados estruturados
 * - Geração de slugs
 */

export { parseAtaPDF, extrairTextoPDF, gerarSlugAta } from './ataParser';
export type { 
  DadosAtaExtraidos, 
  LoteExtraido, 
  ItemExtraido, 
  ResultadoParsingAta 
} from './types';

