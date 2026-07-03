# Rick and Morty App

Prueba técnica Full Stack — aplicación que permite buscar, filtrar, marcar como favoritos
y comentar personajes de [Rick and Morty](https://rickandmortyapi.com/api), consumidos
desde una base de datos propia (MySQL) cacheada con Redis, expuesta vía GraphQL.

El frontend **no consume la API pública directamente** — todo pasa por el backend propio.

---

## Stack

**Backend**
- Node.js + TypeScript (`strict: true`)
- Express + Apollo Server 4 (GraphQL)
- Sequelize (ORM) + MySQL 8
- Redis (cache-aside para la query de personajes)
- Jest (unit tests)
- node-cron (actualización automática de personajes cada 12h)

**Frontend**
- React 18 + TypeScript + Vite
- Apollo Client (GraphQL)
- React Router DOM
- TailwindCSS

**Infraestructura**
- Docker Compose (MySQL 8 + Redis 7, con healthchecks)

---

## Arquitectura del backend

3 capas, sin acceso directo de los resolvers a Sequelize:

```
resolver → service → model
```

- **resolvers/**: reciben la query/mutation de GraphQL, delegan a un service, envuelven todo en `try/catch` (nunca exponen errores internos de Sequelize al cliente).
- **services/**: lógica de negocio, cache-aside con Redis, invalidación de cache.
- **models/**: definición de tablas con Sequelize.

---

## Cómo levantar el proyecto desde cero

### Requisitos
- Docker + Docker Compose
- Node.js 18+
- npm

### 1. Clonar el repositorio

```bash
git clone https://github.com/juacamilo-dev/rick-and-morty-app.git
cd rick-and-morty-app
```

### 2. Levantar MySQL y Redis con Docker

```bash
docker-compose up -d
```

Esto levanta:
- MySQL 8 en `localhost:3307` (mapeado así para no chocar con otro MySQL local en 3306; ver `docker-compose.yml`)
- Redis 7 en `localhost:6379`

Verificá que ambos contenedores estén saludables:

```bash
docker ps
```

### 3. Backend

```bash
cd backend
npm install
cp .env.example .env
npm run migrate
npm run seed
npm run dev
```

- `npm run migrate` crea las tablas (`characters`, `favorites`, `comments`).
- `npm run seed` trae 15 personajes reales desde la API pública de Rick and Morty y los guarda en MySQL.
- `npm run dev` levanta el servidor GraphQL en **http://localhost:4000/graphql**.

### 4. Frontend

En otra terminal:

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

La app queda disponible en **http://localhost:5173**.

### 5. Correr los tests del backend

```bash
cd backend
npm test
```

---

## Variables de entorno

### `backend/.env`

| Variable | Descripción |
|---|---|
| `PORT` | Puerto del servidor Express/Apollo (default `4000`) |
| `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` | Conexión a MySQL (deben coincidir con `docker-compose.yml`) |
| `REDIS_HOST`, `REDIS_PORT`, `REDIS_CACHE_TTL` | Conexión a Redis y TTL del cache en segundos |
| `RICK_AND_MORTY_API` | URL base de la API pública, usada solo por el seeder y el cron |

### `frontend/.env`

| Variable | Descripción |
|---|---|
| `VITE_GRAPHQL_URI` | URL del endpoint GraphQL del backend (default `http://localhost:4000/graphql`) |

Ninguna credencial real está commiteada — solo los `.env.example` con valores de ejemplo.

---

## Modelo de datos (ERD)

3 tablas: `characters`, `favorites` (1:1 con characters) y `comments` (1:N con characters).

Diagrama disponible en [`docs/erd.drawio`](docs/erd.drawio) — importable directo en [app.diagrams.net](https://app.diagrams.net) (File → Open From → Device).

---

## Uso de la API GraphQL

Endpoint: `http://localhost:4000/graphql`

### Listar personajes con filtros y orden

```graphql
query GetCharacters($filter: CharacterFilterInput, $sortByName: SortOrder) {
  characters(filter: $filter, sortByName: $sortByName) {
    id
    name
    status
    species
    gender
    origin
    image
    isFavorite
  }
}
```

Variables de ejemplo:

```json
{
  "filter": { "species": "Human", "status": "Alive", "onlyFavorites": false },
  "sortByName": "ASC"
}
```

### Obtener un personaje con sus comentarios

```graphql
query GetCharacter($id: ID!) {
  character(id: $id) {
    id
    name
    species
    status
    origin
    isFavorite
    comments {
      id
      content
      createdAt
    }
  }
}
```

### Marcar/desmarcar como favorito

```graphql
mutation {
  toggleFavorite(characterId: "1") {
    id
    isFavorite
  }
}
```

### Agregar un comentario

```graphql
mutation {
  addComment(characterId: "1", content: "Wubba lubba dub dub!") {
    id
    content
    createdAt
  }
}
```

### Soft-delete de un personaje

```graphql
mutation {
  softDeleteCharacter(characterId: "1") {
    id
  }
}
```

El personaje deja de aparecer en `characters` y `character(id)`, pero no se borra
físicamente de la base de datos (`isDeleted: true`).

---

## Funcionalidades

- Listado de personajes en tarjetas (avatar, nombre, especie), separados en "Starred" y "Characters".
- Filtros por Character (All/Starred/Others), Specie, Status y Gender — panel dropdown en desktop, pantalla completa en mobile.
- Búsqueda por nombre en vivo.
- Ordenamiento A-Z / Z-A.
- Detalle del personaje: imagen, Specie, Status, Origin, botón de favorito.
- Comentarios: agregar y listar, con fecha.
- Soft-delete de personajes desde el detalle.
- Cache de la búsqueda de personajes en Redis (invalidado automáticamente al favoritar, comentar o borrar).
- Cron cada 12 horas que actualiza los datos de los personajes desde la API pública.
- Middleware que loguea método, URL, operación GraphQL y variables de cada request.
- Decorador que mide el tiempo de ejecución de la query de búsqueda.

---

## Decisiones de diseño no cubiertas por el Figma original

- El campo **Origin** se muestra en el detalle en vez de "Occupation" (no existe en la API pública de Rick and Morty).
- La sección de comentarios (textarea + botón + lista con fecha) fue diseñada sin referencia visual directa del Figma.
- Los filtros por Status y Gender se agregaron por fuera del Figma porque el enunciado los pide explícitamente.
