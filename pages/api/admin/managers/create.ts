import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react';
import prisma from '../../../../lib/prisma'
import { refineResponse } from 'shared/helpers/refineResponse';
import { Status } from '@/shared/modals/Response';
import { } from '.prisma/client';
import { ObjectId } from 'bson'
import { authMiddleware, Token } from '@/middleware/auth';

export const config = {
    api: {
        bodyParser: true,
    },
}

export default authMiddleware(async (req: NextApiRequest, res: NextApiResponse, token: Token) => {

    if (req.method !== 'POST') return res.status(405).json(refineResponse(Status.METHOD_NOT_ALLOWED, 'Method not allowed'));


    // Create new manager
    const { values } = req.body
    const manager = await prisma.manager.findFirst({ where: { id: token.managerId as string } });
    const payload = {
        data: {
            name: values.name,
            mobile: values.mobile,
            password: '123456789',
            isSuper: false,
            company: {
                connect: {
                    id: manager!.companyId!
                }
            }

        }
    }
    try {
        const manager = await prisma.manager.create(payload);
        return res.status(200).json(refineResponse(Status.SUCCESS, 'Manager created successfully', manager));
    }
    catch (error: any) {
        console.log(error);
        return res.status(500).json(refineResponse(Status.UNEXPECTED_ERROR, error.message));
    }

})