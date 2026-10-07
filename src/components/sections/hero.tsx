import { ArrowDown, FileText, MapPin, Send } from "lucide-react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";

import { ExternalLink } from "@/components/shared/external-link";
import { SocialLinks } from "@/components/shared/social-links";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { profile } from "@/content/profile";
import { localize } from "@/lib/localize";
import { HOME_SECTION_ID } from "@/lib/sections";
import { siteConfig } from "@/lib/site-config";

export function Hero() {
  const t = useTranslations("hero");
  const locale = useLocale();

  return (
    <section
      id={HOME_SECTION_ID}
      aria-labelledby="home-heading"
      className="relative isolate overflow-hidden"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-grid [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_75%)]"
      />
      <div
        aria-hidden="true"
        className="absolute -top-40 left-1/2 -z-10 size-[36rem] -translate-x-1/2 rounded-full bg-primary/15 blur-3xl"
      />

      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 pt-16 pb-20 sm:px-6 sm:pt-24 sm:pb-28 md:grid-cols-[1fr_auto]">
        {/* No entrance animation here: this is the LCP content and must be visible before hydration. */}
        <div className="flex flex-col items-start">
          <Badge variant="outline" className="gap-2 rounded-full px-3 py-1">
            <span className="relative flex size-2" aria-hidden="true">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-75 motion-reduce:animate-none" />
              <span className="relative inline-flex size-2 rounded-full bg-success" />
            </span>
            {t("availability")}
          </Badge>

          <p className="mt-6 text-lg text-muted-foreground">{t("greeting")}</p>
          <h1
            id="home-heading"
            className="mt-1 text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl"
          >
            {profile.name}
          </h1>
          <p className="mt-3 bg-linear-to-r from-primary to-fuchsia-500 bg-clip-text text-2xl font-semibold text-transparent sm:text-3xl">
            {localize(profile.role, locale)}
          </p>
          <p className="mt-6 max-w-xl text-lg text-pretty text-muted-foreground">
            {localize(profile.headline, locale)}
          </p>

          <p className="mt-4 flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="size-4" aria-hidden="true" />
            {localize(profile.location, locale)}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <a href="#projects">
                {t("viewProjects")}
                <ArrowDown aria-hidden="true" />
              </a>
            </Button>
            <Button asChild size="lg" variant="outline">
              <ExternalLink href={siteConfig.cvUrl}>
                <FileText aria-hidden="true" />
                {t("downloadCv")}
              </ExternalLink>
            </Button>
            <Button asChild size="lg" variant="ghost">
              <a href="#contact">
                <Send aria-hidden="true" />
                {t("contact")}
              </a>
            </Button>
          </div>

          <SocialLinks className="mt-6 -ml-2" />
        </div>

        <div className="order-first justify-self-center md:order-none">
          <div className="relative">
            <div
              aria-hidden="true"
              className="absolute -inset-3 rounded-full bg-linear-to-tr from-primary/40 via-fuchsia-500/30 to-transparent blur-xl"
            />
            <Image
              src={profile.photo.src}
              alt={localize(profile.photo.alt, locale)}
              width={profile.photo.width}
              height={profile.photo.height}
              preload
              sizes="(min-width: 768px) 320px, 192px"
              className="relative size-48 rounded-full border-4 border-background object-cover shadow-xl ring-1 ring-border sm:size-64 md:size-80"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
