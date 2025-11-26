export interface EstadoInfo {
  sigla: string;
  nome: string;
  capital: string;
  regiao: string;
  projetos: string[];
  destaque?: string;
}

export const estadosInfo: Record<string, EstadoInfo> = {
  AC: {
    sigla: "AC",
    nome: "Acre",
    capital: "Rio Branco",
    regiao: "Norte",
    projetos: ["Infraestrutura de rede", "Cabeamento estruturado"],
  },
  AL: {
    sigla: "AL",
    nome: "Alagoas",
    capital: "Maceió",
    regiao: "Nordeste",
    projetos: ["Rede de fibra óptica", "Segurança eletrônica"],
  },
  AP: {
    sigla: "AP",
    nome: "Amapá",
    capital: "Macapá",
    regiao: "Norte",
    projetos: ["Infraestrutura de TI"],
  },
  AM: {
    sigla: "AM",
    nome: "Amazonas",
    capital: "Manaus",
    regiao: "Norte",
    projetos: ["Rede de fibra óptica", "Cabeamento estruturado", "Infraestrutura em áreas remotas"],
    destaque: "Projetos em áreas de difícil acesso",
  },
  BA: {
    sigla: "BA",
    nome: "Bahia",
    capital: "Salvador",
    regiao: "Nordeste",
    projetos: ["Segurança eletrônica", "Infraestrutura de rede", "Cabeamento estruturado"],
  },
  CE: {
    sigla: "CE",
    nome: "Ceará",
    capital: "Fortaleza",
    regiao: "Nordeste",
    projetos: ["Fibra óptica", "Segurança eletrônica"],
  },
  DF: {
    sigla: "DF",
    nome: "Distrito Federal",
    capital: "Brasília",
    regiao: "Centro-Oeste",
    projetos: ["Infraestrutura completa", "Cabeamento estruturado", "Segurança eletrônica", "Data centers"],
    destaque: "Sede de grandes projetos federais",
  },
  ES: {
    sigla: "ES",
    nome: "Espírito Santo",
    capital: "Vitória",
    regiao: "Sudeste",
    projetos: ["Rede de fibra óptica", "Cabeamento estruturado"],
  },
  GO: {
    sigla: "GO",
    nome: "Goiás",
    capital: "Goiânia",
    regiao: "Centro-Oeste",
    projetos: ["Base Aérea de Anápolis", "Infraestrutura militar", "Segurança eletrônica"],
    destaque: "Projetos militares de alta complexidade",
  },
  MA: {
    sigla: "MA",
    nome: "Maranhão",
    capital: "São Luís",
    regiao: "Nordeste",
    projetos: ["Infraestrutura de rede", "Cabeamento estruturado"],
  },
  MT: {
    sigla: "MT",
    nome: "Mato Grosso",
    capital: "Cuiabá",
    regiao: "Centro-Oeste",
    projetos: ["Fibra óptica", "Infraestrutura rural"],
  },
  MS: {
    sigla: "MS",
    nome: "Mato Grosso do Sul",
    capital: "Campo Grande",
    regiao: "Centro-Oeste",
    projetos: ["Rede de fibra óptica", "Segurança eletrônica"],
  },
  MG: {
    sigla: "MG",
    nome: "Minas Gerais",
    capital: "Belo Horizonte",
    regiao: "Sudeste",
    projetos: ["Infraestrutura de TI", "Cabeamento estruturado", "Segurança eletrônica"],
  },
  PA: {
    sigla: "PA",
    nome: "Pará",
    capital: "Belém",
    regiao: "Norte",
    projetos: ["Fibra óptica", "Infraestrutura em áreas remotas"],
    destaque: "Projetos em região amazônica",
  },
  PB: {
    sigla: "PB",
    nome: "Paraíba",
    capital: "João Pessoa",
    regiao: "Nordeste",
    projetos: ["Rede de fibra óptica", "Segurança eletrônica"],
  },
  PR: {
    sigla: "PR",
    nome: "Paraná",
    capital: "Curitiba",
    regiao: "Sul",
    projetos: ["Infraestrutura completa", "Data centers"],
  },
  PE: {
    sigla: "PE",
    nome: "Pernambuco",
    capital: "Recife",
    regiao: "Nordeste",
    projetos: ["Cabeamento estruturado", "Segurança eletrônica"],
  },
  PI: {
    sigla: "PI",
    nome: "Piauí",
    capital: "Teresina",
    regiao: "Nordeste",
    projetos: ["Infraestrutura de rede"],
  },
  RJ: {
    sigla: "RJ",
    nome: "Rio de Janeiro",
    capital: "Rio de Janeiro",
    regiao: "Sudeste",
    projetos: ["Segurança eletrônica", "Infraestrutura de TI", "Cabeamento estruturado"],
  },
  RN: {
    sigla: "RN",
    nome: "Rio Grande do Norte",
    capital: "Natal",
    regiao: "Nordeste",
    projetos: ["Fibra óptica", "Infraestrutura de rede"],
  },
  RS: {
    sigla: "RS",
    nome: "Rio Grande do Sul",
    capital: "Porto Alegre",
    regiao: "Sul",
    projetos: ["Infraestrutura de TI", "Segurança eletrônica"],
  },
  RO: {
    sigla: "RO",
    nome: "Rondônia",
    capital: "Porto Velho",
    regiao: "Norte",
    projetos: ["Rede de fibra óptica", "Infraestrutura em áreas remotas"],
  },
  RR: {
    sigla: "RR",
    nome: "Roraima",
    capital: "Boa Vista",
    regiao: "Norte",
    projetos: ["Infraestrutura de rede"],
  },
  SC: {
    sigla: "SC",
    nome: "Santa Catarina",
    capital: "Florianópolis",
    regiao: "Sul",
    projetos: ["Cabeamento estruturado", "Segurança eletrônica"],
  },
  SP: {
    sigla: "SP",
    nome: "São Paulo",
    capital: "São Paulo",
    regiao: "Sudeste",
    projetos: ["Infraestrutura completa", "Data centers", "Segurança eletrônica"],
    destaque: "Hub de grandes projetos",
  },
  SE: {
    sigla: "SE",
    nome: "Sergipe",
    capital: "Aracaju",
    regiao: "Nordeste",
    projetos: ["Rede de fibra óptica"],
  },
  TO: {
    sigla: "TO",
    nome: "Tocantins",
    capital: "Palmas",
    regiao: "Norte",
    projetos: ["Infraestrutura de rede", "Cabeamento estruturado"],
  },
};

// Cores por região
export const coresRegiao: Record<string, string> = {
  Norte: "#10b981",
  Nordeste: "#f59e0b",
  "Centro-Oeste": "#8b5cf6",
  Sudeste: "#ef4444",
  Sul: "#3b82f6",
};

