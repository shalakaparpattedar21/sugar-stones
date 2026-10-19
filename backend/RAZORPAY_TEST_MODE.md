# Razorpay Test Mode Setup

1. In the Razorpay dashboard, switch to **Test Mode**.
2. Create/find the test API keys under Account & Settings / API Keys.
3. Copy the **test Key ID** and **test Key Secret** into `backend/.env`.
4. Never put the Key Secret in the frontend and never commit `.env`.
5. Keep MongoDB connected and start the backend with `npm run dev`.
6. Choose UPI via Razorpay in checkout. Test-mode options depend on what Razorpay enables for your account.
7. Use only Razorpay's official test instructions/cards/UPI test flow. No real money is transferred in Test Mode.

Required backend variables:

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_long_random_secret
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_test_key_secret
FRONTEND_URL=http://localhost:5173
```

## Endpoints

- `POST /api/payments/create-order` creates a Razorpay test order. The server reads product prices from MongoDB.
- `POST /api/payments/verify` verifies the Razorpay signature and captured payment before saving a paid order.
- COD continues to use `POST /api/orders`.

The current integration deliberately does not store a personal UPI ID. Test Mode does not send real money to a UPI ID. Do not mark orders paid based only on a browser callback; this backend verifies the signature and fetches payment status.
