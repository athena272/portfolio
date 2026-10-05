import { Mail } from "lucide-react";
import { useTranslations } from "next-intl";

import { Reveal } from "@/components/shared/reveal";
import { Section } from "@/components/shared/section";
import { SocialLinks } from "@/components/shared/social-links";
import { ContactForm } from "@/features/contact/contact-form";
import { siteConfig } from "@/lib/site-config";

export function Contact() {
  const t = useTranslations("contact");

  return (
    <Section id="contact" eyebrow={t("eyebrow")} title={t("title")} description={t("description")}>
      <div className="grid gap-10 lg:grid-cols-[2fr_3fr]">
        <Reveal className="flex flex-col gap-6">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{t("emailLabel")}</p>
            <a
              href={`mailto:${siteConfig.email}`}
              className="mt-1 inline-flex items-center gap-2 rounded-md text-lg font-medium break-all underline-offset-4 hover:text-primary hover:underline focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
            >
              <Mail className="size-5 shrink-0 text-primary" aria-hidden="true" />
              {siteConfig.email}
            </a>
          </div>
          <SocialLinks className="-ml-2" />
        </Reveal>

        <Reveal delay={0.08} className="rounded-xl border bg-card p-6 shadow-xs sm:p-8">
          <ContactForm />
        </Reveal>
      </div>
    </Section>
  );
}
