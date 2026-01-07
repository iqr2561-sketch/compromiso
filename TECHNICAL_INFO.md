# Información Técnica - Diario Compromiso

## Stack Tecnológico Completo

### Frontend Framework
- **React 19.2.3**
  - Hooks: useState, useContext, useRef
  - Context API para estado global
  - Componentes funcionales
  
### Build Tool
- **Vite 7.3.0**
  - Hot Module Replacement (HMR)
  - Optimización de build
  - Plugin React oficial (@vitejs/plugin-react 5.1.2)

### Routing
- **React Router DOM 7.11.0**
  - BrowserRouter
  - Routes y Route
  - useLocation, useParams, Link
  - Navegación programática

### Estilos
- **Tailwind CSS 3.4.19**
  - Configuración personalizada
  - Paleta de colores custom
  - Utilidades extendidas
- **PostCSS 8.5.6**
- **Autoprefixer 10.4.23**
- **@tailwindcss/postcss 4.1.18**

### Animaciones
- **Framer Motion 12.23.26**
  - motion components
  - AnimatePresence
  - whileHover, whileTap
  - Transiciones suaves

### Iconos y Utilidades
- **Lucide React 0.562.0**: Biblioteca de iconos
- **clsx 2.1.1**: Utilidad para clases condicionales
- **tailwind-merge 3.4.0**: Merge inteligente de clases Tailwind

## Configuración de Tailwind

### Colores Personalizados
```javascript
colors: {
  primary: '#256af4',
  'accent-purple': '#8b5cf6',
  'accent-orange': '#ff6b00',
  'accent-pink': '#f4256a',
  'accent-green': '#00d68f',
  'background-light': '#f8fafc',
  'background-dark': '#0a0c10',
  'surface-dark': '#11141b',
  'surface-darker': '#14171d'
}
```

### Fuentes
- **Sans**: Inter, system-ui, sans-serif
- **Serif**: Georgia, serif
- **Mono**: Menlo, Monaco, monospace

### Animaciones Custom
- `float`: Animación de flotación sutil
- `marquee`: Desplazamiento horizontal continuo
- `pulse-slow`: Pulso lento

## Arquitectura de Componentes

### Componentes de Layout
1. **App.jsx**: Componente raíz con routing
2. **AppLayout**: Wrapper condicional (público vs admin)
3. **Navbar**: Navegación principal sticky
4. **HeaderTop**: Barra superior con clima y farmacia
5. **TickerBar**: Barra de noticias en movimiento
6. **Footer**: Pie de página

### Componentes de Contenido
1. **HeroSection**: Sección principal con noticias destacadas
2. **FlashNews**: Carrusel de noticias urgentes
3. **CategoryGrid**: Grid de categorías con preview
4. **MultimediaSection**: Reproductor de videos
5. **AdSection**: Publicidad dinámica
6. **Newsletter**: Formulario de suscripción

### Páginas
1. **Home**: Página principal
2. **Category**: Vista de categoría específica
3. **Post**: Vista individual de noticia
4. **Admin**: Panel de administración completo

## Estado Global (NewsContext)

### Estructura de Datos

#### News Item
```javascript
{
  id: number,
  title: string,
  content: string,
  category: string,
  author: string,
  date: string,
  image: string,
  isHero: boolean,
  isFlash: boolean,
  timeRead: string
}
```

#### Pharmacy
```javascript
{
  id: number,
  name: string,
  address: string,
  phone: string,
  city: string,
  location: { lat: number, lng: number }
}
```

#### Pharmacy Duty
```javascript
{
  date: string, // formato: YYYY-MM-DD
  pharmacyId: number
}
```

#### Score
```javascript
{
  id: number,
  home: string,
  away: string,
  homeScore: number,
  awayScore: number,
  homeLogo: string,
  awayLogo: string,
  time: string,
  date: string
}
```

#### Category
```javascript
{
  id: number,
  name: string,
  color: string,
  bgImage: string
}
```

### Funciones del Context

#### News
- `addNews(item)`: Agregar noticia
- `deleteNews(id)`: Eliminar noticia
- `updateNews(id, item)`: Actualizar noticia

#### Pharmacies
- `addPharmacy(p)`: Agregar farmacia
- `deletePharmacy(id)`: Eliminar farmacia
- `updatePharmacy(id, p)`: Actualizar farmacia
- `setDuty(date, pharmacyId)`: Asignar turno

#### Otras Entidades
Similar patrón CRUD para:
- Tickers
- Categories
- Ads
- Videos
- Scores

## Sistema de Calendario

### Lógica de Renderizado
```javascript
// Calcular primer día del mes
const firstDay = new Date(year, month, 1).getDay();

// Calcular días en el mes
const daysInMonth = new Date(year, month + 1, 0).getDate();

// Generar celdas vacías para alineación
for (let i = 0; i < firstDay; i++) {
  // Celda vacía
}

// Generar días del mes
for (let day = 1; day <= daysInMonth; day++) {
  // Renderizar día con estados
}
```

### Estados del Calendario
- **isSelected**: Día actualmente seleccionado
- **hasAssignment**: Día con farmacia asignada
- **isToday**: Día actual

### Navegación
- Botones prev/next modifican `currentMonth`
- Click en día actualiza `displayDate`
- Formato de fecha: ISO 8601 (YYYY-MM-DD)

## Sistema de Modales

### Patrón de Implementación
```javascript
// Estado
const [showModal, setShowModal] = useState(false);

// Backdrop + Modal
<AnimatePresence>
  {showModal && (
    <>
      <motion.div 
        onClick={() => setShowModal(false)}
        className="fixed inset-0 z-[110] bg-black/40 backdrop-blur-[2px]"
      />
      <motion.div className="absolute ... z-[120]">
        {/* Contenido del modal */}
      </motion.div>
    </>
  )}
</AnimatePresence>
```

### Z-Index Hierarchy
- Navbar/Header: z-50
- Modals backdrop: z-[110]
- Modals content: z-[120]

## Optimizaciones de Rendimiento

### Lazy Loading
- Imágenes con loading="lazy"
- Componentes code-split por ruta

### Memoización
- Filtros de noticias calculados en render
- Context optimizado para evitar re-renders

### Build Optimizations
- Tree shaking automático con Vite
- Code splitting por rutas
- Minificación de CSS y JS

## Responsive Breakpoints

```javascript
sm: '640px'   // Tablets pequeñas
md: '768px'   // Tablets
lg: '1024px'  // Laptops
xl: '1280px'  // Desktops
2xl: '1536px' // Pantallas grandes
```

### Mobile-First Strategy
- Base styles para móvil
- Modificadores para pantallas mayores
- Navegación adaptativa
- Modales optimizados

## Gestión de Imágenes

### Métodos de Carga
1. **URL Externa**: Directo desde input
2. **PC Upload**: FileReader → base64
3. **Galería**: Selección de imágenes previamente cargadas

### Formato de Almacenamiento
- URLs: String directo
- Uploads: Data URL base64
- Galería: Array de strings

## API de Clima (Mock Data)

### Estructura
```javascript
{
  city: string,
  current: {
    temp: number,
    condition: string,
    humidity: number,
    wind: number
  },
  forecast: [{
    day: string,
    high: number,
    low: number,
    condition: string
  }]
}
```

## Patrones de Diseño Utilizados

### Component Composition
- Componentes pequeños y reutilizables
- Props drilling mínimo gracias a Context
- Separación de lógica y presentación

### State Management
- Context API para estado global
- useState para estado local
- Derivación de estado (computed values)

### Conditional Rendering
- Operador ternario para variaciones
- && para renderizado condicional
- AnimatePresence para transiciones

## Scripts de Desarrollo

### package.json Scripts
```json
{
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview"
}
```

### Comandos Útiles
```bash
# Desarrollo
npm run dev

# Build
npm run build

# Preview build local
npm run preview

# Limpiar cache
rm -rf node_modules .vite dist
npm install
```

## Variables de Entorno

Actualmente no se usan variables de entorno, pero se pueden agregar:

```env
VITE_API_URL=
VITE_WEATHER_API_KEY=
VITE_ANALYTICS_ID=
```

## Git Workflow

### Branch Strategy
- `main`: Producción
- Feature branches según necesidad

### Commit Convention
```
Tipo: Descripción breve

Tipos:
- Feature: Nueva funcionalidad
- Fix: Corrección de bugs
- Design: Cambios de UI/UX
- Mobile: Optimizaciones móvil
- Content: Actualización de contenido
- Docs: Documentación
```

## Deployment (Vercel)

### Configuración
- Framework: Vite
- Build Command: `npm run build`
- Output Directory: `dist`
- Node Version: 18.x

### Variables de Entorno en Vercel
Ninguna requerida actualmente.

## Performance Metrics

### Lighthouse Targets
- Performance: >90
- Accessibility: >95
- Best Practices: >90
- SEO: >90

### Core Web Vitals
- LCP (Largest Contentful Paint): <2.5s
- FID (First Input Delay): <100ms
- CLS (Cumulative Layout Shift): <0.1

## Seguridad

### Consideraciones
- No hay autenticación implementada (admin público)
- XSS prevention via React's escaping
- HTTPS en producción (Vercel)
- No se almacenan datos sensibles

### Próximas Mejoras de Seguridad
- Autenticación con JWT
- Rate limiting
- CORS configurado
- Sanitización de inputs

## Testing (Pendiente)

### Frameworks Sugeridos
- Vitest para unit tests
- React Testing Library
- Playwright para E2E

## Debugging

### React DevTools
- Inspección de componentes
- Profiler para performance
- Context inspection

### Vite DevTools
- HMR debugging
- Build analysis
- Network inspection

## Notas Técnicas Importantes

1. **Fechas**: Siempre en formato ISO (YYYY-MM-DD) para consistencia
2. **IDs**: Generados con `Date.now()` (temporal, cambiar a UUID en producción)
3. **Imágenes**: Base64 puede causar problemas de tamaño, considerar CDN
4. **Estado**: Actualmente en memoria, se pierde al recargar
5. **Timezone**: Asume timezone local del usuario

## Recursos y Referencias

- [React Docs](https://react.dev)
- [Vite Docs](https://vitejs.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Framer Motion](https://www.framer.com/motion/)
- [Lucide Icons](https://lucide.dev)

---

Ultima actualización: 07/01/2026 - v4.5 - Fix API Galería y Optimización de Imágenes
