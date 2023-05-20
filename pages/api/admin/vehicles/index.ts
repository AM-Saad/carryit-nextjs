import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react';
import prisma from '@/lib/prisma'
import { refineResponse } from 'shared/helpers/refineResponse';
import { Status } from '@/shared/modals/Response';
import { authMiddleware, Token } from '@/middleware/auth';

export default authMiddleware(async (req: NextApiRequest, res: NextApiResponse, token: Token) => {

    if (req.method == 'GET') {
        try {
            const vehicle = await prisma.vehicle.findMany({ where: { adminId: token.adminId } });
            if (!vehicle) {
                return res.status(404).json(refineResponse(Status.DATA_NOT_FOUND, 'Vehicles not found'));
            }
            return res.status(200).json(refineResponse(Status.SUCCESS, 'Vehicles found', vehicle));
        } catch (error: any) {
            console.log(error);
            return res.status(500).json(refineResponse(Status.UNEXPECTED_ERROR, error.message));
        }
    }
    if (req.method == 'POST') {
        const { values } = req.body
        const admin = await prisma.admin.findFirst({ where: { id: token.adminId as string } });

        const payload = {
            data: {
                name: values.name,
                vehicle_type: values.vehicle_type,
                fuel_type: values.fuel_type,
                fuel_tank: {
                    set: {
                        full_capacity: values.fuel_tank.full_capacity,
                        unit: values.fuel_tank.unit,
                        cost_per_unit: values.fuel_tank.cost_per_unit
                    }
                },
                active: values.active,
                plate_number: values.plate_number,
                model: values.model,
                gas_history: [],
                maintenance: [],
                admin: {
                    connect: {
                        id: admin!.id
                    }
                },
                company: {
                    connect: {

                        id: admin?.companyId!
                    }
                }
            }
        }

        try {
            const vehicle = await prisma.vehicle.create(payload);
            return res.status(200).json(refineResponse(Status.SUCCESS, 'Vehicle created successfully', vehicle));
        }
        catch (error: any) {
            console.log(error);
            return res.status(500).json(refineResponse(Status.UNEXPECTED_ERROR, error.message));
        }
    }


})