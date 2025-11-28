import type { Metadata } from "next";

const siteUrl = "https://www.grupoalfatecnologia.com.br";

export const metadata: Metadata = {
  title:
    "Ata de Registro de Preço Nº 264/2025 | SEPLAG-MG | Cabeamento Estruturado e Infraestrutura de Rede",
  description:
    "Ata de Registro de Preço (ARP) Nº 264/2025 - SEPLAG-MG do Grupo Alfa Tecnologia para contratação direta de serviços de cabeamento estruturado, infraestrutura de rede, fibra óptica e instalações elétricas. Lotes 2, 4 e 5. Adesão rápida e segura conforme Lei 14.133/2021 e Decreto 48.779/2024.",
  keywords: [
    // Keywords principais
    "ata de registro de preço",
    "ata de registro de preços",
    "ARP 264/2025",
    "SEPLAG MG",
    "adesão ata de registro de preço",
    "como aderir ata de registro de preço",
    "consultar ata de registro de preço",
    // Keywords específicas de serviços
    "ata de registro de preço cabeamento estruturado",
    "ata de registro de preço rede lógica",
    "ata de registro de preço fibra óptica",
    "ata de registro de preço infraestrutura de rede",
    "ata de registro de preço ponto de rede",
    "ata de registro de preço eletroduto",
    "ata de registro de preço eletrocalha",
    "ata de registro de preço cabo UTP",
    // Keywords de licitação
    "contratação direta órgãos públicos",
    "dispensa de licitação",
    "Lei 14.133/2021",
    "Decreto 48.779/2024",
    "nova lei de licitações",
    "sistema de registro de preços",
    "SRP",
    "pregão eletrônico",
    "adesão ARP órgãos públicos",
    // Keywords de benefícios
    "contratação sem licitação",
    "preços homologados",
    "contratação rápida governo",
    // Keywords geográficas
    "ata de registro de preço Brasil",
    "ata de registro de preço Minas Gerais",
    "ata de registro de preço federal",
    "ata de registro de preço estadual",
    "ata de registro de preço municipal",
  ],
  alternates: {
    canonical: `${siteUrl}/ata-registro-preco`,
  },
  openGraph: {
    title:
      "Ata de Registro de Preço Nº 264/2025 | SEPLAG-MG - Grupo Alfa Tecnologia",
    description:
      "Contrate serviços de cabeamento estruturado, infraestrutura de rede e fibra óptica via Ata de Registro de Preço. Processo rápido, seguro e conforme a Lei 14.133/2021 para órgãos públicos.",
    url: `${siteUrl}/ata-registro-preco`,
    siteName: "Grupo Alfa Tecnologia",
    images: [
      {
        url: `${siteUrl}/og-ata-registro-preco.png`,
        width: 1200,
        height: 630,
        alt: "Ata de Registro de Preço 264/2025 - Grupo Alfa Tecnologia",
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ata de Registro de Preço Nº 264/2025 | Grupo Alfa Tecnologia",
    description:
      "Serviços de cabeamento estruturado, infraestrutura de rede e fibra óptica via ARP SEPLAG-MG para órgãos públicos.",
    images: [`${siteUrl}/og-ata-registro-preco.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function AtaRegistroPrecoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

