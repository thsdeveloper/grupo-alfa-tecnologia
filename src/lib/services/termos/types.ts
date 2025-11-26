// Tipos para o módulo de Termos de Referência

export type CategoriaEquipamento =
    | 'camera'
    | 'switch'
    | 'nobreak'
    | 'servidor'
    | 'rack'
    | 'acessorio'
    | 'software'
    | 'outros'

export type StatusTermo =
    | 'pendente'
    | 'processando'
    | 'processado'
    | 'erro'
    | 'revisado'

export type StatusItem =
    | 'pendente'
    | 'normalizado'
    | 'sugerido'
    | 'confirmado'
    | 'erro'

export type EtapaProcessamento =
    | 'upload'
    | 'parsing'
    | 'extracao'
    | 'normalizacao'
    | 'matching'
    | 'exportacao'

// Estrutura de item extraído do PDF
export interface ItemExtraido {
    grupo: string
    numero_item: number
    descricao_bruta: string
    unidade: string
    quantidade: number
    valor_estimado?: number
}

// Estrutura de grupo extraído do PDF
export interface GrupoExtraido {
    numero: number
    nome: string
    local?: string
    itens: ItemExtraido[]
}

// Resultado do parsing do PDF
export interface ResultadoParsing {
    nome_documento: string
    numero_edital?: string
    orgao?: string
    grupos: GrupoExtraido[]
    texto_completo: string
}

// Dados normalizados do item (gerados pela IA)
export interface DadosNormalizados {
    categoria: CategoriaEquipamento
    tecnologia?: string
    formato?: string
    tipo_lente?: string
    ptz?: boolean
    varifocal?: boolean
    resolucao_min_mp?: number
    poe?: boolean
    ir_metros?: number
    potencia_va?: number
    portas?: number
    velocidade?: string
    capacidade_armazenamento_tb?: number
    observacoes?: string
    confidence: number
}

// Equipamento candidato para matching
export interface EquipamentoCandidato {
    id: string
    nome_comercial: string
    fabricante: string | null
    categoria: string
    formato: string | null
    tecnologia: string | null
    resolucao_mp: number | null
    varifocal: boolean | null
    ptz: boolean | null
    poe: boolean | null
    ir_metros: number | null
    potencia_va: number | null
    portas: number | null
    velocidade: string | null
    capacidade_armazenamento_tb: number | null
    caracteristicas_livres: string | null
    preco_venda: number | null
}

// Resultado do matching
export interface ResultadoMatching {
    equipamento_id: string
    nome_comercial: string
    aderencia_percentual: number
    comentario: string
    is_principal: boolean
    ranking: number
}

// Sugestão completa para um item
export interface SugestaoItem {
    item_id: string
    numero_item: number
    descricao_bruta: string
    dados_normalizados: DadosNormalizados | null
    sugestao_principal: ResultadoMatching | null
    alternativas: ResultadoMatching[]
}

// Resposta da API de normalização (LLM)
export interface RespostaNormalizacaoLLM {
    categoria: CategoriaEquipamento
    tecnologia?: string
    formato?: string
    tipo_lente?: string
    ptz?: boolean
    varifocal?: boolean
    resolucao_min_mp?: number
    poe?: boolean
    ir_metros?: number
    potencia_va?: number
    portas?: number
    velocidade?: string
    capacidade_armazenamento_tb?: number
    observacoes?: string
}

// Resposta da API de matching (LLM)
export interface RespostaMatchingLLM {
    principal: {
        equipamento_id: string
        aderencia_percentual: number
        comentario: string
    }
    alternativas: Array<{
        equipamento_id: string
        aderencia_percentual: number
        comentario: string
    }>
}

