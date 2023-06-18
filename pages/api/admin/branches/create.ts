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

    if (!token.isSuper) return res.status(403).json(refineResponse(Status.USER_TYPE_UNAUTHORIZED, 'You are not allowed to perform this action'));
    // create a new branch
    const { values } = req.body
    const manager = await prisma.manager.findFirst({ where: { id: token.managerId as string } });
    const id = new ObjectId();

    const payload = {
        data: {
            address: values.address,
            name: values.name,
            phone: values.mobile,
            state: values.state,
            city: values.city,
            notes: values.notes,
            governorate: values.governorate,
            managerId: manager!.id,
            company: {
                connect: {
                    id: manager!.companyId!
                }
            }

        }
    }

    try {
        const branch = await prisma.branch.create(payload);
        return res.status(200).json(refineResponse(Status.SUCCESS, 'Branch Created Successfully', branch));
    }
    catch (error: any) {
        console.log(error);
        return res.status(500).json(refineResponse(Status.UNEXPECTED_ERROR, error.message));
    }

})