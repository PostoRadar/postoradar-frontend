# postoradar-frontend

Frontend web do **PostoRadar**. Interface para consultar postos de combustível
por preço e proximidade, e para a comunidade colaborar atualizando preços em
tempo real. Consome diretamente o `postoradar-api` (postos/preços) e o
`postoradar-auth` (cadastro/login) — não existe gateway entre eles.

## Stack

- React + TypeScript + Vite
- React Router
- TanStack Query (estado de servidor/cache)
- React Hook Form + Zod (formulários e validação)
- Leaflet + React Leaflet (mapa)
- Axios (dois clients HTTP, um por serviço)

## Arquitetura

```
src/
├── app/            # composição: providers, roteador, layout com header
├── pages/          # 1 componente por rota, monta as features
├── features/
│   ├── auth/        # contexto de sessão, formulários de login/cadastro
│   ├── postos/       # busca, cadastro e atualização de preço de postos
│   └── map/           # mapa (Leaflet), marcadores, prévia de coordenadas
└── shared/
    ├── api/          # clients HTTP, storage de token, normalização de erro
    ├── geo/            # localização do usuário e ordenação por proximidade
    ├── components/      # peças de UI reaproveitadas entre features
    ├── routes/            # guarda de rota autenticada
    └── config/              # validação das variáveis de ambiente
```

### Autenticação e renovação de token

O `accessToken` (JWT, expira em 15min) e o `refreshToken` ficam em
`localStorage`. Um interceptor no client da API principal detecta `401`,
chama `POST /auth/refresh` e repete a requisição original com o token novo —
sem derrubar a sessão do usuário. Como o `postoradar-auth` **rotaciona** o
refresh token a cada uso, as chamadas de renovação são deduplicadas
(`shared/api/authSession.ts`): se duas requisições falharem ao mesmo tempo,
as duas aguardam a mesma renovação em vez de disparar duas em paralelo.

### Ordenação por proximidade

O `postoradar-geo` (serviço de geolocalização do time) ainda não existe, então
a ordenação "mais próximos" é calculada no client via fórmula de Haversine,
usando a localização do navegador e a lat/lon que a API já retorna em cada
posto. Essa lógica fica isolada atrás de uma interface
(`shared/geo/proximity/ProximitySortStrategy.ts`), com a implementação ativa
escolhida em um único arquivo (`index.ts`) — quando o serviço remoto existir,
troca-se a implementação sem tocar em nenhuma tela.

## Rotas

| Caminho | Página | Autenticação |
| --- | --- | --- |
| `/` | Landing | — |
| `/buscar` | Mapa, filtros e lista de postos | — |
| `/login`, `/cadastro` | Autenticação | — |
| `/postos/:id` | Detalhe do posto e atualização de preço | leitura pública; atualizar preço exige login |
| `/postos/novo` | Cadastro de posto | obrigatória |

## Como rodar

Pré-requisitos: Node.js 20+, e os serviços `postoradar-auth` e
`postoradar-api` no ar (via `docker compose up -d --build` no
`postoradar-infra`, ou rodando localmente).

```bash
npm install
cp .env.example .env   # ajuste as URLs se os serviços não estiverem em localhost
npm run dev
```

O frontend sobe por padrão em `http://localhost:5173`.

## Variáveis de ambiente

| Variável | Padrão | Descrição |
| --- | --- | --- |
| `VITE_AUTH_API_URL` | `http://localhost:4000/api` | Base do serviço de autenticação |
| `VITE_API_URL` | `http://localhost:3333/api` | Base da API principal (postos/preços) |
