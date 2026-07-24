# ---------- Estágio 1: build do site estático (Astro) ----------
FROM node:22-alpine AS build
WORKDIR /app

# Instala dependências. Usamos `npm install` (e não `npm ci`) porque o
# package-lock.json é gerado no Windows e não prevê 100% das dependências
# opcionais nativas do Linux (ex.: @emnapi/* puxados pelo @tailwindcss/oxide),
# o que faz o `npm ci` falhar por "lock file out of sync" dentro do container.
COPY package.json package-lock.json ./
RUN npm install --no-audit --no-fund

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

CMD ["nginx", "-g", "daemon off;"]
