
import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/lib/prisma'
import { refineResponse } from 'shared/helpers/refineResponse';
import { Status } from '@/shared/modals/Response';
import { Token, authMiddleware } from '@/middleware/auth';
export default authMiddleware(async (req: NextApiRequest, res: NextApiResponse, token: Token) => {
    if (req.method !== 'GET') return res.status(405).json(refineResponse(Status.METHOD_NOT_ALLOWED, 'Method not allowed'));

    try {
        const manager = await prisma.manager.findMany({ where: { companyId: token.companyId } });
        // await prisma.branch.deleteMany({})
        // await prisma.vehicle.deleteMany({})
        // await prisma.package.deleteMany({})
        // await prisma.driver.deleteMany({})
        // await prisma.user.deleteMany({})
        

        if (!manager) return res.status(404).json(refineResponse(Status.DATA_NOT_FOUND, 'Manager not found'));

        return res.status(200).json(refineResponse(Status.SUCCESS, 'Manager fetched successfully', manager));
    } catch (error: any) {
        return res.status(500).json(refineResponse(Status.UNEXPECTED_ERROR, error.message));
    }

})