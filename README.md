# CarShop Marketplace (Demo)

Full-stack demo marketplace for buying and selling cars. React + TypeScript + Tailwind frontend, Node/Express + MongoDB backend. Image uploads, listings CRUD, makes/models proxy with caching and local JSON fallback.

## Quick start

### Backend

```bash
cd backend
npm install
npm start
```

Server runs on `http://localhost:8000`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

App runs on `http://localhost:5173` (Vite default).

## API

- `POST /api/register` { fullName, email, password }
- `POST /api/login` { email, password }
- `GET /api/cars/makes` → cached proxy with fallback JSON
- `GET /api/cars/models/:make` → cached proxy with fallback JSON
- `POST /api/listings` multipart FormData (fields + images[])
- `GET /api/listings` → list
- `GET /api/listings/:id` → detail

### curl examples

```bash
# Create listing (example without images)
curl -X POST http://localhost:8000/api/listings \
  -F brand=Audi -F model=A3 -F year=2018 -F price=14500

# Upload with image
curl -X POST http://localhost:8000/api/listings \
  -F brand=BMW -F model="3 Series" -F year=2019 \
  -F images[]=@/path/to/image.jpg

# Browse
curl http://localhost:8000/api/listings
```

## Notes

- External APIs (CarAPI) are proxied by the backend; on errors or rate limits the server returns cached or local fallback data located in `backend/data`.
- Uploads are served from `http://localhost:8000/uploads/...`.

"# CarShop-Website" 
