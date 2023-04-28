import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/lib/prisma'
import { refineResponse } from 'shared/helpers/refineResponse';
import { Status } from '@/shared/modals/Response';
import { ObjectId } from 'mongodb';
import { authMiddleware, Token } from '@/middleware/auth';
export const config = {
    api: {
        bodyParser: true,
    },
}
export default authMiddleware(async (req: NextApiRequest, res: NextApiResponse, token: Token) => {


    // create shipment
    if (req.method == 'POST') {
        const { values } = req.body
        const admin = await prisma.admin.findFirst({ where: { id: token.adminId as string } });
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
                total_cost: (values.price * values.quantity) + Number(values.shipping_cost),
                is_fragile: values.is_fragile,
                is_liquid: values.is_liquid,
                delivery_date: values.delivery_date,
                createdAt: values.date,
                date: values.date,
                status: 0,
                notes: values.notes,
                items: [
                    {
                        name: 'First item',
                        price: values.price,
                        quantity: values.quantity,
                        itemId: new ObjectId().toString()
                    }
                ],
                admin: {
                    connect: {
                        id: admin!.id!
                    }
                },
                company: {
                    connect: {
                        id: admin!.companyId!
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

})