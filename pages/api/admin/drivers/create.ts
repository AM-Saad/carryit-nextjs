import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react';
import prisma from '../../../../lib/prisma'
import { refineResponse } from 'shared/helpers/refineResponse';
import { Status } from 'shared/models/Response';
import { } from '.prisma/client';
import { ObjectId } from 'bson'

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
    // create a new driver
    if (req.method == 'POST') {
        const { values } = JSON.parse(req.body);
        const admin = await prisma.admin.findFirst({ where: { email: session.user?.email as string } });
        const drivers = await prisma.driver.findMany();
        const id  = new ObjectId();
            console.log(admin)
        const payload = {
            data: {
                address: values.address,
                name: values.name,
                mobile: values.mobile,
                password: values.password,
                salary: values.salary,
                image: '',
                admin: {
                    connect: {
                        id: admin!.id
                    }
                },

            }
        }
        try {
            const driver = await prisma.driver.create(payload);
            return res.status(200).json(refineResponse(Status.SUCCESS, 'Drivers created successfully', driver));
        }
        catch (error: any) {
            console.log(error);
            return res.status(500).json(refineResponse(Status.UNEXPECTED_ERROR, error.message));
        }
    }

}