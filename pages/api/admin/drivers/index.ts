import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react';
import prisma from '../../../../lib/prisma'
import { refineResponse } from 'shared/helpers/refineResponse';
import { Status } from 'shared/models/Response';
export default async function handle(req: NextApiRequest, res: NextApiResponse) {

    try {
        const drivers = await prisma.driver.findMany({});
        if (!drivers) {
            return res.status(404).json(refineResponse(Status.DATA_NOT_FOUND, 'drivers not found'));
        }

        return res.status(200).json(refineResponse(Status.SUCCESS, 'drivers fetched successfully', drivers));
    } catch (error: any) {
        return res.status(500).json(refineResponse(Status.UNEXPECTED_ERROR, error.message));
    }
}