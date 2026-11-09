import type { Certification, Education } from "@/types/content";

/** Most recent first. */
export const education: Education[] = [
  {
    id: "ufs",
    institution: "Universidade Federal de Sergipe (UFS)",
    degree: {
      pt: "Bacharelado em Engenharia de Computação",
      en: "Bachelor's degree in Computer Engineering",
    },
    period: { start: "2021-07", end: "2026-11" },
    note: {
      pt: "Projetos acadêmicos: Lyra, registrado no INPI, e ClinicRoom, em uso no ambulatório do HU-UFS.",
      en: "Academic projects: Lyra, registered at INPI, and ClinicRoom, in use at the HU-UFS outpatient clinic.",
    },
  },
  {
    id: "unicesumar",
    institution: "UniCesumar",
    degree: {
      pt: "Tecnologia em Análise e Desenvolvimento de Sistemas",
      en: "Associate degree in Systems Analysis and Development",
    },
    period: { start: "2024-07", end: "2025-09" },
  },
  {
    id: "ifs",
    institution: "Instituto Federal de Sergipe (IFS)",
    degree: {
      pt: "Curso Técnico em Redes de Computadores",
      en: "Technical degree in Computer Networks",
    },
    period: { start: "2018-01", end: "2021-03" },
  },
];

/** Most recent first. */
export const certifications: Certification[] = [
  {
    id: "gcp-computing-foundations",
    name: "Google Cloud Computing Foundations Certificate",
    issuer: "Google Cloud",
    issued: "2025-04",
    url: "https://www.credly.com/badges/0374d6e1-e202-4dd6-9590-901f42da6c6a/linked_in_profile",
  },
  {
    id: "gcp-secure-network",
    name: "Build a Secure Google Cloud Network Skill Badge",
    issuer: "Google Cloud",
    issued: "2025-03",
    url: "https://www.cloudskillsboost.google/public_profiles/74116dd0-1899-4589-bcd9-e43701ce8026/badges/15083011",
  },
  {
    id: "gcp-load-balancing",
    name: "Implement Load Balancing on Compute Engine Skill Badge",
    issuer: "Google Cloud",
    issued: "2025-03",
    url: "https://www.cloudskillsboost.google/public_profiles/74116dd0-1899-4589-bcd9-e43701ce8026/badges/14774027",
  },
  {
    id: "gcp-ml-apis",
    name: "Prepare Data for ML APIs on Google Cloud Skill Badge",
    issuer: "Google Cloud",
    issued: "2025-03",
    url: "https://www.cloudskillsboost.google/public_profiles/74116dd0-1899-4589-bcd9-e43701ce8026/badges/15296384",
  },
  {
    id: "gcp-app-dev-environment",
    name: "Set Up an App Dev Environment on Google Cloud Skill Badge",
    issuer: "Google Cloud",
    issued: "2025-03",
    url: "https://www.cloudskillsboost.google/public_profiles/74116dd0-1899-4589-bcd9-e43701ce8026/badges/14908459",
  },
  {
    id: "ef-set-c1",
    name: "EF SET English Certificate (C1 Advanced)",
    issuer: "EF SET",
    issued: "2021-07",
    url: "https://www.efset.org/cert/r1V7nq",
  },
];
