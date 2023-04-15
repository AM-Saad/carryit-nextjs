import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react';
import prisma from '../../../lib/prisma'
import { refineResponse } from 'shared/helpers/refineResponse';
    import  { Status } from 'shared/models/Response';
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    const session = await getSession({ req });
    try {
        const admin = await prisma.admin.findFirst({ where: { email: session?.user?.email as string } });
        if (!admin)  res.status(404).json(refineResponse(Status.DATA_NOT_FOUND, 'Admin not found'));

        return res.status(200).json(refineResponse(Status.SUCCESS, 'Admin fetched successfully', admin));
    } catch (error: any) {
        return res.status(500).json(refineResponse(Status.UNEXPECTED_ERROR, error.message));
    }
}