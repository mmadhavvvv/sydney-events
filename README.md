# Sydney Events Scraper & Dashboard

This is a MERN stack application that scrapes events from "What's On Sydney", displays them in a beautiful UI, and provides an admin dashboard with Google OAuth.

## Prerequisites

- Node.js
- MongoDB (Local or Atlas)
- Google Cloud Console Project (for OAuth Client ID)

## Setup

### 1. Server

cd server
npm install
# Create a .env file with your Google Client ID
# GOOGLE_CLIENT_ID=your_client_id_here
npm start

The server runs on http://localhost:5000.
It will initially scrape events upon startup.

### 2. Client

cd client
npm install
# Update src/main.jsx with your Google Client ID
npm run dev

The client runs on http://localhost:5173.

## Features

- **Automated Scraping**: Runs daily or on startup.
- **Event Listing**: Modern, responsive grid layout.
- **Event Details**: Modal for email subscription.
- **Admin Dashboard**: Google Login required. Import events, view status, filter.
- **Status Tracking**: New, Updated, Inactive, Imported.

## Notes

- The scraper targets `whatson.cityofsydney.nsw.gov.au` using `cheerio`.
- Images are extracted from OpenGraph tags.
- Data is stored in MongoDB.
