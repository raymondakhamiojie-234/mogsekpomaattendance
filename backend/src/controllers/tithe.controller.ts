import { Request, Response } from 'express';
import prisma from '../config/prisma';

export const recordTithe = async (req: Request, res: Response) => {
  try {
    const { memberId, amount, date, method, reference, remarks } = req.body;
    const tithe = await prisma.tithe.create({
      data: {
        memberId,
        amount: parseFloat(amount),
        date: date ? new Date(date) : undefined,
        method,
        reference,
        remarks
      }
    });
    res.status(201).json(tithe);
  } catch (error) {
    res.status(500).json({ message: 'Error recording tithe' });
  }
};

export const getTithes = async (req: Request, res: Response) => {
  try {
    const tithes = await prisma.tithe.findMany({
      include: { member: true },
      orderBy: { date: 'desc' }
    });
    res.json(tithes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tithes' });
  }
};
