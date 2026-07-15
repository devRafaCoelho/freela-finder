# Freela Finder — Deploy

Guia de publicação do app (React + Vite).

> **Recomendado:** [Vercel](#deploy-no-vercel-recomendado) — suporta proxy do Reddit e deploy mais simples.  
> **Alternativa:** [GitHub Pages](#deploy-no-github-pages) — estático puro; Reddit não funciona.

---

## Deploy no Vercel (recomendado)

### Por que Vercel é melhor para este projeto

| Recurso | GitHub Pages | Vercel |
|---------|--------------|--------|
| Site estático | Sim | Sim |
| API proxy (`/api/reddit`) | Não | **Sim** |
| Reddit em produção | Falha (CORS) | **Funciona** |
| Deploy automático | Sim | Sim |
| URL | `usuario.github.io/repo/` | `projeto.vercel.app` |

### Passos

1. Acesse [vercel.com](https://vercel.com) e conecte o repo `devRafaCoelho/freela-finder`
2. Framework: **Vite** (detectado automaticamente)
3. Build: `npm run build` · Output: `dist`
4. Deploy

O arquivo `vercel.json` e `api/reddit.js` já estão no projeto — o proxy do Reddit funciona sem config extra.

### URL após deploy

`https://freela-finder-*.vercel.app` (ou domínio customizado)

---

## Deploy no GitHub Pages

Guia para publicar a v1 (React + Vite, 100% estático) no **GitHub Pages** com deploy automático via GitHub Actions.

**Limitação:** sem serverless, o Reddit falha em produção. Job boards continuam funcionando.

---

## 1. Pré-requisitos

| Item | Detalhe |
|------|---------|
| Repositório | Público (Pages grátis) ou privado com Pages habilitado |
| Branch | `main` (ou ajustar no workflow) |
| App | Projeto Vite na **raiz do repo** ou em subpasta (ver seção 6) |
| URL esperada | `https://<usuario>.github.io/<repo>/` |

> **Exemplo:** repo `rafac/freela-finder` → `https://rafac.github.io/freela-finder/`

---

## 2. Configuração do Vite (`base`)

GitHub Pages em **project site** serve o app em subpath `/nome-do-repo/`. O Vite precisa do `base` correto para assets e rotas.

```javascript
// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Nome do repositório no GitHub (ajuste se for diferente)
const REPO_NAME = 'freela-finder';

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  // Em produção no Pages: /freela-finder/
  // Em dev local: /
  base: mode === 'production' ? `/${REPO_NAME}/` : '/',
  server: {
    port: 5174,
  },
}));
```

**Testar build local com base do Pages:**

```bash
npm run build
npm run preview -- --base /freela-finder/
```

Abra `http://localhost:4173/freela-finder/` e confira se CSS/JS carregam.

---

## 3. React Router (`basename`)

O `BrowserRouter` deve usar o mesmo base path do Vite:

```javascript
// src/main.jsx
import { BrowserRouter } from 'react-router-dom';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <App />
    </BrowserRouter>
  </StrictMode>
);
```

`import.meta.env.BASE_URL` vem do `base` do Vite (`/` em dev, `/freela-finder/` em build de produção).

### Fallback SPA (`404.html`)

No GitHub Pages, ao atualizar a página em `/freela-finder/busca`, o servidor procura um arquivo físico e pode retornar 404. Solução: copiar `index.html` para `404.html` após o build.

```json
// package.json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "postbuild": "node scripts/copy-404.js",
    "preview": "vite preview"
  }
}
```

```javascript
// scripts/copy-404.js
import { copyFileSync } from 'node:fs';
import { resolve } from 'node:path';

const dist = resolve('dist');
copyFileSync(resolve(dist, 'index.html'), resolve(dist, '404.html'));
console.log('404.html criado para GitHub Pages (SPA fallback)');
```

**Alternativa mais simples (URLs com hash):** usar `HashRouter` em vez de `BrowserRouter` — URLs ficam `.../#/busca`, mas dispensam o `404.html`. Para v1 pessoal, é aceitável.

---

## 4. GitHub Actions (deploy automático)

### 4.1 Habilitar Pages no repositório

1. GitHub → **Settings** → **Pages**
2. **Build and deployment** → Source: **GitHub Actions**
3. Não usar “Deploy from branch” — o workflow abaixo publica o artefato do build

### 4.2 Workflow

Copie para `.github/workflows/deploy-pages.yml` na **raiz do repositório** do app:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build
        env:
          # Variáveis VITE_* usadas no build (se houver)
          VITE_REDDIT_CLIENT_ID: ${{ secrets.VITE_REDDIT_CLIENT_ID }}
          VITE_REDDIT_CLIENT_SECRET: ${{ secrets.VITE_REDDIT_CLIENT_SECRET }}

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

Um template idêntico está em `freela-finder/github-workflows/deploy-pages.yml` para copiar ao criar o repo.

### 4.3 Secrets (opcional)

Se usar Reddit autenticado ou Google CSE no build:

| Secret no GitHub | Variável |
|------------------|----------|
| `VITE_REDDIT_CLIENT_ID` | `VITE_REDDIT_CLIENT_ID` |
| `VITE_REDDIT_CLIENT_SECRET` | `VITE_REDDIT_CLIENT_SECRET` |
| `VITE_GOOGLE_CSE_API_KEY` | `VITE_GOOGLE_CSE_API_KEY` |
| `VITE_GOOGLE_CSE_CX` | `VITE_GOOGLE_CSE_CX` |

**Settings → Secrets and variables → Actions → New repository secret**

> Keys no front ficam visíveis no bundle JS. Para uso pessoal ok; para produto comercial, mover coleta para back-end.

---

## 5. Fluxo completo

```
Push na main
      │
      ▼
GitHub Actions: npm ci → npm run build → postbuild (404.html)
      │
      ▼
Upload dist/ como artifact
      │
      ▼
deploy-pages publica em gh-pages environment
      │
      ▼
https://<usuario>.github.io/freela-finder/
```

### Primeiro deploy

```bash
git init
git add .
git commit -m "feat: scaffold freela-finder"
git branch -M main
git remote add origin git@github.com:<usuario>/freela-finder.git
git push -u origin main
```

Acompanhe em **Actions** → workflow **Deploy to GitHub Pages**. Em 1–3 min a URL deve responder.

---

## 6. Monorepo ou app em subpasta

Se o código Vite não estiver na raiz do repo (ex.: este workspace `searchs/` com app em `freela-finder-web/`):

```yaml
# No job build, antes do npm ci:
- name: Build app
  working-directory: freela-finder-web
  run: |
    npm ci
    npm run build

- name: Upload artifact
  uses: actions/upload-pages-artifact@v3
  with:
    path: freela-finder-web/dist
```

O `base` no `vite.config.js` continua sendo `/<nome-do-repo-github>/`, não o nome da subpasta local.

---

## 7. CORS em produção

Coletores chamam APIs públicas **direto do browser** do visitante. No GitHub Pages isso é o mesmo que em `localhost` — não há proxy.

| Fonte | Funciona no Pages? |
|-------|-------------------|
| RemoteOK, Remotive, Arbeitnow | Sim (CORS aberto) |
| Reddit (JSON público) | Sim, com rate limit |
| APIs sem CORS | Falham — tratar erro na UI |

Deploy no Pages **não resolve** CORS. Fontes bloqueadas só funcionam com back-end proxy (fase futura).

---

## 8. Checklist antes do go-live

- [ ] `base` no Vite = `/<nome-do-repo>/`
- [ ] `BrowserRouter` com `basename={import.meta.env.BASE_URL}`
- [ ] `postbuild` gera `404.html` (se usar `BrowserRouter`)
- [ ] Workflow em `.github/workflows/deploy-pages.yml`
- [ ] Pages configurado como **GitHub Actions** (não branch)
- [ ] `npm run build && npm run preview` ok com subpath
- [ ] Busca testada na URL publicada (não só em dev)

---

## 9. Troubleshooting

| Problema | Causa provável | Solução |
|----------|----------------|---------|
| Página em branco | `base` errado | Conferir Network: assets 404 em `/assets/` em vez de `/freela-finder/assets/` |
| CSS/JS não carrega | Mesmo | Ajustar `REPO_NAME` no `vite.config.js` |
| `/busca` dá 404 ao F5 | Falta SPA fallback | Adicionar `postbuild` → `404.html` |
| Workflow falha | Node/npm | Ver log; usar `npm ci` e lockfile commitado |
| Busca não retorna nada | CORS ou rate limit | Ver console do browser; fonte pode bloquear |
| Secrets não aplicam | Nome errado | Secret deve começar com `VITE_` para o Vite embutir no build |

---

## 10. Deploy manual (sem Actions)

```bash
npm run build
# Publicar conteúdo de dist/ na branch gh-pages (ex.: com gh-pages CLI)
npx gh-pages -d dist
```

Requer `base` correto no build. Actions é preferível para deploy contínuo.
