# template-react-vite

Template base para projetos front-end React + Vite.

## Stack incluída

- [Vite](https://vite.dev/) + React 19 + TypeScript
- [React Router](https://reactrouter.com/) (`react-router-dom`) já configurado com layout e rota 404
- [Tailwind CSS v4](https://tailwindcss.com/) via `@tailwindcss/postcss` (sem `tailwind.config.js`; tema definido em `src/index.css` com `@theme`)
- [lucide-react](https://lucide.dev/) para ícones
- Tema claro/escuro já pronto (ver [Tema claro/escuro](#tema-claroescuro))
- ESLint (flat config) com `typescript-eslint`, `eslint-plugin-react-hooks` e `eslint-plugin-react-refresh`
- `src/services/api.ts`: client HTTP mínimo (fetch) com suporte a token Bearer, apontando para a `agenda-clientes-api` (`VITE_API_URL`)

## Como criar um projeto novo

**Via CLI (recomendado):**

```
npm create gentilpedro-react@latest minha-app
cd minha-app
npm install
npm run dev
```

**Via GitHub template repo:**

1. Use este repositório como template no GitHub ("Use this template") ou clone.
2. Renomeie o campo `name` em `package.json`.
3. Copie `.env.example` para `.env` e ajuste `VITE_API_URL` (ver [Backend](#backend-agenda-clientes-api)).
4. `npm install`
5. `npm run dev` (abre em `http://localhost:3000`)

O pacote `create-gentilpedro-react` (pasta `create-app/`) é publicado a partir deste mesmo repositório — sempre que a `main` muda, o CI sincroniza o template e publica uma versão nova no npm.

## Backend (agenda-clientes-api)

O app consome a **agenda-clientes-api** (Java 21 + Spring Boot), no repositório
`agenda-clientes-api`. Para rodar os dois juntos em desenvolvimento:

```
# no repositório da API
docker compose up -d      # Postgres; o Flyway aplica as migrations no start
./mvnw spring-boot:run    # sobe em http://localhost:8080

# aqui
cp .env.example .env      # VITE_API_URL=http://localhost:8080/api
npm install
npm run dev               # abre em http://localhost:3000
```

Detalhes da integração:

- **Endereço da API**: `VITE_API_URL` (padrão `http://localhost:8080/api`). O
  valor precisa incluir o prefixo `/api` — os services montam os caminhos a
  partir dele (`/auth/login`, `/clientes`, `/agendamentos`).
- **CORS**: a API libera `http://localhost:3000`, que é a porta fixada em
  `vite.config.ts`. Se mudar a porta do Vite, ajuste `app.cors.allowed-origins`
  na API (ou a env `APP_CORS_ALLOWED_ORIGINS`).
- **Autenticação**: JWT no header `Authorization: Bearer <token>`, guardado em
  `localStorage`. O token vem de `POST /api/auth/login` ou `/api/auth/registrar`.
- **Sessão expirada**: a API usa Spring Security, que responde **403** (e não
  401) quando o token está ausente, expirado ou inválido. O client trata 401 e
  403 dos endpoints protegidos como sessão encerrada, limpa o `localStorage` e
  deixa o `ProtectedRoute` levar de volta ao login. Nos endpoints `/auth/*` o
  401 é credencial inválida e fica com o formulário.
- **Erros**: a API devolve o formato `ApiError` (`message` + `fieldErrors`), que
  vira `ApiRequestError` no client — os formulários usam `fieldErrors` para
  marcar campo a campo.
- **Documentação**: Swagger UI em `http://localhost:8080/swagger-ui.html`.

## Scripts

- `npm run dev` — servidor de desenvolvimento
- `npm run build` — build de produção (`tsc -b && vite build`)
- `npm run lint` — ESLint
- `npm run preview` — preview do build

## Estrutura

```
src/
  components/   # componentes reutilizáveis (ex: Layout, ThemeToggle)
  contexts/     # contextos React (ex: tema)
  pages/        # páginas/rotas
  services/     # clients de API e afins
  App.tsx       # definição de rotas
  main.tsx      # bootstrap
  index.css     # import do Tailwind + tema (@theme)
```

## Tema claro/escuro

O template já vem com troca de tema pronta:

- O botão fica no header (`src/components/ThemeToggle.tsx`) e alterna entre claro e escuro.
- Sem escolha salva, o app segue o tema do sistema (`prefers-color-scheme`); ao clicar no botão a preferência é fixada em `localStorage` (chave `theme`).
- O estado vive no `ThemeProvider` (`src/contexts/ThemeProvider.tsx`); use o hook `useTheme()` para ler `theme` / `resolvedTheme` ou chamar `setTheme('light' | 'dark' | 'system')`.
- O tema é aplicado como classe `dark` no `<html>`. Um script inline em `index.html` faz isso **antes do primeiro paint**, evitando o flash de tela branca — se mudar a chave do `localStorage`, mude nos dois lugares.
- Nos estilos, use os tokens semânticos definidos em `src/index.css` (`bg-surface`, `bg-surface-raised`, `text-content`, `text-content-muted`, `text-heading`, `border-line`), que já trocam de valor sozinhos. A variante `dark:` continua disponível para ajustes pontuais.

## Libs extras (adicionar conforme o projeto pedir)

Este template fica propositalmente enxuto. Dependendo do projeto, considere adicionar:

- **Formulários**: `react-hook-form` + `@hookform/resolvers` + `zod`
- **Estado global**: `zustand`
- **Componentes de UI prontos**: `flowbite-react`
- **Notificações/toasts**: `sonner`
- **JWT no client**: `jwt-decode`
- **Gráficos**: `victory`
