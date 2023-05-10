import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react';
import prisma from '@/lib/prisma'
import { refineResponse } from 'shared/helpers/refineResponse';
import { Status } from '@/shared/modals/Response';
import { ShipmentStatus } from '@/modals/Shipment';


export default async function handle(req: NextApiRequest, res: NextApiResponse<any>) {
    const no = req.query.no as string
    if(req.method !== 'GET'){
        return res.status(401).json(refineResponse(Status.INVALID_CREDENTIALS, 'Method Not Allowed'))
    }
    if (req.method === 'GET') {
        const shipment = await prisma.shipment.findFirst({ where: { shipmentNo: no as string } });

        try {
            if (!shipment) {
                return res.status(404).json(refineResponse(Status.DATA_NOT_FOUND, 'Shipment Not Found!!'));
            }
            if(shipment.status !== ShipmentStatus.Shipped)
            {
                return res.status(401).json(refineResponse(Status.UNHANDLED_SCENARIO, 'Shipment Not Shipped Yet.'))
            }
            return res.status(200).json(refineResponse(Status.SUCCESS, 'Shipment fetched successfully', shipment));
        } catch (error: any) {
            return res.status(500).json({ error: error.message });
        }
    }


}