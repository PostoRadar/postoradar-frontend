# Etapa de build: instala dependências e gera o bundle estático. As VITE_* são
# lidas pelo Vite nesta etapa e ficam embutidas no JS (não existe "runtime env"
# em uma SPA), por isso entram como build args, não como env do container final.
FROM node:22-slim AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

ARG VITE_AUTH_API_URL
ARG VITE_API_URL
ARG VITE_GEO_API_URL
ENV VITE_AUTH_API_URL=$VITE_AUTH_API_URL
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_GEO_API_URL=$VITE_GEO_API_URL

RUN npm run build

# Etapa final: imagem enxuta servindo os arquivos estáticos com Nginx.
FROM nginx:alpine AS runner
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
