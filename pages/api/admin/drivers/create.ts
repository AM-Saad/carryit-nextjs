import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react';
import prisma from '../../../../lib/prisma'
import { refineResponse } from 'shared/helpers/refineResponse';
import { Status } from '@/shared/modals/Response';
import { } from '.prisma/client';
import { ObjectId } from 'bson'
import { authMiddleware , Token} from '@/middleware/auth';

export const config = {
    api: {
        bodyParser: true,
    },
}

export default authMiddleware(async (req: NextApiRequest, res: NextApiResponse, token:Token) => {

    // create a new driver
    if (req.method == 'POST') {
        const { values } = req.body
        const admin = await prisma.admin.findFirst({ where: { id: token.adminId as string } });
        const id = new ObjectId();
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
                company:{
                    connect:{
                        id: admin!.companyId!
                    }
                }

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

})