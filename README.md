# SIGEPED Frontend (Angular 20, Standalone API)

Guia para levantar el proyecto completo en local: backend + frontend.

## 1. Requisitos

- Node.js 20+ (recomendado LTS)
- npm 10+
- Backend SIGEPED disponible en local
- Base de datos del backend operativa

## 2. Configuracion local esperada

### Backend

- URL backend DEV: http://localhost:3000
- URL backend PROD temporal local: http://localhost:3000
- Prefijo API: /api
- Auth habilitada: AUTH_ENABLED=true

### Frontend

- URL frontend DEV: http://localhost:4200
- apiBaseUrl Angular: http://localhost:3000

## 3. Variables de entorno del backend

Crear un archivo .env en el backend con este contenido:

```env
NODE_ENV=development
PORT=3000

# Seguridad
AUTH_ENABLED=true
JWT_SECRET=dev_local_secret_cambiar_en_prod
JWT_EXPIRES_IN=8h
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123

# CORS / rate limit
CORS_ORIGIN=http://localhost:4200
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=300
```

## 4. Levantar backend (paso a paso)

Desde la carpeta del backend:

```bash
npm install
npm run dev
```

Si tu backend usa otro script, reemplaza npm run dev por el script de arranque correspondiente (por ejemplo npm start).

Verificaciones rapidas del backend:

- Docs OpenAPI UI: http://localhost:3000/api/docs
- OpenAPI JSON: http://localhost:3000/api/openapi.json

## 5. Levantar frontend (paso a paso)

Desde esta carpeta (sigeped-frontend):

```bash
npm install
npm start
```

Abrir en navegador:

- http://localhost:4200

## 6. Entornos Angular configurados

Los entornos del frontend ya estan configurados para local:

- src/environments/environment.ts -> apiBaseUrl: http://localhost:3000
- src/environments/environment.prod.ts -> apiBaseUrl: http://localhost:3000 (temporal local)

## 7. Flujo end-to-end recomendado

1. Levantar backend en puerto 3000.
2. Confirmar docs en /api/docs.
3. Levantar frontend en puerto 4200.
4. Hacer login con usuario admin y password admin123.
5. Ir a Pedidos y validar carga de pendientes.
6. Probar accion de revision en un pedido.
7. Probar accion de actualizacion de estado.
8. Borrar token de sessionStorage y verificar redireccion a login en rutas protegidas.

## 8. Endpoints integrados actualmente

- POST /api/auth/login
- GET /api/orders/pending
- POST /api/orders/:id/review
- POST /api/orders/:id/update
- GET /api/admin/orders

## 9. Comandos utiles frontend

```bash
npm start
npm run build
npm test
```

## 10. Problemas comunes

### Error CORS

Verificar en backend:

- CORS_ORIGIN=http://localhost:4200

### 401 o 403 al navegar

- Confirmar login exitoso.
- Verificar que exista token en sessionStorage.
- Confirmar AUTH_ENABLED=true en backend.

### Login falla con INVALID_CREDENTIALS

- Revisar ADMIN_USERNAME y ADMIN_PASSWORD del backend.
- Probar de nuevo con las credenciales del .env.
