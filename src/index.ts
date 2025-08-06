import express from 'express';
import type { Application, Request, Response } from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db';
import sampleRoutes from './routes/sample.routes';
import authRoutes from './routes/auth.routes';

dotenv.config();

const app: Application = express();

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'UP', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/samples', sampleRoutes);

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});