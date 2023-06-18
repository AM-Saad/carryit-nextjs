import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/lib/prisma'
import { refineResponse } from '@/shared/helpers/refineResponse';
import { Status } from '@/shared/modals/Response';
import { Token, authMiddleware } from '@/middleware/auth';

export default authMiddleware(async (req: NextApiRequest, res: NextApiResponse, token: Token) => {


    if (req.method == 'GET') {

        try {
            const vehicles = await prisma.vehicle.findFirst({ where: { id: req.query.id as string, managerId: token.managerId } });
            if (!vehicles) {
                return res.status(404).json(refineResponse(Status.DATA_NOT_FOUND, 'Vehicle not found'));
            }

            return res.status(200).json(refineResponse(Status.SUCCESS, 'Vehicle Fetched', vehicles));
        } catch (error: any) {
            console.log(error);
            return res.status(500).json(refineResponse(Status.UNEXPECTED_ERROR, 'Unexpected Error'));
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
            const item = await prisma.vehicle.updateMany({ where: { id: req.query.id as string, managerId: token.managerId as string }, data: query })
            const vehicle = await prisma.vehicle.findFirst({ where: { id: req.query.id as string, managerId: token.managerId as string } });
            return res.status(200).json(refineResponse(Status.SUCCESS, 'Vehicle updated successfully', vehicle))

        } catch (error: any) {
            return res.status(500).json(refineResponse(Status.UNEXPECTED_ERROR, error.message))
        }

    }

    if (req.method == 'DELETE') {
        try {
            const item = await prisma.vehicle.deleteMany({ where: { id: req.query.id as string, managerId: token.managerId! as string } })
            return res.status(200).json(refineResponse(Status.SUCCESS, 'Vehicles deleted successfully', item))
        } catch (error: any) {
            return res.status(500).json(refineResponse(Status.UNEXPECTED_ERROR, error.message))
        }
    }
})