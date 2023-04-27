import jwt from 'jsonwebtoken';
import type { NextApiRequest, NextApiResponse } from 'next';

export interface Token {
  adminId: string;
  companyId?: string;
  driverId?: string;
  isAdmin: boolean;
  isDriver: boolean;
}


export const authMiddleware = (handler: (req: NextApiRequest, res: NextApiResponse, token: Token,) => Promise<void>) => async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.NEXT_PUBLIC_JWT_SECRET!) as any
    return handler(req, res, { adminId: decoded.adminId, companyId: decoded.companyId,  driverId: decoded.driverId || null , isAdmin: decoded.isAdmin, isDriver: decoded.isDriver});
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: 'Unauthorized' });
  }
};