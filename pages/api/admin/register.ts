import type { NextApiRequest, NextApiResponse } from 'next'

import { getSession } from 'next-auth/react';
import prisma from '../../../lib/prisma'
import { refineResponse } from 'shared/helpers/refineResponse';
import { Status } from '@/shared/modals/Response';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    if (req.method === 'POST') {
        const { values } = JSON.parse(req.body);
        if(!values.email || !values.name){
            return refineResponse(Status.INVALID_CREDENTIALS, "Missing email or name");
        }
        try {

            const company = await prisma.company.create({
                data: {
                    brand_name: values.name + "'s Company",
                }
            })
            const admin = await prisma.admin.create({
                data: {
                    email: values.email,
                    name: values.name,
                    isSuper: true,
                    company: {
                        connect: {
                            id: company.id
                        }
                    }
                }
            })
            return res.status(200).json(refineResponse(Status.SUCCESS, "Admin created successfully", admin))
        }
        catch (e) {
            return res.status(500).json(refineResponse(Status.UNEXPECTED_ERROR, "Error creating admin"))


        }


    }


}

