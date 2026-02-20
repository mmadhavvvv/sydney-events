# 🌆 Sydney Events Platform

[![MERN Stack](https://img.shields.io/badge/Stack-MERN-blue.svg)](https://www.mongodb.com/mern-stack)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Vite](https://img.shields.io/badge/Frontend-Vite%20%2B%20React-646CFF.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20CSS-38B2AC.svg)](https://tailwindcss.com/)

A premium, end-to-end MERN application that automatically scrapes, manages, and displays events across Sydney, Australia. Built with a focus on minimalistic aesthetic and smooth user experience.

---

## ✨ Features

### 🔍 Automated Event Scraping
- **Smart Scraper**: Automatically pulls data from multiple Sydney event sources.
- **Auto-Updates**: Automatically detects new events, updates changed details, and marks past events as inactive.
- **Metadata Extraction**: Uses JSON-LD and Cheerio to extract rich data including dates, venues, and descriptions.

### 🎨 Beautiful UI/UX
- **Minimalist Design**: Clean, modern interface built with Tailwind CSS and Framer Motion.
- **Premium Animations**: Smooth stagger effects, spring physics, and loading skeletons.
- **Performance Optimized**: Carefully tuned for 60fps scrolling and fast load times.

### 🔐 Admin Dashboard
- **Google OAuth**: Secure login for platform administrators.
- **Management Suite**: Filter events by city, keyword, or status.
- **Event Lifecycle**: Review "New" events and one-click "Import" to the public platform.

### 🎫 Interactive Ticketing
- **Email Capture**: Collects user consent and email before redirecting to ticket providers.
- **GDPR Ready**: Includes explicit opt-in checkboxes for data collection.

---

## 🚀 Tech Stack

**Frontend:**
- React 18 (Vite)
- Tailwind CSS (Styling)
- Framer Motion (Animations)
- Lucide React (Icons)
- Axios (API Calls)

**Backend:**
- Node.js & Express
- MongoDB / NeDB (Local Mode for portability)
- Cheerio (Scraping)
- Node-Schedule (Automation)
- Google OAuth 2.0 (Auth)

---

## 🛠️ Installation & Setup

### 1. Clone the repository
```bash
git clone https://github.com/mmadhavvvv/sydney-events.git
cd sydney-events
```

### 2. Backend Setup
```bash
cd server
npm install
```
Create a `.env` file in the `server` directory:
```env
PORT=5000
GOOGLE_CLIENT_ID=your_google_client_id
# Optional: MongoDB Atlas URI (otherwise defaults to local NeDB)
# MONGO_URI=your_mongodb_uri 
```
Start the server:
```bash
npm start
```

### 3. Frontend Setup
```bash
cd ../client
npm install
```
Create a `.env` file in the `client` directory:
```env
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```
Start the frontend:
```bash
npm run dev
```

---

## 📸 Screenshots

*(Add your beautiful screenshots here)*

---

## 📝 License
Distributed under the MIT License. See `LICENSE` for more information.

---
Built with ❤️ for Sydney by [mmadhavvvv](https://github.com/mmadhavvvv)
