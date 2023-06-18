import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react';
import prisma from '@/lib/prisma'
import { refineResponse } from 'shared/helpers/refineResponse';
import { Status } from '@/shared/modals/Response';
import { authMiddleware, Token } from '@/middleware/auth';


export default authMiddleware(async (req: NextApiRequest, res: NextApiResponse<any>, token: Token) => {
    const id = req.query.id as string

    if (req.method !== 'PUT') {
        return res.status(400).json(refineResponse(Status.UNHANDLED_SCENARIO, 'Method not allowed'))

    }



    try {

        const { canceled, status } = req.body
        const package = await prisma.package.findFirst({ where: { id: id as string, managerId: token.managerId } });
        if (!package) return res.status(400).json(refineResponse(Status.DATA_NOT_FOUND, 'Package not found'))

        // if(values.status === 'DELIVERED') {
        //     query.deliveredAt = new Date()
        // }


        console.log(canceled)
        console.log(status)

        await prisma.package.updateMany({
            where: {
                id: id,
                managerId: token!.managerId!
            },

            data: {
                status: status!,
                canceled: { set: { ...canceled! }}
            },

        })

        const updatedPackage = await prisma.package.findFirst({ where: { id: id } })

        return res.status(200).json(refineResponse(Status.SUCCESS, 'Status Updated Successfully', updatedPackage))

    } catch (error: any) {
        return res.status(500).json(refineResponse(Status.UNEXPECTED_ERROR, error.message))
    }


})