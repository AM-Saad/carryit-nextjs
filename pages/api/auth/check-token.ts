import { refineResponse } from '@/shared/helpers/refineResponse';
import { Status } from '@/shared/modals/Response';
import jwt from 'jsonwebtoken';
import type { NextApiRequest, NextApiResponse } from 'next';
export interface Token {
  adminId: string;
  companyId?: string;
  driverId?: string;
  isAdmin: boolean;
  isDriver: boolean;
}


export default async function handle(req: NextApiRequest, res: NextApiResponse<any>) {
    // check if token is expired
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
        return res.status(200).json(refineResponse(Status.SUCCESS, 'Authorized'));
    }
    catch (error) {
        console.error(error);
        return res.status(401).json(refineResponse(Status.TOKEN_NOT_FOUND, 'Unauthorized..'));
    }
}