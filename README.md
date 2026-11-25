# Purple Star

## Run locally

1. Configure `backend/.env` with `PORT`, `MONGO_URI`, `JWT_SECRET`, and the Cloudinary credentials used for image uploads.
2. In a terminal, install backend dependencies and start the API:

   ```powershell
   cd backend
   npm install
   npm run dev
   ```

3. In a second terminal, install frontend dependencies and start Vite:

   ```powershell
   cd frontend
   npm install
   npm run dev
   ```

## Add demo products

With MongoDB configured in `backend/.env`, run:

```powershell
cd backend
npm run seed
```

The seed command inserts eight demo products only when the products collection is empty. It does not replace or modify an existing catalog. Product photos are served from Unsplash URLs, so they require an internet connection.

## Portfolio showcase mode

The frontend is a public catalog with a local cart demo. Sign-in, checkout, orders, profile, and admin pages are not exposed in the showcase UI. Backend auth and protected API code remain in the repository as part of the project implementation.
