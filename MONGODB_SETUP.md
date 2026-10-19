# Sugar & Stones — MongoDB frontend setup

This frontend no longer uses MockAPI.io.

Flow:
React + Vite -> Axios -> Node/Express -> Mongoose -> MongoDB Atlas

## 1. Backend

Start the backend first:

```bash
cd ../backend
npm install
npm run dev
```

The backend should run at:

http://localhost:5000

## 2. Frontend

Create `.env` from `.env.example`:

```env
VITE_API_URL=http://localhost:5000/api
```

Then:

```bash
npm install
npm run dev
```

## 3. Important

The backend must have the updated Product model that supports:
name, code, collection, category, price, description, material, care,
availability, featured, images, and inStock.

The backend must also support:
- POST /api/auth/signup
- POST /api/auth/login
- GET /api/auth/me
- GET/POST/PUT/DELETE /api/products
- POST/GET /api/orders

The frontend no longer stores passwords or orders in localStorage.
The JWT token is stored locally only so Axios can authenticate requests.
