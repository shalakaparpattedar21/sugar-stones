# Sugar & Stones MERN Backend

## Run

Create `.env`:

```env
PORT=5000
MONGO_URI=YOUR_MONGODB_ATLAS_URL
JWT_SECRET=YOUR_SECRET
```

Then:

```bash
npm install
npm run seed
npm run dev
```

The seed command imports the existing Sugar & Stones catalogue into MongoDB.

Frontend API base:

`http://localhost:5000/api`
