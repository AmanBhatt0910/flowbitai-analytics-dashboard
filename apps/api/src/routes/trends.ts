import { Router, Request, Response } from 'express';
import { prisma } from '../index';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const invoices = await prisma.invoice.findMany({
      select: {
        invoiceDate: true,
        total: true,
      },
      orderBy: {
        invoiceDate: 'asc',
      },
    });

    // Group by month
    const monthlyData: { [key: string]: { count: number; total: number } } = {};

    invoices.forEach((invoice) => {
      const monthKey = `${invoice.invoiceDate.getFullYear()}-${String(
        invoice.invoiceDate.getMonth() + 1
      ).padStart(2, '0')}`;

      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { count: 0, total: 0 };
      }

      monthlyData[monthKey].count += 1;
      monthlyData[monthKey].total += Number(invoice.total);
    });

    const result = Object.entries(monthlyData).map(([month, data]) => ({
      month,
      count: data.count,
      value: data.total,
    }));

    res.json(result);
  } catch (error) {
    console.error('Error fetching invoice trends:', error);
    res.status(500).json({ error: 'Failed to fetch invoice trends' });
  }
});

export default router;