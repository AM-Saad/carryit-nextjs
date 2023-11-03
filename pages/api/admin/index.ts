import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/lib/prisma'
import { refineResponse } from 'shared/helpers/refineResponse';
import { Status } from '@/shared/modals/Response';
import { Token, authMiddleware } from '@/middleware/auth';
export default authMiddleware(async (req: NextApiRequest, res: NextApiResponse, token: Token) => {
    if (req.method !== 'GET' && req.method !== 'PATCH') return res.status(404).json(refineResponse(Status.METHOD_NOT_ALLOWED, 'Method not allowed'));
    if (req.method == 'GET') {
        try {

            const manager = await prisma.manager.findFirst({ where: { id: token.managerId } });
            if (!manager) return res.status(404).json(refineResponse(Status.DATA_NOT_FOUND, 'Manager not found'));

            return res.status(200).json(refineResponse(Status.SUCCESS, 'Manager fetched successfully', manager));
        } catch (error: any) {
            return res.status(500).json(refineResponse(Status.UNEXPECTED_ERROR, error.message));
        }
    }

    if (req.method == 'PATCH') {
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
            await prisma.manager.updateMany({ where: { id: token.managerId }, data: query })
            const manager = await prisma.manager.findFirst({ where: { id: token.managerId } });
            return res.status(200).json(refineResponse(Status.SUCCESS, 'Admin updated successfully', manager))

        } catch (error: any) {
            return res.status(500).json(refineResponse(Status.UNEXPECTED_ERROR, error.message))
        }
    }


})  