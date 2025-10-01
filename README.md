# Inventory — TP Ingeniería de Software

Aplicación Node.js + Express para gestión simple de inventario.

## Objetivo (Parte 4)
- Crear este **README**.
- Cambiar el **puerto de ejecución por defecto a 80** (en Elastic Beanstalk se usa `PORT=8080` por variable de entorno).
- Migrar la base de datos de **SQLite** a **MySQL o PostgreSQL**.
- Publicar el **link del repositorio con los cambios**.

## Requisitos
- Node.js 18+ (LTS)

## Cómo correr en local
```bash
npm ci
# Por defecto la app usa PORT=80
npm start
# o explícito:
# PORT=80 npm start
