import dotenv from 'dotenv';
dotenv.config();


import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';

// Routes
import adminRoutes from './routes/adminroutes.js';
import cartRoutes from './routes/cartroutes.js';
import favoriteRoutes from './routes/favoriteRoutes.js';
import foodRoutes from './routes/foodroutes.js';
import orderRoutes from './routes/orderroutes.js';
import reviewRoutes from './routes/reviewroutes.js';
import userRoutes from './routes/userRoutes.js';
import mockTransactionRoute from './routes/mockTransactionRoutes.js';
import addressRoutes from './routes/addressRoutes.js';
const app = express();

// ======= MIDDLEWARE ======= //
app.use(cors({
  origin: 'http://localhost:3000', // Frontend URL
  credentials: true,
}));
app.use(express.json()); 
app.use(cookieParser()); 

// ======= ROUTES ======= //
app.use('/api/admin', adminRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/favorite', favoriteRoutes);
app.use('/api/foods', foodRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/users', userRoutes);
app.use('/api/user/addresses', addressRoutes);
app.use('/api/transactions',mockTransactionRoute);

app.get('/', (req, res) => {
  res.send(' Food Delivery API is running...');
});

// ======= CONNECT TO DB AND START SERVER ======= //
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ MongoDB connected');
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
})
.catch((err) => {
  console.error('❌ MongoDB connection failed:', err.message);
});

















