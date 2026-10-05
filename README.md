# Portfólio · Guilherme Rosário Alves

Portfólio pessoal em português e inglês, com experiência profissional, projetos, skills, formação e formulário de contato.

**Produção:** [athena272portfolio.vercel.app](https://athena272portfolio.vercel.app)

## Stack

- [Next.js 16](https://nextjs.org) (App Router) com React 19 e TypeScript
- [Tailwind CSS v4](https://tailwindcss.com) e componentes no estilo [shadcn/ui](https://ui.shadcn.com)
- [next-intl](https://next-intl.dev) para os idiomas (`/` em português, `/en` em inglês)
- [next-themes](https://github.com/pacocoursey/next-themes) para tema claro e escuro, seguindo o sistema por padrão
- [Motion](https://motion.dev) para animações, respeitando a preferência de movimento reduzido
- [Zod](https://zod.dev) na validação do formulário, no navegador e no servidor
- [Resend](https://resend.com) para entregar as mensagens do formulário, com template HTML próprio
- [Vercel Analytics](https://vercel.com/analytics)
- [Vitest](https://vitest.dev), [Testing Library](https://testing-library.com) e [MSW](https://mswjs.io) nos testes

## Como rodar

Requisitos: Node.js 20.9 ou superior e [pnpm](https://pnpm.io).

```bash
pnpm install
pnpm dev
```

Acesse [http://localhost:3000](http://localhost:3000).

## Scripts

| Comando             | O que faz                              |
| ------------------- | -------------------------------------- |
| `pnpm dev`          | Servidor de desenvolvimento            |
| `pnpm build`        | Build de produção                      |
| `pnpm start`        | Sobe o build de produção               |
| `pnpm lint`         | ESLint                                 |
| `pnpm typecheck`    | Gera os tipos das rotas e roda o `tsc` |
| `pnpm test`         | Testes unitários e de integração       |
| `pnpm test:watch`   | Testes em modo watch                   |
| `pnpm format`       | Formata o código com Prettier          |
| `pnpm format:check` | Verifica a formatação (usado na CI)    |

## Estrutura

```text
messages/              Textos da interface em pt e en
public/images/         Avatar e imagens dos projetos
src/
  app/                 Rotas, layouts, metadados, sitemap, robots e imagem de compartilhamento
    api/contact/       Rota que recebe o formulário e envia o e-mail pelo Resend
  components/
    layout/            Header, footer, troca de tema e de idioma
    sections/          Seções da página (Hero, Sobre, Experiência, Projetos...)
    shared/            Peças reutilizáveis entre seções
    ui/                Componentes base (Button, Card, Input...)
  content/             Conteúdo do currículo (experiências, projetos, skills, formação)
  features/contact/    Formulário de contato: validação, envio, estado e UI
    server/            Lado do servidor: tratamento da requisição, envio pelo Resend e template do e-mail
  hooks/               Hooks de cliente
  i18n/                Configuração do next-intl
  lib/                 Utilitários (datas, idioma, configuração do site, JSON-LD)
  test/                Setup dos testes, servidor MSW e helpers
```

## Como atualizar o conteúdo

- **Experiências, projetos, skills e formação:** edite os arquivos em `src/content/`. Cada texto tem as versões `pt` e `en`, e os testes falham se alguma tradução ficar vazia, se houver ids repetidos, links inválidos ou experiências fora de ordem.
- **Textos da interface:** edite `messages/pt.json` e `messages/en.json`. Os testes garantem que os dois arquivos tenham as mesmas chaves.
- **Imagem de um projeto:** coloque o arquivo em `public/images/projects/` e preencha o campo `image` do projeto. Sem imagem, o card usa uma capa em gradiente.
- **E-mail, link do CV e endpoint do formulário:** ficam em `src/lib/site-config.ts`. As mensagens do formulário chegam nesse e-mail.
- **E-mail das mensagens:** o template fica em `src/features/contact/server/contact-message-email.ts`. Responder ao e-mail recebido responde direto para o visitante.

As durações das experiências ("1 ano e 3 meses") são calculadas no servidor, e a página é regenerada uma vez por dia para mantê-las atualizadas.

## Variáveis de ambiente

| Variável               | Obrigatória            | Descrição                                                                                                                                 |
| ---------------------- | ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `RESEND_API_KEY`       | Sim, para o formulário | Chave do Resend com permissão "Sending access". Cadastre como **Secret** na Vercel. Sem ela, o formulário mostra um erro em vez de enviar |
| `MAIL_FROM`            | Não                    | Remetente das mensagens. Padrão: `Portfólio Guilherme <onboarding@resend.dev>`, que só entrega para o e-mail dono da conta do Resend      |
| `NEXT_PUBLIC_SITE_URL` | Não                    | URL pública usada em metadados, sitemap, JSON-LD e no rodapé do e-mail. Padrão: a URL de produção acima                                   |

Para testar o formulário localmente, copie `.env.example` para `.env.local` e preencha a chave.

## Deploy na Vercel

O projeto antigo era Vite, então a Vercel pode estar configurada com o preset errado. Antes do primeiro deploy desta versão:

1. Em **Project Settings → Build and Deployment**, troque o **Framework Preset** para **Next.js**.
2. Remova overrides de **Build Command**, **Output Directory** e **Install Command**, se houver. A Vercel detecta o pnpm pelo `pnpm-lock.yaml`.
3. Confirme que a versão do Node.js em **Project Settings → General** é 20 ou superior.
