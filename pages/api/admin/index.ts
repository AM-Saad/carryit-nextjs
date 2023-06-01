import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/lib/prisma'
import { refineResponse } from 'shared/helpers/refineResponse';
import { Status } from '@/shared/modals/Response';
import { Token, authMiddleware } from '@/middleware/auth';
export default authMiddleware(async (req: NextApiRequest, res: NextApiResponse, token: Token) => {
    if (req.method !== 'GET') return res.status(404).json(refineResponse(Status.METHOD_NOT_ALLOWED, 'Method not allowed'));
    if (req.method == 'GET') {
        try {
            const admin = await prisma.admin.findFirst({ where: { id: token.adminId } });
            if (!admin) return res.status(404).json(refineResponse(Status.DATA_NOT_FOUND, 'Admin not found'));

            return res.status(200).json(refineResponse(Status.SUCCESS, 'Admin fetched successfully', admin));
        } catch (error: any) {
            return res.status(500).json(refineResponse(Status.UNEXPECTED_ERROR, error.message));
        }
    }


})  