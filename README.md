# MediaHunter

App web para buscar y descargar contenido multimedia gratuito (imágenes, videos, audio, GIFs) desde múltiples fuentes.

## Arquitectura

```
app_descarga/
├── backend/     # Express + TypeScript (API server)
├── frontend/    # React + Vite + Material UI v7
```

## Fuentes de Contenido

| Fuente     | Tipo              | API Key                              |
|------------|-------------------|--------------------------------------|
| Pexels     | Imágenes, Videos  | https://www.pexels.com/api/          |
| Pixabay    | Imágenes, Videos  | https://pixabay.com/api/docs/        |
| Giphy      | GIFs              | https://developers.giphy.com/        |
| Freesound  | Audio, Efectos    | https://freesound.org/apiv2/apply/   |

## Setup

### 1. Clonar e instalar dependencias

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Configurar API Keys

Edita `backend/.env` y agrega tus API keys (todas son gratuitas):

```env
PEXELS_API_KEY=tu_key_aqui
PIXABAY_API_KEY=tu_key_aqui
GIPHY_API_KEY=tu_key_aqui
FREESOUND_API_KEY=tu_key_aqui
```

### 3. Ejecutar

```bash
# Terminal 1 - Backend (puerto 4000)
cd backend
npm run dev

# Terminal 2 - Frontend (puerto 5173)
cd frontend
npm run dev
```

Abre http://localhost:5173 en tu navegador.

## Funcionalidades

- Búsqueda unificada en múltiples APIs
- Filtros por tipo (imagen, video, audio, GIF)
- Filtros de orientación y ordenamiento
- Vista previa inline (reproductor video/audio, lightbox imágenes)
- Descarga directa con múltiples calidades
- Favoritos (localStorage)
- Historial de búsqueda
- Modo oscuro / claro
- Bilingüe (Español / English)
- Responsive (mobile-first)

## Tech Stack

- **Frontend**: React 18, Vite, Material UI v7.3.7, i18next
- **Backend**: Express, TypeScript, Axios
- **APIs**: Pexels, Pixabay, Giphy, Freesound
