import { Router, Request, Response } from 'express';
import { prisma } from '../index';

const router = Router();

router.get('/top10', async (req: Request, res: Response) => {
  try {
    const topVendors = await prisma.invoice.groupBy({
      by: ['vendorId'],
      _sum: {
        total: true,
      },
      orderBy: {
        _sum: {
          total: 'desc',
        },
      },
      take: 10,
    });

    const vendorIds = topVendors.map((v) => v.vendorId);
    const vendors = await prisma.vendor.findMany({
      where: {
        id: {
          in: vendorIds,
        },
      },
    });

    const result = topVendors.map((tv) => {
      const vendor = vendors.find((v) => v.id === tv.vendorId);
      return {
        vendorId: tv.vendorId,
        vendorName: vendor?.name || 'Unknown',
        totalSpend: tv._sum.total || 0,
      };
    });

    res.json(result);
  } catch (error) {
    console.error('Error fetching top vendors:', error);
    res.status(500).json({ error: 'Failed to fetch top vendors' });
  }
});

export default router;