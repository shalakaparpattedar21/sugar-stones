# Sugar & Stones — MERN E-Commerce Frontend

React + Vite frontend for the Sugar & Stones jewellery e-commerce mini-project.

## Run

```bash
npm install
npm run dev
```

## Online Mock API + Axios

The frontend now uses **Axios with MockAPI.io**, not `axios-mock-adapter`.

Current MockAPI base URL:

`https://6ac4f76a54a61668c5f69c5c.mockapi.io`

Resources:

- `GET /products` — product catalogue
- `GET /products/:id` — product details
- `POST /orders` — create a mock order

### First run

The `products` resource is initially empty. On the first product request, the frontend checks `GET /products`. If it is empty, it automatically sends the existing Sugar & Stones catalogue to MockAPI using Axios `POST /products`, then loads the catalogue from the online API.

This means you can demonstrate the complete flow in the browser:

`React → Axios → Internet → MockAPI.io → JSON response → React UI`

### Orders

When a customer places an order, checkout sends a real Axios `POST /orders`. The created order appears in your MockAPI.io `orders` resource.

### Login

Login/sign-up remains a frontend demo using localStorage because the current MockAPI project uses its two resources for `products` and `orders`. This keeps the account UI functional without pretending that an `auth` resource exists.

## Environment variable (optional)

Copy `.env.example` to `.env` if you want to override the API URL.

## Main features

- Home / Shop / Product details
- Search, collection/category filtering and sorting
- Add to cart, quantity controls and Buy Now
- Wishlist
- Login / Sign-up / Account
- Checkout, promo code and mock payment selection
- Online Axios + MockAPI.io product and order APIs
- Order confirmation and order tracking
- Netlify SPA redirect


## Razorpay Test Mode
Choose UPI at checkout to open Razorpay Test Mode. Configure `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` only in the backend `.env`; never expose the secret in Vite variables. See `../backend/RAZORPAY_TEST_MODE.md`.
