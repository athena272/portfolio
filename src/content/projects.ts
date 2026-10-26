import type { Project } from "@/types/content";

/** Curated order: flagship work first. */
export const projects: Project[] = [
  {
    id: "clinicroom",
    name: "ClinicRoom",
    tagline: {
      pt: "Agendamento de salas do ambulatório do HU-UFS",
      en: "Room scheduling for the HU-UFS outpatient clinic",
    },
    description: {
      pt: "Reescrevi o sistema por conta própria, migrando o backend de Java/Spring com PostgreSQL para NestJS com MongoDB Atlas e o frontend de Angular para React 19. Reservas avulsas e recorrentes com detecção de conflitos, quatro perfis de acesso, trilha de auditoria, alertas por e-mail e cerca de 750 testes automatizados.",
      en: "A solo rewrite that moved the backend from Java/Spring with PostgreSQL to NestJS with MongoDB Atlas and the frontend from Angular to React 19. One-off and recurring bookings with conflict detection, four access profiles, an audit trail, email alerts and about 750 automated tests.",
    },
    period: { start: "2026-03", end: "present" },
    stack: [
      "React",
      "TypeScript",
      "NestJS",
      "MongoDB",
      "TanStack Query",
      "Tailwind CSS",
      "shadcn/ui",
      "Vitest",
      "MSW",
    ],
    links: { live: "https://gestao-salas-hu.vercel.app" },
  },
  {
    id: "sost",
    name: "SOST",
    tagline: {
      pt: "Painel de acidentes de trabalho de um hospital universitário",
      en: "Workplace accident dashboard for a university hospital",
    },
    description: {
      pt: "Aplicação que substituiu uma planilha mantida por 12 anos no registro de Comunicações de Acidente de Trabalho (CAT), com dados alinhados ao evento S-2210 do eSocial, indicadores e gráficos para a equipe de saúde ocupacional e pipeline de CI no GitHub Actions.",
      en: "An application that replaced a spreadsheet kept for 12 years to record workplace accident reports (CAT), with data aligned to the eSocial S-2210 event, indicators and charts for the occupational health team, and a CI pipeline on GitHub Actions.",
    },
    period: { start: "2026-09", end: "present" },
    stack: [
      "React 19",
      "NestJS",
      "MongoDB",
      "Mongoose",
      "Recharts",
      "Jest",
      "Vitest",
      "GitHub Actions",
    ],
    links: { live: "https://sost-dashboard.vercel.app" },
  },
  {
    id: "conos",
    name: "Conos",
    tagline: {
      pt: "Controle de estoque e dispensação de medicamentos",
      en: "Medication stock and dispensing control",
    },
    description: {
      pt: "Migrei o projeto para TypeScript e de MySQL para MongoDB com transações. Controle de acesso por perfil, trilha de auditoria, entrada de lotes por código de barras GS1, simulador de duração de estoque e dashboards de consumo.",
      en: "Migrated the project to TypeScript and from MySQL to MongoDB with transactions. Role-based access control, an audit trail, batch entry through GS1 barcodes, a stock duration simulator and consumption dashboards.",
    },
    period: { start: "2026-02", end: "present" },
    stack: [
      "React",
      "TypeScript",
      "Vite",
      "PrimeReact",
      "Chart.js",
      "Node.js",
      "Express",
      "MongoDB",
      "Vitest",
    ],
    links: { live: "https://conos-hu.vercel.app" },
  },
  {
    id: "lyra",
    name: "Lyra",
    tagline: {
      pt: "Rede social de música registrada no INPI",
      en: "Music social network registered at INPI",
    },
    description: {
      pt: "Aplicativo desenvolvido por uma equipe de 8 pessoas na UFS e registrado no INPI (BR512025002036-8). Tive a maior contribuição no frontend em React Native com Expo: feed com stories, player de música, avaliações e perfil, com builds via EAS.",
      en: "An app built by a team of 8 at UFS and registered at INPI, the Brazilian patent office (BR512025002036-8). I was the main frontend contributor in React Native with Expo: a feed with stories, a music player, reviews and profiles, with builds through EAS.",
    },
    period: { start: "2024-08", end: "2025-03" },
    stack: [
      "React Native",
      "Expo",
      "TypeScript",
      "Expo Router",
      "NestJS",
      "Prisma",
      "PostgreSQL",
      "Spotify API",
      "Docker",
      "AWS",
    ],
    links: {
      certificate: "https://drive.google.com/file/d/1-2rEFNx203JK84MyGr65VTXlA1-jpdny/view",
    },
  },
  {
    id: "trabalha-brasil",
    name: "Trabalha Brasil e RedTrabaje",
    tagline: {
      pt: "Portais de emprego do grupo BNE",
      en: "Job portals from the BNE group",
    },
    description: {
      pt: "Páginas renderizadas no servidor em ASP.NET Core MVC (Razor), com SEO técnico baseado em dados estruturados schema.org e análise de comportamento com Mixpanel, atendendo candidatos no Brasil e na América Latina.",
      en: "Server-rendered pages in ASP.NET Core MVC (Razor), with technical SEO based on schema.org structured data and behavior analytics through Mixpanel, serving candidates in Brazil and Latin America.",
    },
    period: { start: "2022-09", end: "2025-09" },
    stack: ["ASP.NET Core MVC", "Razor", "TypeScript", "SCSS", "schema.org", "Mixpanel"],
    links: { live: "https://www.trabalhabrasil.com.br/" },
  },
  {
    id: "redacao-brasil",
    name: "Redação Brasil",
    tagline: {
      pt: "Plataforma de correção de redações para o ENEM",
      en: "Essay review platform for the ENEM exam",
    },
    description: {
      pt: "Desenvolvi o frontend em Next.js da plataforma, com autenticação e atualizações em tempo real pelo Supabase e acompanhamento de uso com Google Analytics.",
      en: "Built the platform's Next.js frontend, with authentication and real-time updates through Supabase and usage tracking with Google Analytics.",
    },
    period: { start: "2024-07", end: "2025-02" },
    stack: ["Next.js", "React", "Supabase", "Axios", "Google Analytics"],
    links: { live: "https://redacaobrasil.com" },
  },
  {
    id: "carolina-online",
    name: "Carolina Online",
    tagline: {
      pt: "Site institucional de um provedor de internet",
      en: "Corporate website for an internet provider",
    },
    description: {
      pt: "Site desenvolvido em PHP com WordPress e Elementor, com componentes em jQuery e Bootstrap e otimizações de SEO para melhorar a presença nas buscas locais.",
      en: "A website built in PHP with WordPress and Elementor, with jQuery and Bootstrap components and SEO optimizations to improve its presence in local search.",
    },
    period: { start: "2024-06", end: "2024-08" },
    stack: ["PHP", "WordPress", "Elementor", "jQuery", "Bootstrap"],
    links: { live: "https://www.carolinaonline.com.br" },
  },
];
