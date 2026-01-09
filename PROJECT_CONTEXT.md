# PROJECT CONTEXT DOCUMENT

## Project Overview
**Name**: Diario Compromiso Digital
**Type**: News Web Application (React/Vite)
**Current Version**: 1.0.0 (January 2026)

## Core Features
1.  **Dynamic News Delivery**: Real-time news consumption with optimized categorization.
2.  **Flash News System**: Automatic high-priority news carousel.
3.  **Community Services**:
    *   **Pharmacy on Duty**: Real-time pharmacy information.
    *   **Weather**: Live weather data.
    *   **Scores**: Live sports scores.
4.  **Admin Panel**: Full Content Management System (CMS) for news, ads, and settings.

## Design Philosophy
*   **"Alive" Interface**: Heavy use of animations (Framer Motion), gradients, and glassmorphism.
*   **Mobile-First**: Fully responsive navigation and layout.
*   **Premium Aesthetic**: Curated typography, spacing, and modern UI tokens.

## Application Structure
*   **Frontend**: React + Vite
*   **Styling**: TailwindCSS
*   **State**: Context API (`NewsContext`)
*   **Routing**: React Router DOM

## Recent Updates (Jan 9, 2026)
*   **Premium Footer Refactor**: Complete redesign based on visual reference. Top section with Logo, vertical divider, and Legal Info (Data Fiscal/IP). Bottom section for Director information and social links.
*   **Global Notification System**: Replaced native browser alerts with custom, premium Toast notifications (framer-motion) accessible via `showToast` in `NewsContext`.
*   **Comments System Fix**: Full integration of backend and frontend. Fixed data mapping (newsId/post_id) and added validation/UX feedback.
*   **Memoria Histórica**: Refined "¿Te Acordás, Dolores?" section on the homepage. Now features a full-width, horizontal layout with enhanced visual effects, glassmorphism icons, and responsive design.

## Recent Updates (Jan 5, 2026)
*   **Navbar Redesign**: Simplified simplified navigation items, removed Admin link to utility bar, optimized for small screens.
*   **News Display**: Removed author/reading time, added official AFIP Data Fiscal, enabled internal content images.
*   **Homepage**: Expanded "Hero" section to 10 items, "Flash News" to 15 items, added dynamic Ad slots.
*   **Comments**: Added comment section with moderation queue.


## Pending Roadmap
*   [ ] Backend integration (Supabase/Firebase) for persistent data.
*   [ ] Auth system for Editors/Admins.
*   [ ] SEO advanced optimization (SSR/ISR consideration).

## Critical Workflows
*   **Adding News**: Admin Panel -> New Post.
*   **Editing Ads**: Admin Panel -> Ads Manager.
*   **Deploy**: Automatic deployment via Vercel on `main` branch push.

---
*This document serves as the high-level context for the AI assistant and developer team.*
