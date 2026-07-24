# ---------- Estágio 1: build do site estático (Astro) ----------
FROM node:22-alpine AS build
WORKDIR /app

# Instala dependências a partir do lockfile (build reprodutível)
COPY package.json package-lock.json ./
RUN npm ci

# Copia o restante do código e gera o site estático em /app/dist
COPY . .
RUN npm run build

# ---------- Estágio 2: servir com Nginx ----------
FROM nginx:1.27-alpine AS runtime

# Configuração do Nginx (SPA/MPA estático + cache de assets)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia apenas o resultado do build
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

# Healthcheck simples (útil para o EasyPanel/Traefik saberem que o container está pronto)
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost/ >/dev/null 2>&1 || exit 1

CMD ["nginx", "-g", "daemon off;"]
