import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import dns from 'node:dns';

dns.setServers(['8.8.8.8', '1.1.1.1']);
dotenv.config();

const app = express();

// Hosts like Render/Railway sit behind a proxy; needed for correct client IPs (rate limiting).
app.set('trust proxy', 1);

app.use(helmet());
app.use(cors({ origin: (process.env.FRONTEND_URL || 'http://localhost:5173').replace(/\/$/, '') }));
app.use(express.json({ limit: '100kb' }));

// Slow down password guessing / signup spam.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many attempts. Please try again in a few minutes.' }
});

app.get('/', (req, res) => {
  res.json({ message: 'Sugar & Stones API is running' });
});

app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);

app.use((req, res) => res.status(404).json({ message: 'Route not found' }));

// Malformed JSON bodies etc.
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ message: err.status && err.status < 500 ? err.message : 'Something went wrong' });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 16) {
      throw new Error('JWT_SECRET is missing or too short (use at least 16 random characters)');
    }
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Sugar & Stones API running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Server startup failed:', error.message);
    process.exit(1);
  }
};

startServer();
