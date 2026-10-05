import type { SocialLink } from "@/types/content";

/** (79) 99900-7075, with Brazil's country code, which `wa.me` requires. */
const WHATSAPP_NUMBER = "+55 (79) 99900-7075";

/** WhatsApp chat link. `wa.me` only accepts digits (country code + area code + number). */
export function whatsappUrl(phone: string): string {
  return `https://wa.me/${phone.replace(/\D/g, "")}`;
}

export const socialLinks: SocialLink[] = [
  { id: "whatsapp", label: "WhatsApp", href: whatsappUrl(WHATSAPP_NUMBER) },
  { id: "linkedin", label: "LinkedIn", href: "https://www.linkedin.com/in/guigorosario/" },
  { id: "github", label: "GitHub", href: "https://github.com/athena272" },
];

/** Public profiles, as opposed to direct contact channels such as WhatsApp. */
export const profileLinks = socialLinks.filter((link) => link.id !== "whatsapp");
