import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'
import { refineResponse } from 'shared/helpers/refineResponse';
import { Status } from '@/shared/modals/Response';
import { authMiddleware } from '@/middleware/auth';
export default authMiddleware(async (req: NextApiRequest, res: NextApiResponse, id: string) => {
    console.log(id)
    try {
        const admin = await prisma.admin.findFirst({ where: { id: id } });
        if (!admin) return res.status(404).json(refineResponse(Status.DATA_NOT_FOUND, 'Admin not found'));

        return res.status(200).json(refineResponse(Status.SUCCESS, 'Admin fetched successfully', admin));
    } catch (error: any) {
        return res.status(500).json(refineResponse(Status.UNEXPECTED_ERROR, error.message));
    }
})  