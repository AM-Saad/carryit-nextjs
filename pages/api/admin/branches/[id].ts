import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react';
import prisma from '../../../../lib/prisma'
import { refineResponse } from 'shared/helpers/refineResponse';
import { Status } from '@/shared/modals/Response';
import { authMiddleware, Token } from '@/middleware/auth';

export default authMiddleware(async (req: NextApiRequest, res: NextApiResponse, token: Token) => {

    if (req.method === 'POST' || req.method === 'PUT') return res.status(405).json(refineResponse(Status.METHOD_NOT_ALLOWED, 'Method not allowed'));


    if (req.method == 'GET') {
        console.log(token)
        let query: any = token.isSuper ? { companyId: token.companyId } : { where: { managerId: token.managerId } }
        try {
            const branch = await prisma.branch.findFirst({ where: { id: req.query.id as string, ...query } });
            if (!branch) return res.status(404).json(refineResponse(Status.DATA_NOT_FOUND, 'Branch not found'));


            return res.status(200).json(refineResponse(Status.SUCCESS, 'Branch fetched successfully', branch));
        } catch (error: any) {

            return res.status(500).json(refineResponse(Status.UNEXPECTED_ERROR, error.message));
        }
    }


    if (req.method == 'PATCH') {
        if (!token.isSuper) return res.status(403).json(refineResponse(Status.USER_TYPE_UNAUTHORIZED, 'You are not allowed to perform this action'));

        try {
            const { values } = req.body
            const branch = await prisma.branch.findFirst({ where: { id: req.query.id as string, companyId: token.companyId } });

            let query: any = {}

            values.forEach((i: any) => {
                const vals = Object.values(i)
                const keys = Object.keys(i)
                if (!query.hasOwnProperty(keys[0])) {
                    query[keys[0]] = vals[0]
                }
            })
            if (query.hasOwnProperty('vehicles')) {
                const driverUpdatePromises = branch?.vehicles.map((vehicleId) => {
                    return prisma.vehicle.updateMany({ where: { id: vehicleId }, data: { branchId: null } });
                });

                const queryDriverPromises = query.vehicles.map(async (vehicleId) => {
                    const branches = await prisma.branch.findMany({ where: { vehicles: { has: vehicleId } } });
                    const branchUpdatePromises = branches.map((branch) => {
                        let vehicles = branch.vehicles.filter((id) => id !== vehicleId);
                        return prisma.branch.updateMany({ where: { id: branch.id }, data: { vehicles: vehicles } });
                    });

                    // Update driver after branches have been updated
                    await Promise.all(branchUpdatePromises);
                    return prisma.vehicle.updateMany({ where: { id: vehicleId }, data: { branchId: req.query.id as string } });
                });

                // wait for all promises to resolve before continuing
                await Promise.all([...driverUpdatePromises!, ...queryDriverPromises]);
            }



            if (query.hasOwnProperty('drivers')) {
                const driverUpdatePromises = branch?.drivers.map((driverId) => {
                    return prisma.driver.updateMany({ where: { id: driverId }, data: { branchId: null } });
                });

                const queryDriverPromises = query.drivers.map(async (driverId) => {
                    const branches = await prisma.branch.findMany({ where: { drivers: { has: driverId } } });
                    const branchUpdatePromises = branches.map((branch) => {
                        let drivers = branch.drivers.filter((id) => id !== driverId);
                        return prisma.branch.updateMany({ where: { id: branch.id }, data: { drivers: drivers } });
                    });

                    // Update driver after branches have been updated
                    await Promise.all(branchUpdatePromises);
                    return prisma.driver.updateMany({ where: { id: driverId }, data: { branchId: req.query.id as string } });
                });

                // wait for all promises to resolve before continuing
                await Promise.all([...driverUpdatePromises!, ...queryDriverPromises]);
            }








            await prisma.branch.updateMany({ where: { id: req.query.id as string, managerId: token.managerId }, data: query })

            const updatedBranch = await prisma.branch.findFirst({ where: { id: req.query.id as string, managerId: token.managerId } });

            return res.status(200).json(refineResponse(Status.SUCCESS, 'Branch updated successfully', updatedBranch))

        } catch (error: any) {
            return res.status(500).json(refineResponse(Status.UNEXPECTED_ERROR, error.message))
        }
    }


    if (req.method == 'DELETE') {
        try {
            const branches = await prisma.branch.findMany({ where: { companyId: token.companyId } });

            if (branches.length == 1) return res.status(400).json(refineResponse(Status.BAD_REQUEST, 'You can not delete the last branch of your company'))
            const item = await prisma.branch.deleteMany({ where: { id: req.query.id as string, companyId: token.companyId } })
            return res.status(200).json(refineResponse(Status.SUCCESS, 'Branch deleted successfully', item))
        } catch (error: any) {
            return res.status(500).json(refineResponse(Status.UNEXPECTED_ERROR, error.message))
        }
    }


})