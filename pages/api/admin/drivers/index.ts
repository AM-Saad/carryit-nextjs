import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react';
import prisma from '../../../../lib/prisma'
import { refineResponse } from 'shared/helpers/refineResponse';
import { Status } from '@/shared/modals/Response';
import { authMiddleware, Token } from '@/middleware/auth';



export default authMiddleware(async (req: NextApiRequest, res: NextApiResponse, token: Token) => {

    try {
        const drivers = await prisma.driver.findMany({ where: { managerId: token.managerId } });
        if (!drivers) {
            return res.status(404).json(refineResponse(Status.DATA_NOT_FOUND, 'drivers not found'));
        }

        return res.status(200).json(refineResponse(Status.SUCCESS, 'drivers fetched successfully', drivers));
    } catch (error: any) {
        return res.status(500).json(refineResponse(Status.UNEXPECTED_ERROR, error.message));
    }
})