# Aguaribai IA — Home (versión código, fuera de Base44)

Sitio construido en HTML + CSS + JavaScript puro (sin frameworks, sin dependencias de build). Podés hospedarlo donde quieras: Vercel, Netlify, GitHub Pages, tu propio hosting, etc.

## Estructura de archivos

```
/
├── index.html          → la página completa
├── css/styles.css       → todos los estilos
├── js/main.js            → menú mobile, acordeón FAQ, envío de formulario
├── assets/
│   ├── og-image.png     → imagen para compartir en redes/WhatsApp (1200x630)
│   ├── favicon.png / .ico
│   ├── tree-white.png   → tu logo (silueta blanca, para fondos oscuros)
│   └── tree-green.png   → tu logo (silueta verde)
└── README.md            → este archivo
```

## ⚠️ Paso obligatorio antes de publicar: activar el formulario

El formulario de contacto usa **Web3Forms** (gratis, sin backend propio) para que las respuestas te lleguen por email. Para activarlo:

1. Entrá a **https://web3forms.com** y creá una cuenta gratuita con tu email (`contacto@aguaribai.com`).
2. Te va a dar una **Access Key** (una clave larga tipo `a1b2c3d4-...`).
3. Abrí `index.html`, buscá esta línea (Ctrl+F):
   ```html
   <input type="hidden" name="access_key" value="TU_ACCESS_KEY_DE_WEB3FORMS">
   ```
4. Reemplazá `TU_ACCESS_KEY_DE_WEB3FORMS` por tu clave real.
5. Listo. Cada envío del formulario te va a llegar por email.

Mientras no hagas este paso, el formulario muestra un aviso pidiendo configurarlo (no se rompe ni falla en silencio).

Si más adelante preferís que los leads vayan a un CRM o una planilla en vez de tu email, es un cambio simple de la URL de `action` en el `<form>` — decime y lo adaptamos.

## Cómo previsualizarlo en tu computadora

No hace falta instalar nada. Desde la carpeta del sitio:

```bash
python3 -m http.server 8000
```

Y abrís `http://localhost:8000` en el navegador.

## Cómo publicarlo (recomendado: Netlify o Vercel, gratis)

**Opción más simple — Netlify Drop:**
1. Andá a https://app.netlify.com/drop
2. Arrastrá la carpeta completa del sitio
3. En 10 segundos te da una URL pública
4. Después conectás tu dominio `aguaribai.com` desde el panel de Netlify (Domain settings)

**Alternativa — Vercel:** mismo flujo, `vercel.com`, funciona igual de bien con sitios estáticos.

## Qué falta para el resto del sitio

Esta primera entrega es la **home completa**. Las páginas de Consultoría con IA (el formulario de 8 pasos), Automatizaciones IA, About, Contact y las legales (Privacidad, Cookies, Términos) las armamos en la siguiente tanda — los links del footer ya están puestos apuntando a esos archivos (`terminos-y-condiciones.html`, etc.) para que no haya que tocar nada cuando los sumemos.

## Notas de diseño / cambios aplicados del checklist

- Estadística de resultados unificada en **+47%** en todo el sitio (antes convivían 40% y 47%).
- Se sacó la foto de stock del hombre estresado con billetes.
- Paleta de íconos unificada en el verde de marca (antes mezclaba verde/azul/violeta/naranja/rosa sin criterio).
- Copy de las secciones de urgencia reescrito con un tono más calmo, según lo charlado.
- Metadatos (title, description, og:image) específicos en español, apuntando a la imagen OG ya generada.
