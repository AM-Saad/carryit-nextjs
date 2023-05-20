import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'
import { refineResponse } from 'shared/helpers/refineResponse';
import { Status } from '@/shared/modals/Response';
import { Token, authMiddleware } from '@/middleware/auth';
export default authMiddleware(async (req: NextApiRequest, res: NextApiResponse, token: Token) => {
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
})  