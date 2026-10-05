const DEFAULT_SITE_URL = "https://athena272portfolio.vercel.app";

export const siteConfig = {
  name: "Guilherme Rosário Alves",
  shortName: "Guilherme R. Alves",
  initials: "GA",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? DEFAULT_SITE_URL,
  email: "guilhermera272@gmail.com",
  cvUrl: "https://drive.google.com/drive/folders/1WSvNtPYxq70D574h_GOGdRUisdlSSMLF?usp=drive_link",
  githubRepositoriesUrl: "https://github.com/athena272?tab=repositories",
  /** Route handler that sends the contact message through Resend. */
  contactEndpoint: "/api/contact",
  contactTimeoutMs: 10_000,
} as const;
