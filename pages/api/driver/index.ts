import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'
import { refineResponse } from 'shared/helpers/refineResponse';
import { Status } from '@/shared/modals/Response';
import { Token, authMiddleware } from '@/middleware/auth';
export default authMiddleware(async (req: NextApiRequest, res: NextApiResponse, token: Token) => {
    // if (req.method !== 'GET' && req.method !== 'PATCH') return res.status(405).json(refineResponse(Status.METHOD_NOT_ALLOWED, 'Method not allowed'));
    if (req.method == 'GET') {
        try {
            const driver = await prisma.driver.findFirst({ where: { id: token.driverId } });
            if (!driver) return res.status(404).json(refineResponse(Status.DATA_NOT_FOUND, 'Driver not found'));
            // get the vehclie document by driver.vehcileId
            const vehicle = await prisma.vehicle.findFirst({ where: { id: driver.vehicleId! } });
            if (!vehicle) return res.status(404).json(refineResponse(Status.DATA_NOT_FOUND, 'Vehicle not found'));
            const driverWithVehicle = { ...driver, vehicle };
            return res.status(200).json(refineResponse(Status.SUCCESS, 'Driver fetched successfully', driverWithVehicle));

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
            await prisma.driver.updateMany({ where: { id: token.driverId as string }, data: query })
            const driver = await prisma.driver.findFirst({ where: { id: token.driverId } });

            return res.status(200).json(refineResponse(Status.SUCCESS, 'Driver updated successfully', driver))

        } catch (error: any) {
            return res.status(500).json(refineResponse(Status.UNEXPECTED_ERROR, error.message))
        }
    }
})  