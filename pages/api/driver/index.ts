import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'
import { refineResponse } from 'shared/helpers/refineResponse';
import { Status } from '@/shared/modals/Response';
import { Token, authMiddleware } from '@/middleware/auth';
export default authMiddleware(async (req: NextApiRequest, res: NextApiResponse, token: Token) => {
    console.log(token)
    try {
        const driver = await prisma.driver.findFirst({ where: { id: token.driverId } });
        if (!driver) return res.status(404).json(refineResponse(Status.DATA_NOT_FOUND, 'Driver not found'));

        return res.status(200).json(refineResponse(Status.SUCCESS, 'Driver fetched successfully', driver));
    } catch (error: any) {
        return res.status(500).json(refineResponse(Status.UNEXPECTED_ERROR, error.message));
    }
})  