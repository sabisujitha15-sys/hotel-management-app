# Hotel List Page - Full Stack CRUD App

Stack: **React + Redux Toolkit** (frontend) | **Node.js + Express + PostgreSQL** (backend, native SQL, no ORM)

## Folder structure
```
hotel-app/
  backend/     -> Node/Express API + PostgreSQL
  frontend/    -> React + Redux SPA
```

## 1. Backend setup

```bash
cd backend
npm install
cp .env.example .env      # edit DB credentials
```

Create the database and run the schema:
```bash
createdb hotel_db
psql -d hotel_db -f schema.sql
```

Start the server:
```bash
npm run dev      # nodemon (or) npm start
```
API runs on `http://localhost:5000`. Uploaded images are served from `http://localhost:5000/uploads/<filename>`.

### API Endpoints
| Method | Endpoint          | Description                              |
|--------|-------------------|-------------------------------------------|
| POST   | /api/hotels       | Create hotel (multipart/form-data, field `image`) |
| GET    | /api/hotels       | List hotels — query: `title`, `minPrice`, `maxPrice`, `offset`, `limit` |
| GET    | /api/hotels/:id   | Get one hotel                             |
| PUT    | /api/hotels/:id   | Update hotel (multipart/form-data)        |
| DELETE | /api/hotels/:id   | Delete hotel + its image file             |

## 2. Frontend setup

```bash
cd frontend
npm install
cp .env.example .env      # REACT_APP_API_URL=http://localhost:5000/api
npm start
```
Runs on `http://localhost:3000`.

## Features implemented
- Reusable `HotelForm` component used for both Add and Edit, with client + server side validation
- Image upload with live preview
- Card-based list layout (not a table) with image, title, price, description snippet
- Search by title + filter by price range
- Pagination (offset/limit) driven by the backend
- Edit & Delete buttons on each card, success toast on delete
- Detail page with full info + embedded map (OpenStreetMap) plotted from latitude/longitude
- SEO: `react-helmet-async` for per-page dynamic `<title>`/meta tags, `alt` text on every image
- Single Page Application via `react-router-dom`
- Redux Toolkit slice (`hotelsSlice`) manages all hotel state/async thunks
- Native SQL queries only (`pg` library, no ORM), parameterized to prevent SQL injection

## Notes
- The map on the detail page uses an OpenStreetMap embed built from the stored lat/lng (no API key needed). Swap in Google Maps JS API if preferred.
- Placeholder image is shown if a hotel has no uploaded image.
- Styling is a warm, resort-themed palette (deep green + amber) inspired by the reference designs.
