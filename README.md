# ERP Prototype — Monorepo de Microservicios

Monorepositorio de microservicios orientado a un sistema tipo ERP/supermercado, basado en [practice3-uab-microservices](https://github.com/Maur025/practice3-uab-microservices.git).

Cada dominio evoluciona de forma independiente, con una base común para comunicación, base de datos y despliegue local.

## Estructura general

| Servicio        | Puerto | Descripción                                      |
|-----------------|--------|--------------------------------------------------|
| `erp-gateway`   | 7800   | API Gateway, proxy HTTP, Swagger                 |
| `erp-purchase`  | 7801   | Compras                                          |
| `erp-people`    | 7802   | Auth, usuarios, roles, empleados (Sequelize/JWT) |
| `erp-inventory` | 7803   | Inventario                                       |
| `erp-sale`      | 7804   | Ventas                                           |
| `erp-payment`   | 7805   | Pagos                                            |

Infraestructura adicional:

- `containers/` — MariaDB compartida y scripts SQL de inicialización.
- `docs/diagrams/` — Diagramas Mermaid de arquitectura.

## Gateway y endpoints

El gateway en `7800` centraliza el acceso. Además del health check propio, reenvía solicitudes a los microservicios:

| Ruta                 | Tipo  | Destino              |
|----------------------|-------|----------------------|
| `GET /api/health`    | Directa | Gateway            |
| `/api/personas/*`    | Proxy | `erp-people`         |
| `/api/compras/*`     | Proxy | `erp-purchase`       |
| `/api/inventarios/*` | Proxy | `erp-inventory`      |
| `/api/ventas/*`      | Proxy | `erp-sale`           |
| `/api/finanzas/*`    | Proxy | `erp-payment`        |

En `erp-people` también existe `GET /health` para validación directa del servicio.

## Tecnologías

- Node.js, Express, MariaDB, `mysql2`, `dotenv`
- `erp-people`: Sequelize, JWT, bcrypt, Swagger
- `erp-gateway`: `http-proxy-middleware`, Swagger
- ESLint, Jest (servicios upstream), pnpm

## Requisitos

- Node.js 22+
- pnpm (recomendado) o npm
- Docker y Docker Compose

## Inicio rápido

### 1. Base de datos compartida (otros servicios)

```bash
cd containers/mariadb
cp .env.example .env   # si aplica
docker compose up -d
```

### 2. Instalar dependencias de todos los servicios

```bash
./init-services.sh
```

### 3. MVP local (gateway + people con Sequelize)

```bash
# Base de datos dedicada para erp-people
docker compose up -d mariadb-people

cp erp-people/.env.example erp-people/.env
cp erp-gateway/.env.example erp-gateway/.env

cd erp-people && pnpm install && pnpm run migrate && pnpm run seed && pnpm run dev
cd erp-gateway && pnpm install && pnpm run dev
```

### 4. Stack completo en Docker (gateway + people)

```bash
docker compose up -d --build
```

URLs:

- Gateway Swagger: http://localhost:7800/api/docs
- People Swagger: http://localhost:7802/api/docs
- Health Gateway: http://localhost:7800/api/health
- Health People: http://localhost:7802/health

### Usuario administrador (seed)

| Campo    | Valor           |
|----------|-----------------|
| Usuario  | `admin`         |
| Email    | `admin@erp.com` |
| Password | `Admin123*`     |
| Rol      | ADMINISTRADOR   |

## Ejemplos de API (vía Gateway :7800)

```bash
# Login
curl -X POST http://localhost:7800/api/personas/auth/login \
  -H "Content-Type: application/json" \
  -d '{"identifier":"admin","password":"Admin123*"}'

# Sucursales
curl http://localhost:7800/api/personas/sucursales \
  -H "Authorization: Bearer TOKEN"
```

## Variables de entorno

`SERVER_REDIRECTION` en el gateway controla los destinos del proxy:

- `DEV` — localhost (7801–7805)
- `DOCKER` — nombres de servicio en docker-compose
- `PROD` — nombres de servicio en Kubernetes

## Diagramas

Ver `docs/diagrams/`:

- `arquitectura-general.mmd`
- `flujo-login.mmd`
- `erp-people-er.mmd`

## Notas

- `erp-people` usa base de datos propia (`erp_people_db`) con migraciones Sequelize.
- Los demás servicios usan `sistema_supermercado_db` vía `containers/`.
- Repositorio remoto: https://github.com/Maur025/practice3-uab-microservices.git
