# RSCOE Local 🎓📍

**RSCOE Local** is a modern, responsive hyperlocal discovery platform prototype built for students and residents around **JSPM Rajarshi Shahu College of Engineering (RSCOE), Tathwade, Pune, Maharashtra**.

---

## 🌟 Key Features

1. **Hyperlocal Campus Search**:
   - Fast keyword and category search (e.g., *"salon"*, *"mess"*, *"cheap food"*, *"medical"*, *"xerox"*, *"pg"*).
   - Centered around JSPM RSCOE Campus Gate with walking distance indicators.

2. **Interactive Map (No API Key Required)**:
   - Built with **Leaflet** and free **CartoDB Voyager / OpenStreetMap** tiles.
   - Custom category SVG pin markers (Food, Mess, Salon, PG, Medical, Stationery, Xerox, Laundry).
   - Landmark pin for JSPM RSCOE Campus Gate.
   - Interactive popups with card previews and "View Details" trigger.

3. **Student Affordability Engine**:
   - Budget tier labeling: `₹ Budget Friendly`, `₹₹ Moderate`, `₹₹₹ Premium`.
   - 1-click affordability quick chips:
     - *Food under ₹50*
     - *Mess under ₹3,000/month*
     - *Salon under ₹150*

4. **Student Verified Badging**:
   - Distinctive `✓ Student Verified` badge with physical audit timestamp (*Last verified: October 2026*).
   - Real menus and student perks (e.g., *10% off with RSCOE ID card*, *WhatsApp PDF printing*).

5. **Detailed Place Modal**:
   - High-resolution photo gallery carousel.
   - Verified services & pricing breakdown (e.g., Haircut ₹100, B&W print ₹1.5/page, Unlimited Mess ₹2,800/mo).
   - Student reviews and insider tips.
   - One-tap actions: **Get Directions**, **Call Business**, **Share**, **Suggest Update**.

6. **Walking Directions**:
   - Turn-by-turn route breakdown starting from RSCOE Main Gate.
   - Direct link to Google Maps Walking Navigation.

7. **Add / Suggest a Place**:
   - Student contribution modal that updates local listings in real-time.
   - Verification queue simulation.

8. **Admin Desk Concept**:
   - Conceptual dashboard for the student council / campus audit team.
   - Live metrics, place management table, instant verification toggle, and edit/delete capabilities.

9. **RSCOE AI Campus Assistant (Simulated)**:
   - Floating conversational widget at bottom-right.
   - Grounded strictly in the local verified database without hallucinating unverified shops or prices.
   - Pre-configured with student query prompts.

---

## 🏗️ Architecture Blueprint

```text
CURRENT PROTOTYPE (MVP):
React 19 + TypeScript + Tailwind CSS v4 + Leaflet (OSM/CartoDB)
      ↓
In-Memory Verified Places Catalog (src/data/placesData.ts)
      ↓
Deterministic Grounded Assistant Matcher (src/components/ChatAssistant.tsx)

FUTURE EXTENSION:
Frontend (React SPA / PWA)
      ↓ REST / GraphQL
Backend API (FastAPI / Node.js)
      ↓ Row Level Security
PostgreSQL / Supabase (with pgvector embeddings)
      ↓ Geolocation & Polyline
Mapbox / Leaflet Routing + Grounded Gemini 2.5 Flash LLM
```

---

## 🚀 Running the Project Locally

```bash
# 1. Install dependencies
npm install

# 2. Run Vite dev server
npm run dev

# 3. Build for production
npm run build
```

Dev Server runs on: `http://localhost:5173/`

---

## 📍 Coordinates
- **JSPM RSCOE Campus Gate**: `18.6186° N, 73.7554° E`, Tathwade, Pune.
