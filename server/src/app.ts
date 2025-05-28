import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db';
import authRoutes from './routes/authRoutes';
import vendorRoutes from './routes/vendorRoutes';
import deliveryRoutes from './routes/deliveryRoutes';


dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.use('/api', authRoutes);
app.use('/api/vendor', vendorRoutes);
app.use('/api/delivery', deliveryRoutes);

export default app;
