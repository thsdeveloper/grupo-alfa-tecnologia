export interface Servico {
  slug: string;
  title: string;
  shortTitle: string;
  subtitle: string;
  description: string;
  longDescription: string;
  features: string[];
  benefits: {
    title: string;
    description: string;
  }[];
  applications: string[];
  arpItems: {
    item: string;
    descricao: string;
    unidade: string;
  }[];
  keywords: string[];
  icon: string; // SVG path
  backgroundImage: string; // Imagem de fundo da página do serviço
}

export const servicos: Servico[] = [
  {
    slug: "rede-optica",
    title: "Rede Óptica e Fibra Óptica",
    shortTitle: "Rede Óptica",
    subtitle: "Infraestrutura de Fibra Óptica para Órgãos Públicos",
    description:
      "Soluções completas em fibra óptica, GPON, backbone, infraestrutura subterrânea e aérea para redes de alta velocidade.",
    longDescription:
      "O Grupo Alfa Tecnologia é especialista em projetos de rede óptica para órgãos públicos em todo o Brasil. Oferecemos soluções completas desde o projeto até a execução, incluindo instalação de fibra óptica monomodo e multimodo, fusão, certificação e ativação de enlaces. Nossa equipe possui experiência em projetos de grande porte, com instalações que vão de poucos metros a centenas de quilômetros, atendendo às mais rigorosas especificações técnicas exigidas em licitações públicas.",
    features: [
      "Fibra Óptica Monomodo e Multimodo",
      "Tecnologia GPON/EPON",
      "Backbone Óptico",
      "Infraestrutura Subterrânea",
      "Infraestrutura Aérea",
      "Fusão de Fibra Óptica",
      "Certificação de Enlace Óptico",
      "OTDR e Testes de Qualidade",
      "DIO e Racks Ópticos",
      "Splitters e Conversores",
    ],
    benefits: [
      {
        title: "Alta Velocidade",
        description:
          "Transmissão de dados em velocidades de até 100 Gbps, ideal para grandes volumes de informação.",
      },
      {
        title: "Baixa Latência",
        description:
          "Conexões com latência mínima, essenciais para aplicações em tempo real e videoconferências.",
      },
      {
        title: "Imunidade a Interferências",
        description:
          "A fibra óptica não sofre interferências eletromagnéticas, garantindo estabilidade.",
      },
      {
        title: "Longas Distâncias",
        description:
          "Possibilidade de instalação em longas distâncias sem perda significativa de sinal.",
      },
    ],
    applications: [
      "Interligação de prédios públicos",
      "Backbone de campus universitários",
      "Redes metropolitanas",
      "Data centers governamentais",
      "Hospitais e unidades de saúde",
      "Tribunais e fóruns",
      "Escolas e instituições de ensino",
      "Quartéis e instalações militares",
    ],
    arpItems: [
      {
        item: "01",
        descricao: "Instalação de Fibra Óptica (por metro)",
        unidade: "Metro",
      },
      {
        item: "02",
        descricao: "Fusão de Fibra Óptica",
        unidade: "Unidade",
      },
      {
        item: "03",
        descricao: "Certificação de Enlace Óptico",
        unidade: "Ponto",
      },
    ],
    keywords: [
      "fibra óptica órgãos públicos",
      "instalação fibra óptica",
      "ata de registro de preço fibra óptica",
      "fusão fibra óptica",
      "rede óptica governo",
      "backbone óptico",
      "GPON órgãos públicos",
      "licitação fibra óptica",
      "certificação fibra óptica",
    ],
    icon: "M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1",
    backgroundImage: "/servicos/fibra-optica.png",
  },
  {
    slug: "rede-logica",
    title: "Rede Lógica e Cabeamento Estruturado",
    shortTitle: "Rede Lógica",
    subtitle: "Cabeamento Estruturado Cat6 e Cat6A para Órgãos Públicos",
    description:
      "Cabeamento estruturado de alta performance. Categoria 6 e 6A para ambientes corporativos e data centers.",
    longDescription:
      "Somos especialistas em projetos de cabeamento estruturado para órgãos públicos, seguindo as normas ABNT NBR 14565 e EIA/TIA 568. Executamos instalações de cabeamento categoria 6 e 6A, garantindo certificação de todos os pontos instalados. Nossa equipe trabalha com os principais fabricantes do mercado, assegurando qualidade e durabilidade das instalações por mais de 25 anos.",
    features: [
      "Cabeamento Categoria 6",
      "Cabeamento Categoria 6A",
      "Patch Panels e Patch Cords",
      "Racks e Gabinetes",
      "Certificação Fluke",
      "Identificação e Etiquetagem",
      "Canaletas e Eletrocalhas",
      "Tomadas e Espelhos RJ45",
      "Organizadores de Cabos",
      "Documentação As-Built",
    ],
    benefits: [
      {
        title: "Alta Performance",
        description:
          "Suporte a velocidades de até 10 Gbps com cabeamento Cat6A.",
      },
      {
        title: "Certificação Garantida",
        description:
          "Todos os pontos são certificados com equipamentos Fluke, garantindo conformidade.",
      },
      {
        title: "Organização",
        description:
          "Instalações organizadas e documentadas, facilitando manutenção futura.",
      },
      {
        title: "Durabilidade",
        description:
          "Materiais de primeira linha com garantia de 25 anos dos fabricantes.",
      },
    ],
    applications: [
      "Escritórios e repartições públicas",
      "Data centers governamentais",
      "Salas de TI e CPDs",
      "Laboratórios de informática",
      "Call centers públicos",
      "Centros de operações",
      "Auditórios e salas de reunião",
      "Recepções e balcões de atendimento",
    ],
    arpItems: [
      {
        item: "04",
        descricao: "Instalação de Ponto de Rede Lógica Cat6",
        unidade: "Ponto",
      },
      {
        item: "05",
        descricao: "Instalação de Ponto de Rede Lógica Cat6A",
        unidade: "Ponto",
      },
      {
        item: "06",
        descricao: "Certificação de Ponto de Rede",
        unidade: "Ponto",
      },
    ],
    keywords: [
      "cabeamento estruturado órgãos públicos",
      "rede lógica governo",
      "ata de registro de preço cabeamento estruturado",
      "instalação ponto de rede",
      "cabeamento cat6",
      "cabeamento cat6a",
      "certificação rede",
      "licitação cabeamento estruturado",
    ],
    icon: "M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z",
    backgroundImage: "/servicos/rede-logica.png",
  },
  {
    slug: "cftv-seguranca",
    title: "CFTV e Segurança Eletrônica",
    shortTitle: "CFTV e Segurança",
    subtitle: "Sistemas de Monitoramento e Vigilância para Órgãos Públicos",
    description:
      "Sistemas de monitoramento e vigilância. Câmeras IP, DVR/NVR, analytics e monitoramento 24/7.",
    longDescription:
      "O Grupo Alfa Tecnologia oferece soluções completas em CFTV e segurança eletrônica para órgãos públicos. Trabalhamos com as principais marcas do mercado como Hikvision, Intelbras, Axis e Dahua. Nossos projetos incluem desde pequenas instalações até sistemas de monitoramento de cidades inteligentes, com analytics de vídeo, reconhecimento facial e integração com centrais de monitoramento.",
    features: [
      "Câmeras IP Full HD e 4K",
      "Câmeras PTZ e Speed Dome",
      "NVR e DVR",
      "Analytics de Vídeo",
      "Reconhecimento Facial",
      "LPR (Leitura de Placas)",
      "Monitoramento 24/7",
      "Integração com Alarmes",
      "Armazenamento em Nuvem",
      "Acesso Remoto Mobile",
    ],
    benefits: [
      {
        title: "Segurança 24 Horas",
        description:
          "Monitoramento contínuo com gravação e alertas em tempo real.",
      },
      {
        title: "Inteligência Artificial",
        description:
          "Analytics avançado para detecção de comportamentos suspeitos.",
      },
      {
        title: "Acesso Remoto",
        description:
          "Visualização das câmeras de qualquer lugar via smartphone ou computador.",
      },
      {
        title: "Integração Total",
        description:
          "Conexão com sistemas de alarme, controle de acesso e automação.",
      },
    ],
    applications: [
      "Prédios públicos e repartições",
      "Escolas e universidades",
      "Hospitais e unidades de saúde",
      "Presídios e delegacias",
      "Praças e áreas públicas",
      "Rodovias e vias urbanas",
      "Portos e aeroportos",
      "Centros de eventos",
    ],
    arpItems: [
      {
        item: "07",
        descricao: "Instalação de Câmera CFTV IP",
        unidade: "Unidade",
      },
      {
        item: "08",
        descricao: "Configuração de NVR/DVR",
        unidade: "Unidade",
      },
    ],
    keywords: [
      "CFTV órgãos públicos",
      "câmeras IP governo",
      "ata de registro de preço CFTV",
      "sistema de monitoramento",
      "segurança eletrônica órgãos públicos",
      "instalação câmeras",
      "licitação CFTV",
      "videomonitoramento",
    ],
    icon: "M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z",
    backgroundImage: "/servicos/cftv.png",
  },
  {
    slug: "controle-acesso",
    title: "Controle de Acesso",
    shortTitle: "Controle de Acesso",
    subtitle: "Soluções de Controle de Acesso Físico para Órgãos Públicos",
    description:
      "Soluções integradas de controle de acesso físico. Biometria, cartões, catracas e integração com sistemas.",
    longDescription:
      "Oferecemos soluções completas de controle de acesso para órgãos públicos, desde sistemas simples de fechaduras eletrônicas até complexos sistemas de gestão de acesso com biometria, reconhecimento facial e integração com sistemas de ponto. Nossa experiência inclui projetos para tribunais, presídios, hospitais e demais órgãos que necessitam de controle rigoroso de acesso.",
    features: [
      "Biometria Digital e Facial",
      "Cartões de Proximidade (RFID)",
      "Catracas e Torniquetes",
      "Fechaduras Eletrônicas",
      "Controladoras de Acesso",
      "Leitores de QR Code",
      "Integração com Ponto Eletrônico",
      "Software de Gestão de Acesso",
      "Relatórios de Movimentação",
      "Integração com CFTV",
    ],
    benefits: [
      {
        title: "Segurança Reforçada",
        description:
          "Controle preciso de quem entra e sai das instalações.",
      },
      {
        title: "Registro Completo",
        description:
          "Histórico detalhado de todas as movimentações para auditoria.",
      },
      {
        title: "Múltiplas Tecnologias",
        description:
          "Combinação de biometria, cartão e senha para maior segurança.",
      },
      {
        title: "Gestão Centralizada",
        description:
          "Software para gerenciamento de usuários, permissões e relatórios.",
      },
    ],
    applications: [
      "Tribunais e fóruns",
      "Presídios e delegacias",
      "Prédios administrativos",
      "Hospitais e clínicas",
      "Data centers",
      "Laboratórios",
      "Áreas restritas",
      "Estacionamentos",
    ],
    arpItems: [
      {
        item: "09",
        descricao: "Instalação de Controle de Acesso",
        unidade: "Ponto",
      },
    ],
    keywords: [
      "controle de acesso órgãos públicos",
      "biometria governo",
      "ata de registro de preço controle de acesso",
      "catracas órgãos públicos",
      "fechadura eletrônica",
      "licitação controle de acesso",
      "sistema de acesso",
    ],
    icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z",
    backgroundImage: "/servicos/controle-acesso.png",
  },
  {
    slug: "rede-eletrica",
    title: "Rede Elétrica e Infraestrutura",
    shortTitle: "Rede Elétrica",
    subtitle: "Infraestrutura Elétrica para TI em Órgãos Públicos",
    description:
      "Infraestrutura elétrica para TI. Nobreaks, estabilizadores, aterramento e sistemas de energia.",
    longDescription:
      "O Grupo Alfa Tecnologia executa projetos de infraestrutura elétrica especializada para ambientes de TI em órgãos públicos. Nossos serviços incluem dimensionamento e instalação de nobreaks, sistemas de aterramento, quadros de distribuição dedicados e passagem de infraestrutura elétrica. Trabalhamos em conformidade com as normas NR-10 e NBR 5410, garantindo segurança e qualidade.",
    features: [
      "Nobreaks e UPS",
      "Estabilizadores de Tensão",
      "Aterramento para TI",
      "Quadros de Distribuição",
      "PDUs (Power Distribution Units)",
      "Geradores de Emergência",
      "Passagem de Infraestrutura",
      "Eletrocalhas e Eletrodutos",
      "Circuitos Estabilizados",
      "Medição e Monitoramento",
    ],
    benefits: [
      {
        title: "Proteção de Equipamentos",
        description:
          "Nobreaks e estabilizadores protegem equipamentos contra variações de energia.",
      },
      {
        title: "Continuidade de Operação",
        description:
          "Sistemas de backup garantem funcionamento mesmo durante quedas de energia.",
      },
      {
        title: "Segurança",
        description:
          "Instalações em conformidade com normas técnicas e de segurança.",
      },
      {
        title: "Eficiência Energética",
        description:
          "Projetos otimizados para redução do consumo de energia.",
      },
    ],
    applications: [
      "Data centers",
      "Salas de TI e CPDs",
      "Laboratórios de informática",
      "Centros de operação",
      "Equipamentos de missão crítica",
      "Servidores e storage",
      "Equipamentos de rede",
      "Sistemas de segurança",
    ],
    arpItems: [
      {
        item: "10",
        descricao: "Passagem de Infraestrutura (eletroduto/eletrocalha)",
        unidade: "Metro",
      },
    ],
    keywords: [
      "infraestrutura elétrica TI",
      "nobreak órgãos públicos",
      "ata de registro de preço infraestrutura",
      "aterramento data center",
      "rede elétrica governo",
      "licitação infraestrutura elétrica",
    ],
    icon: "M13 10V3L4 14h7v7l9-11h-7z",
    backgroundImage: "/servicos/rede-eletrica.png",
  },
  {
    slug: "consultoria-projetos",
    title: "Consultoria e Projetos de TI",
    shortTitle: "Consultoria e Projetos",
    subtitle: "Consultoria Especializada em Infraestrutura de TI",
    description:
      "Consultoria especializada e execução de projetos tecnológicos complexos. Do planejamento à entrega.",
    longDescription:
      "O Grupo Alfa Tecnologia oferece consultoria especializada em infraestrutura de TI para órgãos públicos. Nossa equipe de engenheiros e especialistas elabora projetos completos, desde o levantamento de necessidades até a entrega final, passando por dimensionamento, especificação técnica e acompanhamento de execução. Auxiliamos também na elaboração de termos de referência para licitações.",
    features: [
      "Levantamento de Necessidades",
      "Elaboração de Projetos",
      "Especificações Técnicas",
      "Termos de Referência",
      "Análise de Viabilidade",
      "Dimensionamento de Soluções",
      "Acompanhamento de Obras",
      "Fiscalização Técnica",
      "Documentação As-Built",
      "Treinamento de Equipes",
    ],
    benefits: [
      {
        title: "Experiência Comprovada",
        description:
          "Mais de 500 projetos executados em órgãos públicos de todo o Brasil.",
      },
      {
        title: "Conformidade Legal",
        description:
          "Projetos em conformidade com normas técnicas e legislação de licitações.",
      },
      {
        title: "Economia",
        description:
          "Dimensionamento adequado evita gastos desnecessários e subdimensionamento.",
      },
      {
        title: "Suporte Completo",
        description:
          "Acompanhamento desde a concepção até a entrega do projeto.",
      },
    ],
    applications: [
      "Novos prédios públicos",
      "Reformas e adequações",
      "Modernização de infraestrutura",
      "Expansão de redes",
      "Migração de data centers",
      "Projetos de cidades inteligentes",
      "Sistemas integrados",
      "Auditorias técnicas",
    ],
    arpItems: [],
    keywords: [
      "consultoria TI órgãos públicos",
      "projetos infraestrutura governo",
      "termo de referência TI",
      "consultoria tecnologia",
      "projetos de rede",
      "licitação consultoria TI",
    ],
    icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
    backgroundImage: "/servicos/consultoria-projetos.png",
  },
];

export function getServicoBySlug(slug: string): Servico | undefined {
  return servicos.find((s) => s.slug === slug);
}

export function getAllServicosSlug(): string[] {
  return servicos.map((s) => s.slug);
}

