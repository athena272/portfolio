import type { ComponentType, SVGProps } from "react";

import { socialLinks } from "@/content/socials";
import { cn } from "@/lib/cn";
import type { SocialLinkId } from "@/types/content";

import { GitHubIcon, LinkedInIcon, WhatsAppIcon } from "./brand-icons";
import { ExternalLink } from "./external-link";

const ICONS: Record<SocialLinkId, ComponentType<SVGProps<SVGSVGElement>>> = {
  whatsapp: WhatsAppIcon,
  linkedin: LinkedInIcon,
  github: GitHubIcon,
};

type SocialLinksProps = {
  className?: string;
};

export function SocialLinks({ className }: SocialLinksProps) {
  return (
    <ul className={cn("flex items-center gap-1", className)}>
      {socialLinks.map(({ id, label, href }) => {
        const Icon = ICONS[id];
        return (
          <li key={id}>
            <ExternalLink
              href={href}
              title={label}
              className="inline-flex size-10 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
            >
              <Icon className="size-5" />
              <span className="sr-only">{label}</span>
            </ExternalLink>
          </li>
        );
      })}
    </ul>
  );
}
