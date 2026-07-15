import { Request, Response } from 'express';
import prisma from '../config/prisma';

export const createService = async (req: Request, res: Response) => {
  try {
    const { name, date } = req.body;
    const service = await prisma.service.create({
      data: { name, date: new Date(date) },
    });
    res.status(201).json(service);
  } catch (error) {
    res.status(500).json({ message: 'Error creating service' });
  }
};

export const getServices = async (req: Request, res: Response) => {
  try {
    const services = await prisma.service.findMany({
      orderBy: { date: 'desc' }
    });
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching services' });
  }
};

export const markAttendance = async (req: Request, res: Response) => {
  try {
    const { serviceId, memberId, status } = req.body;
    const adminId = (req as any).user.id;
    
    const attendance = await prisma.attendance.upsert({
      where: {
        memberId_serviceId: {
          memberId,
          serviceId,
        }
      },
      update: { status, markedBy: adminId },
      create: {
        serviceId,
        memberId,
        status,
        markedBy: adminId,
      }
    });
    
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: 'Error marking attendance' });
  }
};

export const getAttendanceForService = async (req: Request, res: Response) => {
  try {
    const { serviceId } = req.params;
    const attendances = await prisma.attendance.findMany({
      where: { serviceId },
      include: { member: true }
    });
    res.json(attendances);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching attendance' });
  }
};
