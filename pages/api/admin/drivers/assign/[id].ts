import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../../../lib/prisma'
import { refineResponse } from 'shared/helpers/refineResponse';
import { Status } from '@/shared/modals/Response';
import { authMiddleware, Token } from '@/middleware/auth';
import { PackageStatus } from '@/modals/Package';
import { ObjectId } from 'mongodb';
export default authMiddleware(async (req: NextApiRequest, res: NextApiResponse, token: Token) => {

    if (req.method !== 'PUT') {
        return res.status(405).json(refineResponse(Status.UNHANDLED_SCENARIO, 'Method not allowed'));
    }

    const { id, vehicleId } = req.query;

    if (!id || !vehicleId) {
        return res.status(400).json(refineResponse(Status.INVALID_PARAMETER, 'Invalid parameter'));
    }
    const driver = await prisma.driver.findFirst({ where: { id: id as string, managerId: token.managerId } });
    const vehicle = await prisma.vehicle.findFirst({ where: { id: vehicleId as string, managerId: token.managerId } })
    try {
        if (!driver || !vehicle) {
            return res.status(404).json(refineResponse(Status.DATA_NOT_FOUND, 'Data not found'));
        }



        // Check if vehicle is already assigned to this driver
        if (driver.vehicleId === vehicleId) {
            return res.status(400).json(refineResponse(Status.ALREADY_DONE, 'Vehicle is already assigned to this driver'));
        }


        // Remove vehicle from previous driver
        if (driver.vehicleId !== null) {
            await prisma.vehicle.update({
                where: { id: driver.vehicleId as string },
                data: {
                    driverId: null
                }

            })
        }

        // Remove vehicle from previous driver
        await prisma.driver.updateMany({ where: { vehicleId: vehicleId as string, managerId: token.managerId }, data: { vehicleId: null } })

        // Assign vehicle to driver
        await prisma.driver.update({
            where: { id: id as string },
            data: {
                vehicleId: vehicleId as string,
            }
        })

        await prisma.vehicle.update({
            where: { id: vehicleId as string },
            data: {
                driverId: id as string

            }

        })

        const updatedDriver = await prisma.driver.findFirst({ where: { id: id as string, managerId: token.managerId } });
        return res.status(200).json(refineResponse(Status.SUCCESS, 'Package assigned successfully', updatedDriver));

    } catch (error: any) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }




})