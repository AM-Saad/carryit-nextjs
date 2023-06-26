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


    // create package
    if (req.method == 'POST') {
        const { values } = req.body
        const manager = await prisma.manager.findFirst({ where: { id: token.managerId as string } });
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
                shipping_address: values.receiver.shipping_address || null,
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
                manager: {
                    connect: {
                        id: manager!.id!
                    }
                },
                company: {
                    connect: {
                        id: manager!.companyId!
                    }
                },
                packageNo: `SHP-${Math.floor(Math.random() * 1000000)}`,
                branchId: values.branchId
            }
        }
        try {
            const item = await prisma.package.create(payload);
            return res.status(200).json(refineResponse(Status.SUCCESS, 'Package created successfully', item));
        }
        catch (error: any) {
            console.log(error);
            return res.status(500).json(refineResponse(Status.UNEXPECTED_ERROR, error.message));
        }
    }

})