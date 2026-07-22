import { Request, Response } from 'express';
import prisma from '../config/prisma';

export const getFinances = async (req: Request, res: Response) => {
  try {
    const transactions = await prisma.tithe.findMany({
      orderBy: { date: 'desc' },
      include: { member: true },
      take: 100, // Limit to recent 100
    });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching financial records' });
  }
};

export const createFinance = async (req: Request, res: Response) => {
  try {
    const { memberId, amount, method, reference, remarks, type, date } = req.body;
    
    const transaction = await prisma.tithe.create({
      data: {
        memberId: memberId || null,
        amount: parseFloat(amount),
        method,
        reference,
        remarks,
        type: type || 'Tithe',
        date: date ? new Date(date) : undefined,
      }
    });
    
    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ message: 'Error creating financial record' });
  }
};
