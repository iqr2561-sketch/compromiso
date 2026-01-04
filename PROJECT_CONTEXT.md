# Diario Compromiso - Plataforma de Noticias Profesional

## Descripción General
**Diario Compromiso** es una plataforma de noticias digital moderna y profesional desarrollada con React y Vite. El proyecto combina un diseño premium con funcionalidades avanzadas de gestión de contenido, incluyendo noticias, farmacias de turno, resultados deportivos, y más.

## Características Principales

### Frontend Público
- **Hero Section**: Sección principal con noticias destacadas y resultados deportivos en tiempo real
- **Flash News**: Carrusel de noticias urgentes con diseño inmersivo
- **Categorías Dinámicas**: Actualidad, Tech, Deportes, Viral, Finanzas
- **Páginas de Categoría**: Vistas especializadas con widgets específicos (ej: resultados deportivos para Deportes)
- **Vista Individual de Noticias**: Página detallada para cada noticia
- **Sección Multimedia**: Reproductor de videos integrado
- **Newsletter**: Suscripción a boletines
- **Publicidad Dinámica**: Sistema de anuncios gestionables

### Sistema de Farmacias
- **Farmacia de Turno**: Indicador en header que muestra automáticamente la farmacia de turno según la fecha actual
- **Modal Informativo**: Popup con detalles completos (dirección, teléfono, mapa)
- **Programación Automática**: Sistema de calendario visual para asignar farmacias de turno por fecha

### Sistema de Clima
- **Widget de Clima**: Muestra temperatura actual y ciudad (Ciudad de Dolores)
- **Modal Detallado**: Pronóstico extendido con:
  - Temperatura actual
  - Condición climática
  - Humedad y viento
  - Pronóstico de 3 días

### Panel de Administración
El panel admin (`/admin`) permite gestionar todo el contenido de forma centralizada:

#### Dashboard
- Resumen de estadísticas (noticias, farmacias, resultados, farmacia de turno)
- Tarjetas informativas con métricas clave

#### Gestión de Noticias
- Crear, editar y eliminar noticias
- Marcar como "Destacada Portada" (Hero)
- Marcar como "Noticia Flash"
- Filtrado por categoría
- Selección de imágenes desde:
  - URL externa
  - Subida desde PC
  - Galería interna

#### Gestión de Farmacias
- **Modo Listado**: Vista de todas las farmacias con búsqueda
- **Modo Programación**: 
  - Calendario visual interactivo
  - Navegación entre meses
  - Indicadores visuales de días asignados
  - Selección rápida de fechas
  - Asignación de farmacia por día

#### Otras Funcionalidades Admin
- **Categorías**: Gestión de categorías con colores e imágenes
- **Resultados Deportivos**: Crear y editar marcadores con fechas
- **Publicidad**: Gestión de anuncios (premium, cuadrados, horizontales)
- **Videos**: Administración de contenido multimedia
- **Flash Tickers**: Mensajes en ticker bar

## Tecnologías Utilizadas

### Core
- **React 19.2.3**: Biblioteca principal
- **Vite 7.3.0**: Build tool y dev server
- **React Router DOM 7.11.0**: Enrutamiento

### Estilos
- **Tailwind CSS 3.4.19**: Framework de utilidades CSS
- **Framer Motion 12.23.26**: Animaciones y transiciones

### Utilidades
- **Lucide React 0.562.0**: Iconos
- **clsx 2.1.1**: Utilidad para clases condicionales
- **tailwind-merge 3.4.0**: Merge de clases Tailwind

## Estructura del Proyecto

```
diario/
├── src/
│   ├── components/
│   │   ├── AdSection.jsx          # Sección de publicidad
│   │   ├── CategoryGrid.jsx       # Grid de categorías
│   │   ├── FlashNews.jsx          # Carrusel de noticias flash
│   │   ├── Footer.jsx             # Pie de página
│   │   ├── HeaderTop.jsx          # Barra superior (clima, farmacia, edición)
│   │   ├── HeroSection.jsx        # Sección principal
│   │   ├── MultimediaSection.jsx  # Reproductor de videos
│   │   ├── Navbar.jsx             # Navegación principal
│   │   ├── Newsletter.jsx         # Formulario de suscripción
│   │   └── TickerBar.jsx          # Barra de noticias en movimiento
│   ├── context/
│   │   └── NewsContext.jsx        # Estado global de la aplicación
│   ├── pages/
│   │   ├── Admin.jsx              # Panel de administración
│   │   ├── Category.jsx           # Página de categoría
│   │   ├── Home.jsx               # Página principal
│   │   └── Post.jsx               # Página de noticia individual
│   ├── App.jsx                    # Componente raíz
│   ├── index.css                  # Estilos globales
│   └── main.jsx                   # Punto de entrada
├── public/                        # Archivos estáticos
├── index.html                     # HTML base
├── package.json                   # Dependencias
├── tailwind.config.js             # Configuración Tailwind
├── vite.config.js                 # Configuración Vite
└── postcss.config.js              # Configuración PostCSS
```

## Rutas de la Aplicación

- `/` - Página principal
- `/admin` - Panel de administración
- `/categoria/:categoryName` - Página de categoría específica
- `/noticia/:id` - Vista individual de noticia

## Estado Global (NewsContext)

El contexto maneja:
- **news**: Array de noticias
- **flashTickers**: Mensajes del ticker bar
- **scores**: Resultados deportivos
- **categories**: Categorías disponibles
- **ads**: Publicidades
- **videos**: Contenido multimedia
- **imageGallery**: Galería de imágenes
- **pharmacies**: Farmacias registradas
- **pharmacyDuty**: Programación de turnos de farmacias

## Diseño y UX

### Paleta de Colores
- **Primary**: Azul (#256af4)
- **Accent Purple**: Morado (#8b5cf6)
- **Accent Orange**: Naranja (#ff6b00)
- **Accent Pink**: Rosa (#f4256a)
- **Accent Green**: Verde (#00d68f)

### Características de Diseño
- Dark mode por defecto
- Bordes redondeados suaves (rounded-2xl, rounded-3xl)
- Animaciones sutiles con Framer Motion
- Glassmorphism en elementos clave
- Gradientes y sombras para profundidad
- Tipografía bold y tracking ajustado

### Responsive Design
- Mobile-first approach
- Breakpoints: sm, md, lg
- Navegación adaptativa
- Modales optimizados para móvil

## Características Destacadas

### Calendario de Farmacias
- Vista mensual completa
- Navegación entre meses con flechas
- Indicadores visuales:
  - Día seleccionado: Azul con escala aumentada
  - Días con farmacia asignada: Verde con punto indicador
  - Día actual: Anillo de borde
- Selección rápida con un clic
- Fecha seleccionada mostrada en formato legible

### Sistema de Clima Interactivo
- Widget clickeable en header
- Modal con:
  - Temperatura y condición actual
  - Humedad y velocidad del viento
  - Pronóstico de 3 días
  - Temperaturas máximas y mínimas

### Gestión de Imágenes
- Tres métodos de carga:
  1. URL externa
  2. Subida desde PC (convertida a base64)
  3. Selección desde galería interna

## Comandos de Desarrollo

```bash
# Instalar dependencias
npm install

# Servidor de desarrollo
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview
```

## Despliegue

El proyecto está configurado para desplegarse en Vercel:
- Build command: `npm run build`
- Output directory: `dist`
- Framework preset: Vite

## Control de Versiones

Repositorio: `https://github.com/iqr2561-sketch/compromiso.git`

### Estructura de Commits
Los commits siguen el formato: `Tipo: Descripción breve`

Tipos comunes:
- `Feature`: Nueva funcionalidad
- `Fix`: Corrección de bugs
- `Design`: Cambios de diseño/UI
- `UX`: Mejoras de experiencia de usuario
- `Mobile`: Optimizaciones para móvil
- `Content`: Actualización de contenido

## Próximas Mejoras Planificadas

1. Integración con API real de clima
2. Sistema de autenticación para admin
3. Base de datos persistente (Supabase/Firebase)
4. Notificaciones push
5. Modo claro/oscuro toggle
6. Búsqueda global de noticias
7. Comentarios en noticias
8. Compartir en redes sociales
9. PWA (Progressive Web App)
10. Analytics integrado

## Notas de Desarrollo

- El proyecto usa localStorage para persistencia temporal
- Las imágenes se manejan como URLs o base64
- El calendario de farmacias calcula automáticamente días del mes
- Los modales usan AnimatePresence para transiciones suaves
- El header es sticky con z-index optimizado

## Versión Actual

**v4.1** - Última actualización: 04/01/2026

### Cambios Recientes (v4.1)
- ✅ Calendario visual para programación de farmacias
- ✅ Modal de clima con pronóstico detallado
- ✅ Reorganización de header (Navbar primero)
- ✅ Nombre del diario visible en móvil
- ✅ Optimización de HeaderTop para móvil
- ✅ Mejoras en sistema de noticias Flash
- ✅ Integración de farmacia de turno automática

## Contacto y Soporte

Para consultas sobre el proyecto, contactar al equipo de desarrollo.

---

**Diario Compromiso** - Información que importa, diseño que impacta.
