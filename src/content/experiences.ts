import type { Experience } from "@/types/content";

/** Most recent first. The content tests enforce this order. */
export const experiences: Experience[] = [
  {
    id: "gol-software",
    company: "Gol Software",
    role: { pt: "Desenvolvimento de Software Full Stack", en: "Full Stack Software Developer" },
    location: { pt: "Belém, Pará, Brasil", en: "Belém, Pará, Brazil" },
    period: { start: "2026-09", end: "present" },
    summary: {
      pt: "Desenvolvimento e manutenção do GOL RH, plataforma de gestão de pessoas usada por órgãos públicos e empresas em todo o Brasil, com módulos de folha de pagamento, eSocial, ponto eletrônico e portal do servidor.",
      en: "Development and maintenance of GOL RH, a people management platform used by public agencies and companies across Brazil, with payroll, eSocial, time tracking and employee portal modules.",
    },
    highlights: [
      {
        pt: "Trabalho full stack em Java e JavaScript sobre a arquitetura própria da empresa (Servlets e JSP em Tomcat), com SQL Server e Oracle.",
        en: "Full stack work in Java and JavaScript on the company's in-house architecture (Servlets and JSP on Tomcat), with SQL Server and Oracle.",
      },
      {
        pt: "Introduzi os primeiros testes unitários automatizados (JUnit 5) no build do produto principal.",
        en: "Introduced the first automated unit tests (JUnit 5) into the main product's build.",
      },
      {
        pt: "Desenvolvi scripts T-SQL transacionais e reexecutáveis para correção de dados de clientes, validados por testes automatizados sobre snapshots do banco.",
        en: "Wrote transactional, re-runnable T-SQL scripts to fix customer data, validated by automated tests against database snapshots.",
      },
    ],
    stack: [
      "Java",
      "JavaScript",
      "JSP",
      "Servlets",
      "jQuery",
      "SQL Server",
      "Oracle",
      "Tomcat",
      "JUnit",
    ],
  },
  {
    id: "wefit",
    company: "WeFit - Digital Service Design",
    role: { pt: "Desenvolvimento de Software (Sênior)", en: "Senior Software Developer" },
    location: { pt: "São Paulo, Brasil", en: "São Paulo, Brazil" },
    period: { start: "2026-05", end: "2026-08" },
    summary: {
      pt: "Atuação sênior com React, React Native e Python no aplicativo de RH da Rede Américas, rede hospitalar cujo app é usado pelos colaboradores para ponto eletrônico, documentos, dados pessoais e atendimento.",
      en: "Senior React, React Native and Python developer on the HR app of Rede Américas, a hospital network whose employees use the app for time tracking, documents, personal data and support.",
    },
    highlights: [
      {
        pt: "Responsável de ponta a ponta pelo AméricasIA, assistente virtual de RH do aplicativo.",
        en: "End-to-end owner of AméricasIA, the app's virtual HR assistant.",
      },
      {
        pt: "No mobile, desenvolvi o módulo de chat em Expo/React Native com TypeScript e React Query, com entrada por voz e transcrição em tempo real, histórico persistido localmente (MMKV) e sugestões personalizadas.",
        en: "On mobile, built the chat module with Expo/React Native, TypeScript and React Query, featuring voice input with real-time transcription, locally persisted history (MMKV) and personalized suggestions.",
      },
      {
        pt: "No backend, escrevi a maior parte da API em Python/FastAPI integrada ao Gemini 2.5 Flash, com agente que consulta sistemas internos, ingestão de base de conhecimento a partir de PDFs e otimizações de custo como cache de contexto.",
        en: "On the backend, was the main author of the Python/FastAPI API integrated with Gemini 2.5 Flash, with an agent that queries internal systems, knowledge-base ingestion from PDFs and cost optimizations such as context caching.",
      },
      {
        pt: "Escrevi cerca de 165 testes automatizados (Jest, React Native Testing Library e pytest), com Docker, LocalStack, AWS e deploy via GitHub Actions.",
        en: "Wrote about 165 automated tests (Jest, React Native Testing Library and pytest), working with Docker, LocalStack, AWS and deployments through GitHub Actions.",
      },
    ],
    stack: [
      "React Native",
      "Expo",
      "TypeScript",
      "React Query",
      "Zustand",
      "MMKV",
      "Python",
      "FastAPI",
      "Gemini",
      "AWS",
      "Docker",
      "Jest",
      "pytest",
    ],
  },
  {
    id: "cf236",
    company: "CF236",
    role: {
      pt: "Desenvolvimento Full Stack (Sênior) | Tech Lead",
      en: "Senior Full Stack Developer | Tech Lead",
    },
    location: { pt: "Palmas, Tocantins, Brasil", en: "Palmas, Tocantins, Brazil" },
    period: { start: "2025-12", end: "2026-06" },
    summary: {
      pt: "Referência técnica na modernização do nTask, ecossistema de gestão para cartórios com mais de 12 módulos integrados em produção, como Protesto, RTD, RCPJ e Financeiro.",
      en: "Technical lead on the modernization of nTask, a management ecosystem for notary offices with more than 12 integrated production modules, such as Protest, RTD, RCPJ and Finance.",
    },
    highlights: [
      {
        pt: "Conduzi a migração gradual de sistemas legados em PHP para Laravel moderno, Vue.js 3 e TypeScript, preparando os serviços para execução serverless no Google Cloud (Cloud Run e Cloud SQL).",
        en: "Led the gradual migration of legacy PHP systems to modern Laravel, Vue.js 3 and TypeScript, preparing services for serverless execution on Google Cloud (Cloud Run and Cloud SQL).",
      },
      {
        pt: "Trabalhei no Identity Provider do ecossistema (OAuth2, OIDC e SSO) e em integrações de NF-e, com APIs REST, PostgreSQL, containers e pipelines no GitHub e no Cloud Build.",
        en: "Worked on the ecosystem's Identity Provider (OAuth2, OIDC and SSO) and on electronic invoice (NF-e) integrations, with REST APIs, PostgreSQL, containers and pipelines on GitHub and Cloud Build.",
      },
      {
        pt: "Conduzi decisões de arquitetura e revisões de mudanças críticas com as equipes de DevOps e SRE, formalizando padrões técnicos por meio de ADRs.",
        en: "Drove architecture decisions and reviews of critical changes with the DevOps and SRE teams, formalizing technical standards through ADRs.",
      },
    ],
    stack: [
      "PHP",
      "Laravel",
      "Vue.js 3",
      "TypeScript",
      "PostgreSQL",
      "Docker",
      "Google Cloud",
      "OAuth2",
      "OIDC",
    ],
  },
  {
    id: "bne",
    company: "BNE - Banco Nacional de Empregos",
    role: { pt: "Desenvolvimento de Software", en: "Software Developer" },
    location: { pt: "Colombo, Paraná, Brasil", en: "Colombo, Paraná, Brazil" },
    period: { start: "2022-09", end: "2025-09" },
    summary: {
      pt: "Desenvolvimento e manutenção do front-end dos portais de emprego do grupo BNE (Banco Nacional de Empregos, Trabalha Brasil e RedTrabaje), usados por candidatos e empresas em todo o Brasil e na América Latina.",
      en: "Front-end development and maintenance of the BNE group's job portals (Banco Nacional de Empregos, Trabalha Brasil and RedTrabaje), used by candidates and companies across Brazil and Latin America.",
    },
    highlights: [
      {
        pt: "Atuei principalmente com Angular e TypeScript, criando fluxos e evoluindo componentes reutilizáveis, além de páginas renderizadas no servidor em ASP.NET Core MVC (Razor).",
        en: "Worked mainly with Angular and TypeScript, building flows and evolving reusable components, as well as server-rendered pages in ASP.NET Core MVC (Razor).",
      },
      {
        pt: "Trabalhei em performance e SEO com foco em Core Web Vitals, reduzindo o TTFB em 35% e contribuindo para a estabilidade em produção (SLA de 99,9%).",
        en: "Worked on performance and SEO focused on Core Web Vitals, cutting TTFB by 35% and contributing to production stability (99.9% SLA).",
      },
      {
        pt: "Implementei testes automatizados com Jest e Cypress e validações de API com Postman para prevenir regressões.",
        en: "Implemented automated tests with Jest and Cypress and API checks with Postman to prevent regressions.",
      },
    ],
    stack: [
      "Angular",
      "TypeScript",
      "JavaScript",
      "SCSS",
      "ASP.NET Core MVC",
      "Jest",
      "Cypress",
      "Postman",
      "Mixpanel",
    ],
  },
  {
    id: "softgreen",
    company: "SoftGreen",
    role: { pt: "Desenvolvimento de Software", en: "Software Developer" },
    location: { pt: "São Paulo, Brasil", en: "São Paulo, Brazil" },
    period: { start: "2022-02", end: "2022-09" },
    summary: {
      pt: "Manutenção e evolução do aplicativo mobile em Flutter integrado ao ERP da SoftGreen, voltado a pequenas e médias indústrias dos setores de fundição, plástico e alimentação.",
      en: "Maintenance and evolution of the Flutter mobile app integrated with SoftGreen's ERP, built for small and mid-sized manufacturers in the foundry, plastics and food industries.",
    },
    highlights: [
      {
        pt: "O app leva ao chão de fábrica e ao almoxarifado rotinas como consulta e movimentação de estoque, apontamentos de produção e acompanhamento de ordens.",
        en: "The app brings routines such as stock lookup and movements, production reporting and order tracking to the shop floor and the warehouse.",
      },
      {
        pt: "Desenvolvi novas telas e funcionalidades e integrei o aplicativo às APIs do sistema para sincronizar os dados com o ERP.",
        en: "Built new screens and features and integrated the app with the system's APIs to keep data in sync with the ERP.",
      },
    ],
    stack: ["Flutter", "Dart", "REST APIs"],
  },
  {
    id: "omint",
    company: "OMINT",
    role: { pt: "Desenvolvimento de Software", en: "Software Developer" },
    location: { pt: "Rio de Janeiro, Brasil", en: "Rio de Janeiro, Brazil" },
    period: { start: "2021-06", end: "2021-09" },
    summary: {
      pt: "Manutenção e evolução de sistemas web internos da Omint, empresa de planos de saúde e seguros.",
      en: "Maintenance and evolution of internal web systems at Omint, a health plan and insurance company.",
    },
    highlights: [
      {
        pt: "Correções de bugs, evolução de telas e atendimento a demandas das áreas de negócio com JavaScript, jQuery, HTML5 e CSS3.",
        en: "Bug fixes, screen improvements and business requests handled with JavaScript, jQuery, HTML5 and CSS3.",
      },
      {
        pt: "Automatizei rotinas repetitivas de processamento de dados, reduzindo em 25% o esforço operacional.",
        en: "Automated repetitive data processing routines, reducing operational effort by 25%.",
      },
    ],
    stack: ["JavaScript", "jQuery", "HTML5", "CSS3"],
  },
];
