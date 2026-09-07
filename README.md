# STUBER.WEB

Portfolio web de STUBER.WEB, desarrollado con HTML, CSS y JavaScript, con una API Flask opcional para recibir proyectos por correo.

## Estructura

- `index.html` — página principal.
- `css/` — reset, tokens, componentes, secciones, formulario y responsive.
- `js/` — navegación, animaciones, cursor, formulario y bootstrap.
- `data/projects.js` — punto de extensión para proyectos dinámicos.
- `backend/` — API Flask y servicio SMTP.
- `404.html` — página de error personalizada.

## Frontend

Puede abrirse directamente con Live Server o cualquier servidor estático.

El formulario actualmente utiliza Web3Forms desde el navegador. La API Flask incluida queda disponible para una futura integración con SMTP propio.

## Backend

Requiere Python 3.11+ recomendado.

```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy backend\.env.example backend\.env
python backend\app.py
```

Configurá las variables de `backend/.env` antes de usar el envío SMTP.

## Producción

- No subir `.env`.
- No subir `.venv`.
- Restringir `CORS_ORIGINS` al dominio real.
- Ejecutar Flask detrás de un servidor WSGI/reverse proxy.
- Usar HTTPS.
- Configurar el dominio real antes de generar `sitemap.xml`.

## Nota sobre Web3Forms

La integración frontend conserva el método client-side de Web3Forms para no romper el formulario existente. La Access Key de Web3Forms está diseñada por el proveedor para utilizarse desde el cliente; aun así, conviene proteger el formulario con medidas anti-spam y revisar periódicamente el uso de la clave.
