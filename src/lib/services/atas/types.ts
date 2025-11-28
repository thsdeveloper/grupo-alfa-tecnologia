/**
 * Tipos para o serviço de parsing de ATAs
 */

// Dados extraídos da ATA pelo parsing
export interface DadosAtaExtraidos {
  numero_ata: string;
  orgao_gerenciador: string;
  orgao_gerenciador_sigla?: string;
  modalidade: string;
  numero_planejamento?: string;
  fornecedor_nome: string;
  fornecedor_cnpj: string;
  vigencia_meses?: number;
  base_legal?: string;
  objeto?: string;
  data_inicio?: string;
  data_fim?: string;
  lotes: LoteExtraido[];
}

export interface LoteExtraido {
  numero: string;
  descricao?: string;
  itens: ItemExtraido[];
}

export interface ItemExtraido {
  numero_item: string;
  descricao: string;
  unidade: string;
  quantidade: number;
  preco_unitario: number;
}

// Resposta do LLM para extração de dados
export interface RespostaExtracao {
  numero_ata: string;
  orgao_gerenciador: string;
  orgao_gerenciador_sigla?: string;
  modalidade: string;
  numero_planejamento?: string;
  fornecedor_nome: string;
  fornecedor_cnpj: string;
  vigencia_meses?: number;
  base_legal?: string;
  objeto?: string;
  data_inicio?: string;
  data_fim?: string;
  lotes: Array<{
    numero: string;
    descricao?: string;
    itens: Array<{
      numero_item: string;
      descricao: string;
      unidade: string;
      quantidade: number;
      preco_unitario: number;
    }>;
  }>;
  confidence: number;
}

// Resultado do parsing completo
export interface ResultadoParsingAta {
  sucesso: boolean;
  dados?: DadosAtaExtraidos;
  erro?: string;
  texto_original?: string;
  confidence?: number;
}

