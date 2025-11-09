import { Router, Request, Response } from 'express';
import { prisma } from '../index';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const currentYear = new Date().getFullYear();
    const yearStart = new Date(currentYear, 0, 1);

    // Total Spend YTD
    const totalSpend = await prisma.invoice.aggregate({
      where: {
        invoiceDate: {
          gte: yearStart,
        },
      },
      _sum: {
        total: true,
      },
    });

    // Total Invoices Processed
    const totalInvoices = await prisma.invoice.count();

    // Documents Uploaded (assuming each invoice is a document)
    const documentsUploaded = totalInvoices;

    // Average Invoice Value
    const avgInvoice = await prisma.invoice.aggregate({
      _avg: {
        total: true,
      },
    });

    res.json({
      totalSpend: totalSpend._sum.total || 0,
      totalInvoices,
      documentsUploaded,
      averageInvoiceValue: avgInvoice._avg.total || 0,
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

export default router;