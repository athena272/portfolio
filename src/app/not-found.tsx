import Link from "next/link";

/**
 * Fallback for requests that never reach a locale segment (the proxy normally prevents this).
 * Localized 404s are rendered by `[locale]/not-found.tsx`.
 */
export default function GlobalNotFound() {
  return (
    <html lang="pt-BR">
      <body
        style={{
          display: "grid",
          minHeight: "100dvh",
          placeItems: "center",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <main style={{ textAlign: "center" }}>
          <h1>404</h1>
          <p>Página não encontrada · Page not found</p>
          <Link href="/">Voltar para o início · Back to home</Link>
        </main>
      </body>
    </html>
  );
}
