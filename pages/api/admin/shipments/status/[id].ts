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
        const shipment = await prisma.shipment.findFirst({ where: { id: id as string, adminId: token.adminId } });
        if (!shipment) return res.status(400).json(refineResponse(Status.DATA_NOT_FOUND, 'Shipment not found'))

        // if(values.status === 'DELIVERED') {
        //     query.deliveredAt = new Date()
        // }


        console.log(canceled)
        console.log(status)

        await prisma.shipment.updateMany({
            where: {
                id: id,
                adminId: token!.adminId!
            },

            data: {
                status: status!,
                canceled: { set: { ...canceled! }}
            },

        })

        const updatedShipment = await prisma.shipment.findFirst({ where: { id: id } })

        return res.status(200).json(refineResponse(Status.SUCCESS, 'Status Updated Successfully', updatedShipment))

    } catch (error: any) {
        return res.status(500).json(refineResponse(Status.UNEXPECTED_ERROR, error.message))
    }


})