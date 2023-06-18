import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react';
import prisma from '../../../../lib/prisma'
import { refineResponse } from 'shared/helpers/refineResponse';
import { Status } from '@/shared/modals/Response';
import { Token, authMiddleware } from '@/middleware/auth';


export const config = {
    api: {
        bodyParser: true,
    },
}

export default authMiddleware(async (req: NextApiRequest, res: NextApiResponse, token: Token) => {
    console.log('token', token)
    try {
        const packages = await prisma.package.findMany({where: {managerId: token.managerId}});
        if (!packages) {
            return res.status(404).json(refineResponse(Status.DATA_NOT_FOUND, 'Packages not found'));
        }

        return res.status(200).json(refineResponse(Status.SUCCESS, 'Packages fetched successfully', packages));
    } catch (error: any) {
        return res.status(500).json(refineResponse(Status.UNEXPECTED_ERROR, error.message));
    }

})