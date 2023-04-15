import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react';
import prisma from '../../../../lib/prisma'
import { refineResponse } from 'shared/helpers/refineResponse';
import { Status } from 'shared/models/Response';
import { } from '.prisma/client';


export const config = {
    api: {
        bodyParser: true,
    },
}

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    const session = await getSession({ req });
    if (!session) {
        return res.status(401).json(refineResponse(Status.TOKEN_EXPIRED, 'Unauthorized'));
    }
    // create shipment
    if (req.method == 'POST') {
        const { values } = JSON.parse(req.body);
        const admin = await prisma.admin.findFirst({ where: { email: session.user?.email as string } });
        const total_cost = Number(values.price) + Number(values.shipping_cost);
        const receiver = {
            set: {
                name: values.receiver.name,
                phone: values.receiver.phone,
                address: values.receiver.address || null,
                city: values.receiver.city || null,
                state: values.receiver.state || null,
                zip: values.receiver.zip || null,
                apartment: values.receiver.apartment.toString() || null,
                floor: values.receiver.floor.toString() || null,
                building: values.receiver.building.toString() || null,
                is_villa: false,
            }
        };
        const payload = {
            data: {
                receiver: receiver,
                shipping_cost: Number(values.shipping_cost),
                quantity: Number(values.quantity),
                price: Number(values.price),
                total_cost: total_cost,
                is_fragile: values.is_fragile,
                is_liquid: values.is_liquid,
                delivery_date: values.delivery_date,
                createdAt: values.date,
                date: values.date,
                status: 0,
                notes: values.notes,
                admin: {
                    connect: {
                        id: admin!.id
                    }
                },
                shipmentNo: `SHP-${Math.floor(Math.random() * 1000000)}`,
            }
        }
        try {
            const shipment = await prisma.shipment.create(payload);
            return res.status(200).json(refineResponse(Status.SUCCESS, 'Shipment created successfully', shipment));
        }
        catch (error: any) {
            console.log(error);
            return res.status(500).json(refineResponse(Status.UNEXPECTED_ERROR, error.message));
        }
    }

}