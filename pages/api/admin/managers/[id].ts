import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/lib/prisma'
import { refineResponse } from 'shared/helpers/refineResponse';
import { Status } from '@/shared/modals/Response';
import { Token, authMiddleware } from '@/middleware/auth';
export default authMiddleware(async (req: NextApiRequest, res: NextApiResponse, token: Token) => {

    const { id } = req.query
    if (req.method == 'GET') {
        try {
            const admin = await prisma.admin.findFirst({ where: { id: id as string } });
            if (!admin) return res.status(404).json(refineResponse(Status.DATA_NOT_FOUND, 'Manager not found'));

            return res.status(200).json(refineResponse(Status.SUCCESS, 'Manager fetched successfully', admin));
        } catch (error: any) {
            return res.status(500).json(refineResponse(Status.UNEXPECTED_ERROR, error.message));
        }
    }
    if (req.method === 'DELETE') {
        try {
            const admin = await prisma.admin.findFirst({ where: { id: id as string } });
            if (!admin) return res.status(404).json(refineResponse(Status.DATA_NOT_FOUND, 'Manager not found'));

            await prisma.admin.delete({ where: { id: admin.id } })
            return res.status(200).json(refineResponse(Status.SUCCESS, 'Manager deleted successfully'));
        } catch (error: any) {
            return res.status(500).json(refineResponse(Status.UNEXPECTED_ERROR, error.message));
        }
    }
    if (req.method === 'PATCH') {
        try {
            const { values } = req.body
            let query: any = {}

            values.forEach((i: any) => {
                const vals = Object.values(i)
                const keys = Object.keys(i)
                if (!query.hasOwnProperty(keys[0])) {
                    query[keys[0]] = vals[0]
                }
            })

            const admin = await prisma.admin.findFirst({ where: { id: id as string } });
            if (!admin) return res.status(404).json(refineResponse(Status.DATA_NOT_FOUND, 'Manager not found'));

            console.log(query)
            const item = await prisma.admin.update({ where: { id: admin.id }, data: query })
            return res.status(200).json(refineResponse(Status.SUCCESS, 'Manager updated successfully', item))
        } catch (error: any) {
            return res.status(500).json(refineResponse(Status.UNEXPECTED_ERROR, error.message))
        }
    }


})  