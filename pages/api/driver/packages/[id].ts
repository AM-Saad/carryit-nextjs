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
        const item = await prisma.package.findFirst({ where: { id: id as string, driverId: token.driverId } });

        try {
            if (!item) {
                return res.status(404).json(refineResponse(Status.DATA_NOT_FOUND, 'Packages not found'));
            }
            return res.status(200).json(refineResponse(Status.SUCCESS, 'Package fetched successfully', item));
        } catch (error: any) {
            return res.status(500).json({ error: error.message });
        }
    }


    if (req.method === 'PUT') {
        const item = await prisma.package.findFirst({ where: { id: id as string, driverId: token.driverId } });

        try {
            if (!item) {
                return res.status(404).json(refineResponse(Status.DATA_NOT_FOUND, 'packages not found'));
            }
            const { status } = req.body
            console.log(req.body)
            const updatedPackage = await prisma.package.update({
                where: { id: id as string },
                data: { status: req.body.status }
            });
            return res.status(200).json(refineResponse(Status.SUCCESS, 'Package updated successfully', updatedPackage));
        } catch (error: any) {
            return res.status(500).json({ error: error.message });
        }
    }

})