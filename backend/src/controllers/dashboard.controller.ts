import { Request, Response } from 'express';
import prisma from '../config/prisma';

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const totalSouls = await prisma.member.count();
    const totalWorkers = await prisma.member.count({ where: { isWorker: true } });
    const totalLeaders = await prisma.member.count({
      where: {
        position: {
          in: ['Major General', 'Pastor', 'Coordinator', 'S-Man', 'Leader']
        }
      }
    });

    const inactiveMembers = await prisma.member.count({ where: { status: 'Inactive' } });

    // Tithes sum (simple implementation)
    const tithes = await prisma.tithe.aggregate({
      _sum: { amount: true }
    });

    res.json({
      totalSouls,
      totalWorkers,
      totalLeaders,
      inactiveMembers,
      totalTithes: tithes._sum.amount || 0
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching dashboard stats' });
  }
};
