import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react';
import prisma from '@/lib/prisma'
import { refineResponse } from 'shared/helpers/refineResponse';
import { Status } from '@/shared/modals/Response';
import { authMiddleware, Token } from '@/middleware/auth';


export default authMiddleware(async (req: NextApiRequest, res: NextApiResponse<any>, token: Token) => {
    const id = req.query.id as string

    if (req.method !== 'GET' && req.method !== 'PUT') {
        return res.status(405).json(refineResponse(Status.METHOD_NOT_ALLOWED, 'Method not allowed'));
    }
    if (req.method === 'GET') {
     const   shipment = await prisma.shipment.findFirst({ where: { id: id as string, driverId: token.driverId } });

        try {
            if (!shipment) {
                return res.status(404).json(refineResponse(Status.DATA_NOT_FOUND, 'shipments not found'));
            }
            return res.status(200).json(refineResponse(Status.SUCCESS, 'Shipment fetched successfully', shipment));
        } catch (error: any) {
            return res.status(500).json({ error: error.message });
        }
    }


    if (req.method === 'PUT') {
     const   shipment = await prisma.shipment.findFirst({ where: { id: id as string, driverId: token.driverId } });

        try {
            if (!shipment) {
                return res.status(404).json(refineResponse(Status.DATA_NOT_FOUND, 'shipments not found'));
            }
            const { status } = req.body
            console.log(req.body)
            const updatedShipment = await prisma.shipment.update({
                where: { id: id as string },
                data: { status: req.body.status }
            });
            return res.status(200).json(refineResponse(Status.SUCCESS, 'Shipment updated successfully', updatedShipment));
        } catch (error: any) {
            return res.status(500).json({ error: error.message });
        }
    }

})