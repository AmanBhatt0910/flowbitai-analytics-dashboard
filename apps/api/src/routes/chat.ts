import { Router, Request, Response } from 'express';
import axios from 'axios';

const router = Router();

router.post('/', async (req: Request, res: Response) => {
  try {
    const { query } = req.body;

    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    const vannaUrl = process.env.VANNA_API_BASE_URL || 'http://localhost:8000';

    // Forward request to Vanna AI
    const response = await axios.post(`${vannaUrl}/ask`, {
      question: query,
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error communicating with Vanna AI:', error);
    res.status(500).json({ error: 'Failed to process chat query' });
  }
});

export default router;