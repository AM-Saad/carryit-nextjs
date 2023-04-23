import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react';
import prisma from '../../../../../lib/prisma'
import { refineResponse } from 'shared/helpers/refineResponse';
import { Status } from '@/shared/modals/Response';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {

    if (req.method === 'POST') {
        const shipment = await prisma.shipment.findFirst({ where: { id: req.query.id as string } });
        const driver = await prisma.driver.findFirst({where:{id:req.query.driver as string}})
        try {
            if (!shipment) {
                return res.status(404).json(refineResponse(Status.DATA_NOT_FOUND, 'shipments not found'));
            }
            return res.status(200).json(refineResponse(Status.SUCCESS, 'Shipment fetched successfully', shipment));
        } catch (error: any) {
            return res.status(500).json({ error: error.message });
        }
    }




}