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
    const { serviceId, serviceName, date, memberId, status } = req.body;
    const adminId = (req as any).user.id;
    
    let activeServiceId = serviceId;
    
    // If no serviceId provided, find or create the service by name and date
    if (!activeServiceId && serviceName && date) {
      const parsedDate = new Date(date);
      // Start of day and end of day to match the date regardless of time
      const startOfDay = new Date(parsedDate.setHours(0, 0, 0, 0));
      const endOfDay = new Date(parsedDate.setHours(23, 59, 59, 999));
      
      let service = await prisma.service.findFirst({
        where: {
          name: serviceName,
          date: {
            gte: startOfDay,
            lte: endOfDay,
          }
        }
      });
      
      if (!service) {
        service = await prisma.service.create({
          data: {
            name: serviceName,
            date: new Date(date),
          }
        });
      }
      
      activeServiceId = service.id;
    }
    
    if (!activeServiceId) {
      return res.status(400).json({ message: 'Service details required' });
    }

    const attendance = await prisma.attendance.upsert({
      where: {
        memberId_serviceId: {
          memberId,
          serviceId: activeServiceId,
        }
      },
      update: { status, markedBy: adminId },
      create: {
        serviceId: activeServiceId,
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
    const serviceId = req.params.serviceId as string;
    const { serviceName, date } = req.query;

    let targetServiceId = serviceId;

    if (!targetServiceId && serviceName && date) {
      const parsedDate = new Date(date as string);
      const startOfDay = new Date(parsedDate.setHours(0, 0, 0, 0));
      const endOfDay = new Date(parsedDate.setHours(23, 59, 59, 999));

      const service = await prisma.service.findFirst({
        where: {
          name: serviceName as string,
          date: {
            gte: startOfDay,
            lte: endOfDay,
          }
        }
      });

      if (!service) {
        return res.json([]);
      }
      targetServiceId = service.id;
    }

    if (!targetServiceId) {
      return res.status(400).json({ message: 'Service details required' });
    }

    const attendances = await prisma.attendance.findMany({
      where: { serviceId: targetServiceId },
      include: { member: true }
    });
    res.json(attendances);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching attendance' });
  }
};
