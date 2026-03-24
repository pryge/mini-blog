import { Request, Response, NextFunction } from 'express';
import { prisma } from '../prisma';

export const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || user.role !== 'ADMIN') {
      return res.status(403).json({ error: "Forbidden. Admin access required." });
    }

    next();
  } catch (error) {
    res.status(500).json({ error: "Error checking admin role" });
  }
};
