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
*   **Backend**: Node.js Express Server (Cloud Run)
*   **Database**: Google Cloud Firestore (NoSQL)
*   **Storage**: Google Cloud Storage (Bucket) for images
*   **Styling**: TailwindCSS
*   **State**: Context API (`NewsContext`)
*   **Routing**: React Router DOM

## Recent Updates (Jan 30, 2026)
*   **Migration to Google Cloud**: Fully migrated from PostgreSQL/Prisma to **Firebase Admin SDK (Firestore)**.
*   **Image Optimization**: Integrated **Google Cloud Storage** for all image uploads (News, Ads, Settings), moving away from Base64 storage in database to improve performance.
*   **Cloud Run (No Docker)**: Configured the app for native Node.js deployment via Google Cloud Buildpacks.
*   **Server Robustness**: Updated `server.js` for production readiness on Cloud Run (Port 8080, health checks).

## Pending Roadmap
*   [ ] SEO advanced optimization (Sitemap generation).
*   [ ] Email notifications for new comments.
*   [ ] Image resizing on upload for further optimization.

## Critical Workflows
*   **Adding News**: Admin Panel -> New Post (Images uploaded to GCS).
*   **Editing Ads**: Admin Panel -> Ads Manager.
*   **Managing Pharmacies**: Admin Panel -> Pharmacies (Duties & List).
*   **Deploy**: Manual or automated deployment to Google Cloud Run using `gcloud run deploy`.

---
*This document serves as the high-level context for the AI assistant and developer team.*
