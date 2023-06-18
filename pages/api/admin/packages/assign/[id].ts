import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/lib/prisma'
import { refineResponse } from 'shared/helpers/refineResponse';
import { Status } from '@/shared/modals/Response';
import { authMiddleware, Token } from '@/middleware/auth';
import { PackageStatus } from '@/modals/Package';
import { ObjectId } from 'mongodb';
export default authMiddleware(async (req: NextApiRequest, res: NextApiResponse, token: Token) => {

    if (req.method !== 'PUT') {
        return res.status(405).json(refineResponse(Status.UNHANDLED_SCENARIO, 'Method not allowed'));
    }

    const { id, driverId } = req.query;

    if (!id || !driverId) {
        return res.status(400).json(refineResponse(Status.INVALID_PARAMETER, 'Invalid parameter'));
    }
    const item = await prisma.package.findFirst({ where: { id: id as string, managerId: token.managerId } });
    const driver = await prisma.driver.findFirst({ where: { id: driverId as string, managerId: token.managerId } })
    try {
        if (!item || !driver) {
            return res.status(404).json(refineResponse(Status.DATA_NOT_FOUND, 'Data not found'));
        }

        if (item.status === PackageStatus.Delivered) {
            return res.status(400).json(refineResponse(Status.ALREADY_DONE, 'Package is already delivered'));
        }

        // Check if package is already assigned to this driver
        if (item.driverId === driverId) {
            return res.status(400).json(refineResponse(Status.ALREADY_DONE, 'Package is already assigned to this driver'));
        }


        // Remove package from previous driver
        if (item.driverId !== null) {
            const currentDriver = await prisma.driver.findFirst({ where: { id: item.driverId as string, managerId: token.managerId } })
            const driverPackages = currentDriver?.packages.filter(i => i.packageId !== id as string);
            await prisma.driver.update({
                where: { id: item.driverId as string },
                data: {
                    packages: driverPackages
                }

            })

        }

        // Assign package to driver
        await prisma.package.update({
            where: { id: id as string },
            data: {
                driverId: driverId as string,
            }
        })

        // Add package to driver packages
        const updatePackage = await prisma.package.findFirst({ where: { id: id as string, managerId: token.managerId } });
        const driverPackages = [...driver.packages, { id: (new ObjectId()).toString(), packageId: updatePackage?.id!, packageNo: updatePackage?.packageNo! }]
        await prisma.driver.update({
            where: { id: driverId as string },
            data: {
                packages: driverPackages
            }

        })

        return res.status(200).json(refineResponse(Status.SUCCESS, 'Package assigned successfully', updatePackage));

    } catch (error: any) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }




})