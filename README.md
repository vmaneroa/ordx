# ordx

**Del caos al orden, al instante.**

ordx es una PWA mobile-first que procesa "volcados mentales" caóticos usando la API de Claude y los convierte en tareas, eventos y notas perfectamente organizadas siguiendo el método GTD (Getting Things Done).

## ¿Cómo funciona?

1. Escribe todo lo que tienes en la cabeza en el textarea — sin filtros, sin orden.
2. Pulsa **✦ Ordenar mi mente**.
3. Claude clasifica tu volcado en 6 categorías: 🚨 Urgente, ✅ Tareas, 📅 Calendario, 🛒 Compra/Recados, 📝 Notas e ideas, y 🗑️ Ruido mental.
4. Marca tareas como completadas, copia el resultado en Markdown o revisa tus últimos 5 volcados en el historial.

Todos los datos del usuario viven **solo en su dispositivo** (localStorage). El único tráfico externo es la llamada a la API de Anthropic a través de la Serverless Function, donde la API key queda guardada de forma segura (nunca llega al navegador).

## Arquitectura

Sin servidor propio que mantener:

```
ordx/
├── api/
│   └── process.js          # Vercel Serverless Function → proxy a la API de Claude
├── client/                 # React 18 + Vite + Tailwind + Framer Motion (PWA)
│   ├── scripts/
│   │   └── generate-icons.mjs   # genera iconos + splash en cada build
│   └── src/
├── vercel.json             # rutas: /api/* → functions, resto → SPA
└── package.json
```

- **Frontend:** React 18 + Vite + Tailwind CSS + Framer Motion. PWA completa con service worker (vite-plugin-pwa) y caché offline de la interfaz.
- **Backend:** una única Serverless Function (`api/process.js`) que llama a `claude-sonnet-4-6`.

## Despliegue en Vercel (5 minutos, gratis)

### Paso 1 — Sube el código a GitHub

```bash
git init
git add .
git commit -m "feat: ordx PWA"
# Crea un repo en github.com y sigue sus instrucciones para subir
```

### Paso 2 — Conecta con Vercel

1. Ve a [vercel.com](https://vercel.com) e inicia sesión con tu cuenta de GitHub
2. **"Add New Project"** → selecciona el repo de ordx
3. Vercel detecta automáticamente la config de `vercel.json`
4. **NO cambies nada** en la configuración de build — ya está en `vercel.json`
5. Antes de hacer clic en "Deploy", ve a **"Environment Variables"** y añade:
   `ANTHROPIC_API_KEY = sk-ant-xxxxxxxxx`
6. Clic en **"Deploy"**

En 2 minutos tienes tu URL: `https://ordx-[tuusuario].vercel.app` — HTTPS real, así que el service worker y la caché offline funcionan completos.

### Instalar en iPhone

1. Abre esa URL en **Safari** del iPhone (Chrome en iOS no permite instalar PWAs)
2. Botón compartir □↑ → **"Añadir a pantalla de inicio"**
3. Listo — funciona como app nativa, con icono propio, splash screen y sin barra de Safari

### Para actualizar la app

```bash
git add . && git commit -m "update" && git push
```

Vercel redespliega automáticamente en menos de 1 minuto.

### Desarrollo local

```bash
npm install -g vercel   # solo la primera vez
vercel dev              # arranca frontend + serverless function juntos
```

`vercel dev` lee la `ANTHROPIC_API_KEY` de tu archivo `.env` local (crea uno a partir de `.env.example`). También puedes ejecutar `npm run dev` para levantar solo el frontend con Vite (el proxy de `/api` apunta al puerto 3000, donde `vercel dev` sirve las functions).

## Variables de entorno

| Variable | Descripción |
| --- | --- |
| `ANTHROPIC_API_KEY` | Tu API key de Anthropic — configúrala en Vercel (Environment Variables) y en `.env` para desarrollo local |
