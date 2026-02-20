# Sydney Events Platform - Project Report

## 1. Project Overview
This project is a **MERN Stack** application designed to aggregate event data from various Sydney sources, primarily the City of Sydney's "What's On" guide. It features an automated scraping engine, a dynamic React frontend with modern animations, and an admin dashboard for managing event listings.

**Key Objectives Achieved:**
*   **Automated Scraping**: Periodically scrapes event data (title, date, venue, image) and detects updates/inactive events.
*   **Database Integration**: Stores structured event data with status tracking (`new`, `imported`, `inactive`).
*   **Reactive Frontend**: Displays events in a highly responsive, animated grid layout.
*   **User Engagement**: "Get Tickets" flow captures user emails and consent before redirecting to the official source.
*   **Admin Dashboard**: Authenticated access (Google OAuth) to review, filter, and import/approve events.

## 2. Technology Stack

### Backend
*   **Node.js & Express**: API server handling REST endpoints.
*   **MongoDB (Local/Atlas)**: Event and user data storage. *Note: Configured for local NeDB for demonstration portability.*
*   **Cheerio & Axios**: High-performance scraping engine for HTML parsing.
*   **Node-Schedule**: Cron jobs for automated nightly scraping updates.

### Frontend
*   **React (Vite)**: Component-based UI logic.
*   **Tailwind CSS**: Utility-first styling for rapid, responsive design.
*   **Framer Motion**: Production-grade animations for layout transitions and interactions.
*   **React Router**: Client-side routing for seamless navigation.

## 3. Architecture & Data Flow

1.  **Scraping Job**: Runs daily or on-demand. Fetches HTML -> Parses Metadata (JSON-LD) -> Upserts to Database.
2.  **API**: Exposes `/api/events` with filtering (city, search, date).
3.  **UI**: Fetches JSON data -> Renders Skeleton Loaders -> Animates Cards into view.
4.  **Admin**: Authenticated users access `/dashboard` to manage event lifecycle status.

## 4. Key Features Implementation

### A. The Scraper
The scraper targets structured metadata on public event pages. It intelligently compares scraped data with existing records to tag events as `updated` if the venue or time changes, or `inactive` if the event date has passed.

### B. "Get Tickets" Capture
To build a subscriber base, the "Get Tickets" button triggers a modal flow. The user's email and consent are saved to the `Subscription` collection before the user is seamlessly redirected to the original ticketing provider.

### C. Admin Dashboard
A protected route that offers a dense table view for power users.
*   **Live Search**: Filters by keyword instantly.
*   **Status Workflow**: One-click actions to move events from `New` -> `Imported`.
*   **Preview**: Slide-over panel to inspect full event details without leaving the context.

## 5. Deployment & Setup
To run locally:
1.  Navigate to `server` -> `npm install` -> `npm start` (Runs API & Scraper).
2.  Navigate to `client` -> `npm install` -> `npm run dev` (Runs Frontend).
3.  Access via `http://localhost:5173`.

---
*Created by [Your Name]*
