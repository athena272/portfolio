import type { Profile } from "@/types/content";

export const profile: Profile = {
  name: "Guilherme Rosário Alves",
  role: {
    pt: "Desenvolvimento Full Stack",
    en: "Full Stack Developer",
  },
  headline: {
    pt: "Construo produtos web e mobile em produção, do banco de dados à interface: React, React Native e TypeScript no frontend; Node.js, Java, Python e PHP no backend. Meu foco é arquitetura, testes e performance.",
    en: "I build production web and mobile products, from the database to the interface: React, React Native and TypeScript on the frontend; Node.js, Java, Python and PHP on the backend. My focus is architecture, testing and performance.",
  },
  location: {
    pt: "Aracaju, Sergipe, Brasil",
    en: "Aracaju, Sergipe, Brazil",
  },
  summary: [
    {
      pt: "Trabalho com desenvolvimento de software full stack há cerca de 5 anos, construindo e evoluindo produtos web e mobile em produção. Meu foco é TypeScript, React, React Native e Node.js (NestJS), e também trabalho com Java, PHP (Laravel) e Python no backend.",
      en: "I'm a full stack software developer with about 5 years of experience building and evolving production web and mobile products. My focus is TypeScript, React, React Native and Node.js (NestJS), and I also work with Java, PHP (Laravel) and Python on the backend.",
    },
    {
      pt: "Atuei como Tech Lead na modernização de um ecossistema de gestão para cartórios no Google Cloud, desenvolvi um assistente de RH com IA generativa (Gemini) para uma rede hospitalar e conduzi reescritas e migrações de sistemas legados com foco em arquitetura, testes automatizados e CI/CD.",
      en: "I worked as Tech Lead on the modernization of a management ecosystem for notary offices on Google Cloud, built a generative AI HR assistant (Gemini) for a hospital network, and led rewrites and migrations of legacy systems with a focus on architecture, automated testing and CI/CD.",
    },
    {
      pt: "Tenho histórico de melhorias mensuráveis de performance e experiência em domínios regulados, como saúde, RH, folha de pagamento e setor público, sempre colaborando de perto com design, produto e áreas de negócio.",
      en: "I have a track record of measurable performance improvements and experience in regulated domains such as healthcare, HR, payroll and the public sector, always working closely with design, product and business teams.",
    },
  ],
  highlights: [
    {
      id: "experience",
      value: "~5",
      label: { pt: "anos de experiência profissional", en: "years of professional experience" },
    },
    {
      id: "tech-lead",
      value: "Tech Lead",
      label: {
        pt: "na modernização de um ecossistema com 12+ módulos",
        en: "on modernizing an ecosystem with 12+ modules",
      },
    },
    {
      id: "generative-ai",
      value: "GenAI",
      label: {
        pt: "assistente de RH com Gemini em produção",
        en: "HR assistant powered by Gemini in production",
      },
    },
    {
      id: "ttfb",
      value: "-35%",
      label: {
        pt: "de TTFB em portais de emprego de grande escala",
        en: "TTFB on large-scale job portals",
      },
    },
  ],
  photo: {
    src: "/images/profile-photo.jpg",
    type: "image/jpeg",
    width: 640,
    height: 640,
    alt: {
      pt: "Foto de Guilherme, de óculos de armação preta e camiseta preta",
      en: "Photo of Guilherme wearing black-framed glasses and a black T-shirt",
    },
  },
};
