# Información Técnica del Proyecto

## Tecnologías Utilizadas
- **Core**: React 18+ con Vite.
- **Estilos**: Tailwind CSS 3.x.
- **Ruteo**: React Router DOM 6.x.
- **Animaciones**: Framer Motion.
- **Iconos**: Lucide React.
- **Estado**: Context API de React.

## Estructura de Archivos
```
diario/
├── src/
│   ├── components/       # Componentes reutilizables (UI)
│   │   ├── Navbar.jsx
│   │   ├── HeaderTop.jsx
│   │   ├── HeroSection.jsx
│   │   ├── FlashNews.jsx
│   │   ├── CategoryGrid.jsx
│   │   ├── Newsletter.jsx
│   │   └── Footer.jsx
│   ├── context/          # Gestión de estado (NewsContext.jsx)
│   ├── pages/            # Páginas principales (Home.jsx, Admin.jsx)
│   ├── App.jsx           # Componente raíz y ruteo
│   ├── main.jsx          # Punto de entrada
│   └── index.css         # Directivas de Tailwind y estilos globales
├── public/               # Activos estáticos
├── PROJECT_CONTEXT.md    # Documentación de negocio/visión
├── TECHNICAL_INFO.md     # Esta documentación
├── tailwind.config.js    # Configuración de diseño del sistema
└── vite.config.js        # Configuración del empaquetador
```

## Gestión de Datos (NewsContext)
El sistema utiliza un `NewsContext` que centraliza el estado de las noticias. Incluye:
- `news`: Array de objetos de noticias.
- `addNews(newsObject)`: Agrega una nueva noticia al inicio del array.
- `updateNews(id, newsObject)`: Actualiza una noticia existente.
- `deleteNews(id)`: Elimina una noticia por ID.

## Configuración de Desarrollo
Para iniciar el proyecto localmente:
1. Instalar dependencias: `npm install`
2. Iniciar servidor de desarrollo: `npm run dev`
3. Construir para producción: `npm run build`

## Notas de Implementación
- El modo oscuro está forzado mediante la clase `dark` en el tag `html`.
- Se ha implementado un sistema de "preview" de imágenes en el panel de administración para mejorar la experiencia de carga de noticias.
- Las animaciones están optimizadas para no penalizar el rendimiento.
