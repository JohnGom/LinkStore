# LinksStore

Guarda, organiza y vuelve a encontrar tus enlaces favoritos: categorías
múltiples, búsqueda instantánea, notas personales, metadatos automáticos
(título/descripción/favicon) y modo claro/oscuro.

**Stack:** Astro (SSR) + Preact · PostgreSQL + Drizzle ORM · Tailwind CSS v4 ·
autenticación propia con sesiones · Docker.

## Desarrollo local

Requiere Node 22+ (usa `.nvmrc`) y Docker Desktop corriendo.

```sh
npm install
cp .env.example .env          # ajusta valores si quieres
npm run db:up                 # levanta solo Postgres en Docker (puerto 5433)
npm run db:migrate            # crea las tablas
npm run db:seed               # opcional: usuario y datos de ejemplo
npm run dev                   # http://localhost:4321
```

El usuario de ejemplo creado por `db:seed` es `demo@linksstore.dev` / `demo1234`.

## Despliegue con Docker (app + base de datos)

```sh
cp .env.example .env          # ajusta POSTGRES_PASSWORD antes de un despliegue real
docker compose up -d --build  # construye la imagen de la app y levanta todo
npm run db:migrate            # corre las migraciones (usa el Postgres expuesto en el host)
```

La app queda disponible en `http://localhost:3000` (configurable con `APP_PORT`
en `.env`). `docker compose up -d` en corridas posteriores reutiliza la imagen
ya construida; usa `--build` de nuevo solo si cambiaste el código.

Dentro de la red de Docker, la app se conecta a Postgres por el host interno
`db` (no por `localhost:5433`, que es solo para herramientas en tu máquina
como `drizzle-kit` o `psql`). Los datos de Postgres persisten en el volumen
nombrado `db-data` aunque detengas o reconstruyas los contenedores.

Otros comandos útiles:

```sh
docker compose logs -f app    # logs de la app
docker compose down           # detiene todo (conserva el volumen de datos)
```

## Variables de entorno

| Variable            | Uso                                                               |
| ------------------- | ----------------------------------------------------------------- |
| `POSTGRES_USER`     | Usuario de la base de datos                                       |
| `POSTGRES_PASSWORD` | Contraseña de la base de datos — cámbiala en producción           |
| `POSTGRES_DB`       | Nombre de la base de datos                                        |
| `POSTGRES_PORT`     | Puerto expuesto en el host para Postgres (default `5433`)         |
| `DATABASE_URL`      | Cadena de conexión usada por herramientas del host (dev, seed)    |
| `APP_PORT`          | Puerto expuesto en el host para la app en Docker (default `3000`) |

## Scripts

| Comando               | Acción                                               |
| --------------------- | ---------------------------------------------------- |
| `npm run dev`         | Servidor de desarrollo en `localhost:4321`           |
| `npm run build`       | Compila la app para producción a `./dist/`           |
| `npm run preview`     | Sirve el build de producción localmente              |
| `npm run lint`        | ESLint                                               |
| `npm run format`      | Prettier (escribe cambios)                           |
| `npm run db:up`       | Levanta solo Postgres vía Docker Compose             |
| `npm run db:down`     | Detiene los contenedores de Docker Compose           |
| `npm run db:generate` | Genera una migración de Drizzle a partir del esquema |
| `npm run db:migrate`  | Aplica las migraciones pendientes                    |
| `npm run db:studio`   | Abre Drizzle Studio para explorar la base de datos   |
| `npm run db:seed`     | Crea un usuario y datos de ejemplo                   |
