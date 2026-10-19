# syntax=docker/dockerfile:1
FROM node:22-alpine AS base
WORKDIR /app

# ---- build: instala todas las dependencias (incluidas devDependencies,
# necesarias para que `astro build` procese Tailwind/TS) y compila ----
FROM base AS build
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# ---- runtime: solo dependencias de producción + el resultado del build ----
FROM base AS runtime
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=4321
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY --from=build /app/dist ./dist
EXPOSE 4321
CMD ["node", "./dist/server/entry.mjs"]
