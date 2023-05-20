import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react';
import prisma from '../../../../lib/prisma'
import { refineResponse } from 'shared/helpers/refineResponse';
import { Status } from '@/shared/modals/Response';
import { Token, authMiddleware } from '@/middleware/auth';


export const config = {
    api: {
        bodyParser: true,
    },
}

export default authMiddleware(async (req: NextApiRequest, res: NextApiResponse, token: Token) => {
    console.log('token', token)
    try {
        const shipments = await prisma.shipment.findMany({where: {adminId: token.adminId}});
        if (!shipments) {
            return res.status(404).json(refineResponse(Status.DATA_NOT_FOUND, 'Shipments not found'));
        }

        return res.status(200).json(refineResponse(Status.SUCCESS, 'Shipments fetched successfully', shipments));
    } catch (error: any) {
        return res.status(500).json(refineResponse(Status.UNEXPECTED_ERROR, error.message));
    }

})