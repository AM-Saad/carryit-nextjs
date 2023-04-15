import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react';
import prisma from '../../../../lib/prisma'
import { refineResponse } from 'shared/helpers/refineResponse';
import { Status } from 'shared/models/Response';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {

    try {
        const shipments = await prisma.shipment.findFirst({ where: { id: req.query.id as string } });
        if (!shipments) {
            return res.status(404).json(refineResponse(Status.DATA_NOT_FOUND, 'shipments not found'));
        }
        return res.status(200).json(refineResponse(Status.SUCCESS, 'shipments fetched successfully', shipments));
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
}