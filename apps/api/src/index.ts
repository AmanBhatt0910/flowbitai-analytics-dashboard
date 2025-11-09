import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import statsRouter from './routes/stats';
import invoicesRouter from './routes/invoices';
import vendorsRouter from './routes/vendors';
import trendsRouter from './routes/trends';
import chatRouter from './routes/chat';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/stats', statsRouter);
app.use('/api/invoices', invoicesRouter);
app.use('/api/vendors', vendorsRouter);
app.use('/api/invoice-trends', trendsRouter);
app.use('/api/chat-with-data', chatRouter);

// Error handling
app.use((err: Error, req: Request, res: Response, next: any) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

export { prisma };