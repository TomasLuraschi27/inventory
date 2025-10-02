# Inventory — Lab despliegue Ingeniería de Software - Equipo 7 Jueves Noche

Este README documenta **solo** lo requerido en el **Punto 4** del TP: puerto por defecto 80, migración de almacenamiento a MySQL y uso del repositorio con los cambios.

## Cambios implementados (Punto 4)
- **Puerto por defecto 80** en el servidor (`process.env.PORT || 80`).
- **Migración de SQLite a MySQL** usando `mysql2` y un **pool** de conexiones.
- Nueva capa de acceso a datos en `db.js` que:
  - crea la tabla `products` si no existe,
  - inserta datos de ejemplo si la tabla está vacía.
- README agregado con instrucciones de ejecución.

## Requisitos
- Node.js 18+ (LTS) y npm.
- MySQL 8+ (local, Docker o un servicio gestionado).

## Variables de entorno
Elegir **una** modalidad de configuración de base de datos:

**A) URL completa (recomendada)**
- `DATABASE_URL` → `mysql://usuario:clave@host:3306/inventorydb`

**B) Variables separadas**
- `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_PORT`

La aplicación escucha en `PORT` y por defecto usa **80**.

## Cómo correr en local

### Linux / macOS
```bash
npm ci
DB_HOST=127.0.0.1 DB_USER=inventory DB_PASSWORD=inventorypass DB_NAME=inventorydb npm start
# La app queda en http://localhost (puerto 80 por defecto)
