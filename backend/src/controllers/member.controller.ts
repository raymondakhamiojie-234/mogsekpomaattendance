import { Request, Response } from 'express';
import prisma from '../config/prisma';

export const createMember = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const newMember = await prisma.member.create({
      data,
    });
    res.status(201).json(newMember);
  } catch (error) {
    console.error('Error creating member:', error);
    res.status(500).json({ message: 'Error creating member' });
  }
};

export const getMembers = async (req: Request, res: Response) => {
  try {
    const members = await prisma.member.findMany({
      include: {
        parent: true,
      },
    });
    res.json(members);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching members' });
  }
};

export const getMemberById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const member = await prisma.member.findUnique({
      where: { id },
      include: {
        parent: true,
        children: true,
        attendances: { include: { service: true } },
        tithes: true,
      },
    });
    if (!member) return res.status(404).json({ message: 'Member not found' });
    res.json(member);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching member' });
  }
};

export const updateMember = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const data = req.body;
    const updatedMember = await prisma.member.update({
      where: { id },
      data,
    });
    res.json(updatedMember);
  } catch (error) {
    res.status(500).json({ message: 'Error updating member' });
  }
};

export const deleteMember = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    await prisma.member.delete({
      where: { id },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Error deleting member' });
  }
};

export const getHierarchy = async (req: Request, res: Response) => {
  try {
    const members = await prisma.member.findMany();
    res.json(members);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching hierarchy' });
  }
};

export const transferMember = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { newParentId } = req.body;

    const updatedMember = await prisma.member.update({
      where: { id },
      data: {
        parentId: newParentId || null,
      },
    });

    res.json(updatedMember);
  } catch (error) {
    console.error('Error transferring member:', error);
    res.status(500).json({ message: 'Error transferring member' });
  }
};
