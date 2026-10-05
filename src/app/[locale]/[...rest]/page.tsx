import { notFound } from "next/navigation";

/** Sends unknown paths under a locale to the localized `not-found.tsx`. */
export default function CatchAllPage() {
  notFound();
}
