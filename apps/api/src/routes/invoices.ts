import { Router, Request, Response } from 'express';
import { prisma } from '../index';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const { search, status, page = '1', limit = '50' } = req.query;

    const where: any = {};

    if (search) {
      where.OR = [
        { invoiceNumber: { contains: search as string, mode: 'insensitive' } },
        { vendor: { name: { contains: search as string, mode: 'insensitive' } } },
      ];
    }

    if (status && status !== 'all') {
      where.status = status;
    }

    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
    const take = parseInt(limit as string);

    const [invoices, total] = await Promise.all([
      prisma.invoice.findMany({
        where,
        include: {
          vendor: {
            select: {
              name: true,
            },
          },
        },
        orderBy: {
          invoiceDate: 'desc',
        },
        skip,
        take,
      }),
      prisma.invoice.count({ where }),
    ]);

    res.json({
      data: invoices,
      pagination: {
        total,
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        totalPages: Math.ceil(total / parseInt(limit as string)),
      },
    });
  } catch (error) {
    console.error('Error fetching invoices:', error);
    res.status(500).json({ error: 'Failed to fetch invoices' });
  }
});

export default router;