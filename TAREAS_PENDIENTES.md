# Tareas Pendientes - Diario Compromiso

## � Estado Actual
Todo limpio. Las correcciones de UI han sido aplicadas.

## ✅ Completado 05/01/2026

- ✅ Fix: Modal del clima centrado correctamente (Implementación definitiva con React Portal)
- ✅ Fix: Título "Flash Editorial" oculto en móvil/tablet (Breakpoint actualizado a lg:flex)
- ✅ Feat: Actualización formato fecha "Lunes, 5 de ene de 2026"
- ✅ Feat: Botón Farmacia mejorado (Muestra nombre de farmacia y texto "FARMACIAS DE TURNO")
- ✅ Feat: Nueva estructura de menús con subcategorías (Locales/Correo, Actualidad/Interés General/Cocina/Tecnología)

## ✅ Completado (Anterior)

- ✅ Calendario visual de farmacias con navegación de meses
- ✅ Sistema de programación automática de farmacias
- ✅ Modal de clima con pronóstico de 3 días
- ✅ Reorganización del header (Navbar primero)
- ✅ Nombre "Diario Compromiso" visible en móvil
- ✅ Optimización de HeaderTop para móvil
- ✅ Documentación completa (PROJECT_CONTEXT.md y TECHNICAL_INFO.md)
- ✅ Botón del clima restaurado a posición correcta

## 📝 Notas Técnicas

### Soluciones Implementadas
- **Modal Clima**: Se implementó `createPortal` de React para renderizar el modal directamente en el `body`. Esto elimina cualquier conflicto de stacking context, z-index o overflow con el Header, asegurando un centrado perfecto en todas las pantallas.
- **Flash News**: Se elevó el breakpoint de ocultamiento a `lg` (1024px) para asegurar que en tablets y móviles grandes no aparezca el encabezado redundante.


## 🚀 Nuevos Requerimientos (05/01/2026)

### 1. Contenido de las Notas (Post.jsx)
- [x] Quitar autor y tiempo de lectura.
- [x] Mostrar fecha de publicación.
- [x] Asegurar imagen principal e imágenes internas.
- [x] Agregar Data Fiscal al pie de la nota.

### 2. Portada (Home.jsx)
- [x] Mostrar tapa del diario con últimas 10 notas destacadas.
- [x] Flash News: Cargar últimas 15 noticias automáticamente.

### 3. Publicidades
- [x] Cargar 4 publicidades en portada (Panel ADMIN).
- [x] Editables y con link externo.

### 4. Comentarios
- [x] Campos: Nombre y Email.
- [x] Moderación obligatoria (No publicar automático).

### 5. Secciones
- [x] Ocultar/Desactivar "Deportes" y "Resultados deportivos".

## 📦 Estado del Repositorio


- **Última versión**: v4.2 (UI Fixes)
- **Branch**: main
- **Estado**: Listo para commit y deploy

---

**Fecha**: 05/01/2026 - 00:30 AM
**Versión**: v4.2
