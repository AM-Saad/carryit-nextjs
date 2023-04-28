import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react';
import prisma from '@/lib/prisma'
import { refineResponse } from 'shared/helpers/refineResponse';
import { Status } from '@/shared/modals/Response';
import { authMiddleware, Token } from '@/middleware/auth';


export default authMiddleware(async (req: NextApiRequest, res: NextApiResponse<any>, token: Token) => {
    const id = req.query.id as string

    let shipment
    if (req.method === 'GET' || req.method === 'PATCH') {
        shipment = await prisma.shipment.findFirst({ where: { id: id as string, driverId:token.driverId } });

    }
    if (req.method === 'GET') {

        try {
            if (!shipment) {
                return res.status(404).json(refineResponse(Status.DATA_NOT_FOUND, 'shipments not found'));
            }
            return res.status(200).json(refineResponse(Status.SUCCESS, 'Shipment fetched successfully', shipment));
        } catch (error: any) {
            return res.status(500).json({ error: error.message });
        }
    }

  
})