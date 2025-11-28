import type { Metadata, Viewport } from "next";
import { Inter, Montserrat } from "next/font/google";
import "./globals.css";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import JsonLdSchema from "@/components/JsonLdSchema";
import DynamicFavicon from "@/components/DynamicFavicon";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const siteUrl = "https://www.grupoalfatecnologia.com.br";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#211915",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default:
      "Grupo Alfa Tecnologia | Ata de Registro de Preço - Fibra Óptica, CFTV e Cabeamento Estruturado",
    template: "%s | Grupo Alfa Tecnologia",
  },
  description:
    "Empresa com Ata de Registro de Preço (ARP) para contratação direta por órgãos públicos. Serviços de fibra óptica, cabeamento estruturado, CFTV, segurança eletrônica e infraestrutura de TI. Adesão rápida e segura via Lei 14.133/2021.",
  keywords: [
    // Keywords principais - Ata de Registro de Preço
    "ata de registro de preço",
    "ata de registro de preços",
    "ARP",
    "adesão ata de registro de preço",
    "ata de registro de preço fibra óptica",
    "ata de registro de preço cabeamento estruturado",
    "ata de registro de preço CFTV",
    "ata de registro de preço infraestrutura TI",
    "ata de registro de preço tecnologia",
    "ata de registro de preço segurança eletrônica",
    // Keywords de licitação
    "licitação fibra óptica",
    "licitação cabeamento estruturado",
    "licitação CFTV",
    "pregão eletrônico tecnologia",
    "contratação direta órgãos públicos",
    "Lei 14.133/2021",
    "sistema de registro de preços",
    "SRP",
    // Keywords de serviços
    "fibra óptica para órgãos públicos",
    "cabeamento estruturado governo",
    "CFTV órgãos públicos",
    "infraestrutura de TI setor público",
    "rede óptica órgãos públicos",
    "instalação fibra óptica",
    "fusão fibra óptica",
    "certificação rede",
    "câmeras IP órgãos públicos",
    "controle de acesso órgãos públicos",
    // Keywords geográficas
    "tecnologia Brasil",
    "infraestrutura TI nacional",
    "Brasília tecnologia",
    "empresa de tecnologia Distrito Federal",
    // Keywords de confiança
    "empresa especializada órgãos públicos",
    "experiência setor público",
    "projetos de grande porte",
  ],
  authors: [{ name: "Grupo Alfa Tecnologia", url: siteUrl }],
  creator: "Grupo Alfa Tecnologia",
  publisher: "Grupo Alfa Tecnologia",
  formatDetection: {
    email: true,
    address: true,
    telephone: true,
  },
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: siteUrl,
    siteName: "Grupo Alfa Tecnologia",
    title:
      "Grupo Alfa Tecnologia | Ata de Registro de Preço para Órgãos Públicos",
    description:
      "Contrate serviços de fibra óptica, cabeamento estruturado, CFTV e infraestrutura de TI através da nossa Ata de Registro de Preço. Processo rápido e seguro para órgãos públicos.",
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Grupo Alfa Tecnologia - Ata de Registro de Preço",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Grupo Alfa Tecnologia | Ata de Registro de Preço",
    description:
      "Serviços de fibra óptica, cabeamento estruturado e CFTV via Ata de Registro de Preço para órgãos públicos.",
    images: [`${siteUrl}/og-image.png`],
    creator: "@grupoalfatech",
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
  verification: {
    // Adicione seus códigos de verificação quando tiver
    // google: "seu-codigo-google",
    // yandex: "seu-codigo-yandex",
    // yahoo: "seu-codigo-yahoo",
  },
  category: "technology",
  classification: "Business",
  other: {
    "geo.region": "BR-DF",
    "geo.placename": "Brasília",
    "geo.position": "-15.7801;-47.9292",
    ICBM: "-15.7801, -47.9292",
    rating: "general",
    distribution: "global",
    revisit_after: "7 days",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="scroll-smooth">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <DynamicFavicon />
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
          crossOrigin="anonymous"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body
        className={`${inter.variable} ${montserrat.variable} antialiased`}
      >
        <JsonLdSchema />
        {children}
        <FloatingWhatsApp />
      </body>
    </html>
  );
}
