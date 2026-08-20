<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Admin Geolocation Dashboard

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
4. In a second terminal, start the API:
   `npm run backend`

## Deploy to Vercel

The Vite dashboard and Express API are deployed together. Vercel uses `api/index.ts` for the `/api` routes.

1. Import this repository into Vercel.
2. Set `GEMINI_API_KEY` in the Vercel project environment variables.
3. Deploy with the default Vite settings. The build command is `npm run build`.

The API uses the included SQLite database for this simulation. Vercel filesystem changes are temporary, so use a persistent database before treating this as production telemetry.
