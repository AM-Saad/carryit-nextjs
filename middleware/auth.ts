import { refineResponse } from '@/shared/helpers/refineResponse';
import { Status } from '@/shared/modals/Response';
import jwt from 'jsonwebtoken';
import type { NextApiRequest, NextApiResponse } from 'next';
export interface Token {
  managerId: string;
  companyId?: string;
  driverId?: string;
  isAdmin: boolean;
  isDriver: boolean;
  isSuper: boolean;
}


export const authMiddleware = (handler: (req: NextApiRequest, res: NextApiResponse, token: Token,) => Promise<void>) => async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json(refineResponse(Status.TOKEN_NOT_FOUND, 'Unauthorized'));
    }

    const token = authHeader.split(' ')[1];
    if (!token || token === 'null' || token === 'undefined') {
      return res.status(401).json(refineResponse(Status.TOKEN_NOT_FOUND, 'Token expired'));
    }
    const decoded = jwt.verify(token, process.env.NEXT_PUBLIC_JWT_SECRET!) as any;
    if (decoded === jwt.TokenExpiredError) {
      return res.status(401).json(refineResponse(Status.TOKEN_NOT_FOUND, 'Unauthorized'));
    }
    return handler(req, res,
      {
        managerId: decoded.managerId,
        companyId: decoded.companyId,
        driverId: decoded.driverId || null, isAdmin: decoded.isAdmin,
        isDriver: decoded.isDriver,
        isSuper: decoded.isSuper
      });
  } catch (error) {
    console.error(error);
    return res.status(401).json(refineResponse(Status.TOKEN_NOT_FOUND, 'Unauthorized..'));
  }
};