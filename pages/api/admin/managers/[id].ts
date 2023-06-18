import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/lib/prisma'
import { refineResponse } from 'shared/helpers/refineResponse';
import { Status } from '@/shared/modals/Response';
import { Token, authMiddleware } from '@/middleware/auth';
export default authMiddleware(async (req: NextApiRequest, res: NextApiResponse, token: Token) => {

    if (req.method === 'POST' || req.method === 'PUT') return res.status(405).json(refineResponse(Status.METHOD_NOT_ALLOWED, 'Method not allowed'));


    const { id } = req.query! // id of the manager

    const manager = await prisma.manager.findFirst({ where: { id: id as string } });
    if (!manager) return res.status(404).json(refineResponse(Status.DATA_NOT_FOUND, 'Manager not found'));

    if (req.method == 'GET') {
        try {

            return res.status(200).json(refineResponse(Status.SUCCESS, 'Manager fetched successfully', manager));
        } catch (error: any) {
            return res.status(500).json(refineResponse(Status.UNEXPECTED_ERROR, error.message));
        }
    }
    if (req.method === 'DELETE') {
        try {

            await prisma.manager.delete({ where: { id: manager.id } })
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



            if (query.hasOwnProperty('branchId')) {

                const branch = await prisma.branch.findFirst({ where: { id: query.branchId } });
                if (!branch) return res.status(404).json(refineResponse(Status.DATA_NOT_FOUND, 'Branch not found'))


                if (branch.managerId && branch.managerId !== id) return res.status(404).json(refineResponse(Status.INVALID_PARAMETER, 'Branch already assigned to another manager'));

                await prisma.branch.updateMany({ where: { managerId: branch.managerId }, data: { managerId: null } })

                await prisma.branch.update({ where: { id: query.branchId }, data: { managerId: id as string } })
            }


            const item = await prisma.manager.update({ where: { id: manager.id }, data: query })
            return res.status(200).json(refineResponse(Status.SUCCESS, 'Manager updated successfully', item))
        } catch (error: any) {
            return res.status(500).json(refineResponse(Status.UNEXPECTED_ERROR, error.message))
        }


    }


})  