# BLUEPRINT: Sistema Diario Compromiso (V4.8.0)

Este documento proporciona una visión técnica detallada del proyecto para facilitar la comprensión de su arquitectura, configuración y flujo de datos por otros modelos de IA o desarrolladores.

## 1. Arquitectura General
El sistema es una aplicación web moderna tipo SPA (Single Page Application).
- **Frontend**: React (Vite) + TailwindCSS + Framer Motion.
- **Backend / API**: Vercel Serverless Functions (Node.js).
- **Base de Datos**: PostgreSQL (alojada en Supabase).
- **Estado Global**: React Context API (`NewsContext.jsx`).

## 2. Stack Tecnológico
- **UI & Estilos**: TailwindCSS para el diseño responsivo, Lucide-React para iconografía, Framer Motion para animaciones premium.
- **Ruteo**: `react-router-dom`.
- **Base de Datos**: Conexión vía `pg` (Pool de conexiones) en las Serverless Functions.
- **Gestión de Imágenes**: Soporte para URLs externas y carga local (vía galería compartida).

## 3. Estructura de Datos (Tablas Principales)
- `news`: Almacena las noticias (título, contenido, categoría, imagen, fecha, visualizaciones, flags `is_hero`, `is_flash`).
- `categories`: Estructura jerárquica con `parent_id` para secciones y subsecciones.
- `settings`: Tabla clave-valor para configuración global (Edición, Tapa, claves de API, estados de módulos).
- `ads`: Gestión de banners publicitarios por slots (`sidebar_1`, `premium`, `footer`, `hero_slots`).
- `comments`: Sistema de comentarios con moderación (`pending`, `approved`, `rejected`).
- `pharmacies` & `pharmacy_duty`: Control de farmacias de turno según calendario.
- `city_hero`: Imágenes panorámicas para el carrusel de la portada.

## 4. Lógica de Negocio Central (`NewsContext.jsx`)
Es el "corazón" de la aplicación. Gestiona:
- Fetching de datos iniciales al cargar la app.
- CRUD de noticias, categorías, anuncios y videos.
- Persistencia de configuraciones globales en la tabla `settings`.
- Integraciones externas:
    - **Clima**: Fetching desde `WeatherAPI.com` usando configuración dinámica (API Key y ciudad).
    - **IA**: Parámetros para conectar con modelos (Gemini/Groq) para asistencia editorial.

## 5. Panel de Administración (`Admin.jsx`)
Un módulo robusto (2500+ líneas) que centraliza el control total:
- **Dashboard**: Estadísticas rápidas y estado del servidor.
- **Editor de Noticias**: Soporte para bloques de contenido (texto e imagen) y previsualización.
- **Moderación**: Control granular de comentarios.
- **Ajustes Modulares**: Secciones organizadas para Clima, IA, Edición, Identidad Visual y Base de Datos.

## 6. Configuración de Despliegue
- Las variables de entorno (`DATABASE_URL`, etc.) deben configurarse en el panel de Vercel.
- La aplicación escala automáticamente mediante funciones serverless de Vercel.
- Se utiliza `npm run build` (Vite) para generar el bundle de producción.

## 7. Notas para Futuras Extensiones
- El sistema de categorías soporta anidación infinita conceptualmente (vía `parent_id`).
- El diseño está optimizado para Light/Dark mode mediante clases de Tailwind.
- Las noticias flash (`flash_tickers`) se rotan automáticamente en el header.
