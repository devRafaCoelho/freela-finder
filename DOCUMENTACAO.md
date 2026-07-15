# Freela Finder — Documentação do Produto

> **Stack v1:** React + JavaScript, 100% front-end (sem back-end, sem banco, sem autenticação).
>
> **Uso inicial:** ferramenta pessoal para rodar buscas por oportunidades de freela e abordar contatos na hora — sem pipeline, sem histórico persistido.

## 1. Visão geral

### O que é

O **Freela Finder** é uma ferramenta pessoal de **descoberta de oportunidades de freela** fora das plataformas saturadas (Workana, 99Freelas, Upwork, etc.).

Em vez de disputar fila em marketplace, o sistema busca **sinais de intenção de contratação** na web aberta — posts, vagas, pedidos informais e anúncios onde alguém está procurando um desenvolvedor **agora**.

Exemplos de intenção que o sistema deve encontrar:

- `"preciso de um dev para meu projeto"`
- `"busco desenvolvedor node"`
- `"contratar programador para sistema"`
- `"alguém indica dev para criar plataforma"`

### Princípio central: radar, não CRM

| Objetivo | Como o sistema garante |
|----------|------------------------|
| Achar demanda cedo | Prioriza fontes **fora** de marketplaces saturados |
| Economizar tempo | Filtro **estrito** por tecnologia (incluir / excluir) |
| Contato imediato | Lista ao vivo; você abre o link e aborda na hora |
| Zero atrito | Sem login, sem cadastro, sem configurar pipeline |
| Uso pontual | Você roda uma busca e passa algumas horas prospectando |

**Anti-padrão da v1:** transformar em CRM de oportunidades (status, carteira, histórico, atribuição). Isso fica para uma fase futura se o produto virar SaaS.

### O que o sistema NÃO é

| Não é | Por quê |
|-------|---------|
| Clone da Workana | Não publica nem disputa projetos dentro de marketplace |
| CRM / pipeline comercial | v1 não persiste oportunidades nem status de abordagem |
| Produto multiusuário | Uso pessoal; sem auth na v1 |
| Agregador de todas as plataformas | Foco em intenção aberta, não em scrape de sites fechados |
| Garantia de conversão | Encontra sinais; você fecha o contato manualmente |

### Para que serve

| Problema | Como o Freela Finder resolve |
|----------|------------------------------|
| Plataformas saturadas e pagas | Amplia o radar para fontes com menos concorrência |
| Muito ruído (stack errada) | Filtro Node sim, Python não — regra explícita |
| Abrir 5+ sites manualmente | Uma busca, uma lista filtrada |
| Perder tempo em proposta inútil | Prioriza por match de tecnologia e frescor |
| Projetos já com 20 propostas | Busca demanda **antes** ou **fora** do marketplace |

### Quem usa o sistema

**Uso pessoal** — você, como desenvolvedor/freelancer com experiência de mercado.

Fluxo típico:

1. Configura filtros (stack, termos de intenção, região).
2. Clica em **Buscar**.
3. Revisa a lista por 1–3 horas.
4. Abre links, entra em contato (WhatsApp, e-mail, DM, formulário).
5. Fecha a aba — sem salvar nada no sistema.

### Escopo da v1 (front-only)

| Inclui | Não inclui |
|--------|------------|
| Tela de busca com filtros | Login / autenticação |
| Lista de resultados ao vivo | Banco de dados |
| Filtro incluir/excluir tecnologias | Pipeline de status |
| Múltiplas fontes públicas | Scraping de Workana / 99Freelas |
| Abrir link original em nova aba | Notificações automáticas |
| Copiar pitch rápido (opcional) | Coleta agendada em background |
| Dedupe na sessão atual | Histórico entre sessões |

---

## 2. Fluxo principal

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│ Você define  │     │  Coletores   │     │ Normalização │     │ Filtro de    │
│ filtros e    │ ──► │  (fontes     │ ──► │ + dedupe     │ ──► │ tecnologia   │
│ termos       │     │  públicas)   │     │ em memória   │     │ + ranking    │
└──────────────┘     └──────────────┘     └──────────────┘     └──────┬───────┘
                                                                        │
                                                                        ▼
                                                               ┌──────────────┐
                                                               │ Lista de     │
                                                               │ resultados   │
                                                               │ → abrir link │
                                                               │ → contatar   │
                                                               └──────────────┘
```

1. Você preenche **tecnologias incluir**, **tecnologias excluir**, **termos de intenção** e **região** (opcional).
2. O front dispara coletores em paralelo (APIs públicas, Reddit, etc.).
3. Cada resultado vira um objeto padronizado (`Opportunity`).
4. O motor de match aplica regras de stack e descarta ruído.
5. A lista aparece ordenada por relevância e frescor.
6. Você clica no link, aborda manualmente e segue o dia — **nada é salvo**.

### Prioridade de fontes

O sistema **prioriza buscas fora de plataformas de freela**. Marketplaces entram só como complemento, se viável.

| Prioridade | Tipo de fonte | Exemplo |
|------------|---------------|---------|
| **Alta** | Intenção aberta na web | Posts, fóruns, pedidos informais |
| **Alta** | Comunidades | Reddit (`r/forhire`, `r/brdev`), grupos abertos |
| **Média** | Job boards remotos | RemoteOK, Remotive, Arbeitnow |
| **Média** | Vagas PJ / remoto | Anúncios compatíveis com freela |
| **Baixa** | Plataformas de freela | Workana, 99Freelas — só se houver fonte estável |
| **Fora do escopo v1** | LinkedIn scrape, Google Ads | Instável, pago ou irrelevante |

---

## 3. Como o sistema qualifica resultados

### Fontes de dados (v1)

| Fonte | O que traz | CORS no browser | v1 |
|-------|------------|-----------------|-----|
| **RemoteOK** | Vagas remotas tech | Sim | Sim |
| **Remotive** | Vagas remotas | Sim | Sim |
| **Arbeitnow** | Vagas / freela remoto | Sim | Sim |
| **Reddit** | Posts pedindo dev | Sim (API oficial) | Sim |
| **Hacker News** | "Who is hiring" / pedidos | Parcial | Opcional |
| **Google Custom Search** | Intenção na web aberta | Via API key no `.env` | Opcional |
| **Workana / 99Freelas** | Projetos publicados | Não / ToS | Não na v1 |

> **Nota:** APIs com key (`Google CSE`, `SerpAPI`) ficam no `.env.local` do Vite. Para uso pessoal local isso é aceitável; em produto comercial a key iria para o back-end.

### O que acontece em uma busca

```
Busca iniciada
  │
  ▼
Coletores em paralelo (Promise.allSettled)
  │
  ▼
Normalização → modelo Opportunity unificado
  │
  ▼
Dedupe por URL (sessão atual)
  │
  ▼
Match de tecnologia
  │
  ├── Excluída (stack proibida no título/descrição/tags)
  ├── Incluída (match positivo)
  └── Neutra (sem stack clara — configurável: mostrar ou ocultar)
  │
  ▼
Ranking por score simples
  │
  ▼
Lista renderizada (só em memória / estado React)
```

**Exemplo de busca:**

| Filtro | Valor |
|--------|-------|
| Tecnologias incluir | `node`, `nestjs`, `react`, `typescript` |
| Tecnologias excluir | `python`, `django`, `php`, `wordpress` |
| Termos de intenção | `"preciso de dev"`, `"busco desenvolvedor"`, `"contratar programador"` |
| Região | Brasil / remoto |
| Mostrar sem stack explícita | não |

Resultado esperado: posts e vagas onde alguém pede dev Node/React — **sem** aparecer projeto Python ou WordPress.

### Filtros de busca

#### Obrigatórios / principais

| Filtro | Exemplo | Função |
|--------|---------|--------|
| **Tecnologias incluir** | `node`, `react` | Só passa quem menciona pelo menos uma |
| **Tecnologias excluir** | `python`, `wordpress` | Descarta se mencionar qualquer uma |
| **Termos de intenção** | `"preciso de um dev"` | Reforça sinal de demanda (fontes que suportam query) |
| **Modo estrito** | ligado | Exige match de inclusão; sem stack = descarta |

#### Opcionais

| Filtro | Exemplo | Função |
|--------|---------|--------|
| **Palavra-chave livre** | `mvp`, `sistema`, `integração` | Refinamento extra |
| **Região / remoto** | `br`, `remote` | Escopo geográfico |
| **Idioma** | `pt`, `en` | Filtrar por idioma do anúncio |
| **Fontes ativas** | Reddit + RemoteOK | Escolher de onde buscar |
| **Data máxima** | últimos 7 dias | Descartar anúncios antigos |
| **Mín. match score** | 50 | Corte de relevância |

### Motor de match de tecnologia

Cada resultado recebe um **match score** de 0 a 100, calculado no client.

| Regra | Peso | Comportamento |
|-------|------|---------------|
| Tag ou título contém tech **incluída** | +40 cada (máx. 80) | Match forte |
| Descrição contém tech **incluída** | +15 cada (máx. 30) | Match médio |
| Contém tech **excluída** | **descarta** | Sem exceção na v1 |
| Termo de intenção no título | +20 | Sinal de demanda direta |
| Publicado há < 24h | +10 | Frescor |
| Fonte de alta prioridade (comunidade) | +5 | Preferência configurável |
| Sem nenhuma tech incluída | 0 ou descarta | Depende do modo estrito |

#### Sinônimos e normalização

O motor deve reconhecer variações comuns:

| Tech | Sinônimos aceitos |
|------|-------------------|
| `node` | `nodejs`, `node.js`, `express`, `nestjs`, `fastify` |
| `react` | `reactjs`, `react.js`, `next.js`, `nextjs` |
| `typescript` | `ts`, `typescript` |
| `python` | `python`, `django`, `flask`, `fastapi` |

Lista configurável em `src/config/techSynonyms.js`.

#### Classificação visual (tier)

| Tier | Faixa | Significado |
|------|-------|-------------|
| **Alta** | 75–100 | Abordar primeiro |
| **Média** | 50–74 | Vale olhar |
| **Baixa** | 25–49 | Só se sobrar tempo |
| *(abaixo do corte)* | < mínimo | Não aparece na lista |

---

## 4. Funcionalidades e telas

### Mapa de telas (v1)

```
/                          ← redireciona para /busca
/busca                     ← formulário + resultados na mesma página
```

**v1 intencionalmente minimalista:** uma única tela. Sem login, sem detalhe persistido, sem histórico.

### Tela de busca (`/busca`)

**Objetivo:** configurar filtros, executar busca e ver resultados para contato imediato.

#### Seção — Filtros

| Campo | Tipo | Obrigatório |
|-------|------|-------------|
| Tecnologias incluir | chips / autocomplete | sim (≥ 1) |
| Tecnologias excluir | chips / autocomplete | não |
| Termos de intenção | lista editável | não (default pré-preenchido) |
| Palavra-chave livre | texto | não |
| Modo estrito | switch | não (default: ligado) |
| Região | select | não |
| Fontes ativas | checkboxes | não (default: todas da v1) |
| Idade máxima do anúncio | select (7 / 14 / 30 dias) | não |

**Ação principal:** **Buscar oportunidades**

#### Seção — Resultados

| Coluna / campo | Conteúdo |
|----------------|----------|
| Título | Título do anúncio ou post |
| Fonte | Reddit, RemoteOK, etc. |
| Match | score + tier (chip colorido) |
| Stack detectada | chips das tecnologias encontradas |
| Publicado | data relativa ("há 2 dias") |
| Ações | **Abrir original**, **Copiar link** |

**Comportamentos:**

- Clique em **Abrir original** → nova aba com URL da fonte
- Loading por fonte (spinner individual ou barra geral)
- Erro em uma fonte não cancela as outras
- Contador: `X resultados · Y descartados por stack · Z fontes consultadas`
- Empty state: sugestão de afrouxar filtros ou mudar termos

#### Pitch rápido (opcional v1)

Caixa colapsável com template editável no próprio formulário (salvo em `localStorage` só o template, não as oportunidades):

```
Olá! Vi que você está buscando um dev para [contexto].
Trabalho com Node/React e posso ajudar com [tipo de projeto].
Podemos conversar?
```

Botão **Copiar pitch** ao lado de cada resultado (preenche `[contexto]` com o título).

---

## 5. Modelo de dados (em memória)

Não há banco na v1. O modelo existe para padronizar coletores e UI.

### Opportunity

```javascript
{
  id: string,              // hash estável: source + externalId ou url
  title: string,
  description: string,       // trecho ou texto completo
  url: string,               // link para abordagem
  source: string,            // 'reddit' | 'remoteok' | 'remotive' | ...
  sourceLabel: string,       // nome amigável
  publishedAt: string | null,  // ISO 8601
  technologies: string[],    // normalizadas: ['node', 'react']
  intentSignals: string[],   // termos de intenção encontrados
  matchScore: number,        // 0–100
  tier: 'high' | 'medium' | 'low',
  excludedReason: string | null,  // preenchido se filtrado (debug)
  raw: object                // payload original (opcional, dev)
}
```

### SearchParams

```javascript
{
  includeTech: string[],
  excludeTech: string[],
  intentTerms: string[],
  keyword: string,
  strictMode: boolean,
  region: string | null,
  maxAgeDays: number,
  sources: string[],
  minMatchScore: number
}
```

### SearchResult (resposta da orquestração)

```javascript
{
  opportunities: Opportunity[],
  stats: {
    totalFetched: number,
    afterDedupe: number,
    excludedByTech: number,
    excludedByAge: number,
    excludedByScore: number,
    finalCount: number,
    sourceErrors: { source: string, message: string }[]
  },
  searchedAt: string
}
```

---

## 6. Regras de operação

| Regra | v1 |
|-------|-----|
| Persistência de oportunidades | **nenhuma** — só estado React |
| Persistência de preferências | opcional: template de pitch e últimos filtros em `localStorage` |
| Tempo de uma busca | até ~30–60 s (depende das fontes) |
| Buscas simultâneas | uma por vez |
| Dedupe | por URL na sessão atual |
| Privacidade | só dados públicos; você acessa links manualmente |
| Uso | pessoal, local ou deploy estático |

---

## 7. Fases de entrega

### Fase 1 — MVP pessoal (1–2 semanas)

- [ ] Tela única `/busca` com filtros
- [ ] Coletores: RemoteOK, Remotive, Reddit
- [ ] Motor de match incluir/excluir tech
- [ ] Lista de resultados com abrir link
- [ ] Dedupe e ranking simples
- [ ] Loading e erros por fonte
- [ ] Deploy no GitHub Pages (Actions + `base` do Vite) — ver `DEPLOY.md`

### Fase 2 — Refinamento (1 semana)

- [ ] Arbeitnow + mais sinônimos de stack
- [ ] Termos de intenção pré-configurados em PT e EN
- [ ] Pitch rápido com template em `localStorage`
- [ ] Lembrar últimos filtros (`localStorage`)
- [ ] Filtro por idade do anúncio

### Fase 3 — Fontes avançadas (opcional)

- [ ] Google Custom Search / SerpAPI para intenção na web
- [ ] Hacker News
- [ ] Telegram (se canal público + API viável)

### Fase 4 — Produto (futuro, se vender)

- [ ] Back-end com proxy de APIs e keys seguras
- [ ] Autenticação
- [ ] Banco (PostgreSQL) para salvar oportunidades
- [ ] Pipeline: vista, candidatada, descartada
- [ ] Coleta agendada e alertas
- [ ] Multiusuário

---

## 8. Riscos e mitigações

| Risco | Mitigação |
|-------|-----------|
| CORS bloqueia fonte | Priorizar APIs abertas; proxy só na fase com back-end |
| API muda formato | Normalizer por fonte; testes unitários nos parsers |
| Muito ruído nos resultados | Modo estrito + exclusões agressivas |
| Resultados antigos | Filtro `maxAgeDays` |
| Key exposta no front | Aceitável na v1 local; mover para back na fase comercial |
| Scraping de marketplace | **Não fazer** na v1 — instável e contra ToS |
| Falsos positivos de stack | Exigir match no título ou tag, não só descrição |

---

## 9. Métricas de sucesso (uso pessoal)

O sistema cumpre o papel se, em 2–4 semanas de uso real:

| Métrica | Meta |
|---------|------|
| Buscas úteis por semana | ≥ 2 |
| Tempo para montar lista filtrada | < 2 min (vs. 30+ min manual) |
| % resultados com stack errada | < 20% |
| Contatos feitos por sessão | ≥ 5 links abertos |
| Respostas / conversas geradas | ≥ 1 por semana |
| Projetos fechados via radar | ≥ 1 em 60 dias |

---

## 10. Glossário

| Termo | Definição |
|-------|-----------|
| Oportunidade | Anúncio, post ou vaga com sinal de demanda por dev |
| Intenção | Frase que indica que alguém quer contratar (`"preciso de dev"`) |
| Fonte | Origem do dado (Reddit, RemoteOK, etc.) |
| Coletor | Módulo que busca e parseia uma fonte específica |
| Match score | Pontuação 0–100 de compatibilidade com seus filtros |
| Modo estrito | Exige tech incluída; descarta anúncios sem stack clara |
| Tier | Classificação alta / média / baixa do match |
| Dedupe | Remover duplicatas pela mesma URL na sessão |

---

## Documentação técnica

| Arquivo | Conteúdo |
|---------|----------|
| `FRONTEND.md` | React + JS, estrutura de pastas, coletores, serviços e componentes |
| `DEPLOY.md` | GitHub Pages: `base` do Vite, router, `404.html`, Actions e troubleshooting |
| `github-workflows/deploy-pages.yml` | Template do workflow CI para copiar ao repo |

### Evolução futura (quando houver back-end)

| Arquivo futuro | Conteúdo |
|----------------|----------|
| `BACKEND.md` | API REST, proxy de fontes, coleta agendada |
| `DATABASE.md` | Modelo de oportunidades persistidas, histórico, usuários |
