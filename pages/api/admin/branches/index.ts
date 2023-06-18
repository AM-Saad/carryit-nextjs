import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react';
import prisma from '../../../../lib/prisma'
import { refineResponse } from 'shared/helpers/refineResponse';
import { Status } from '@/shared/modals/Response';
import { authMiddleware, Token } from '@/middleware/auth';



export default authMiddleware(async (req: NextApiRequest, res: NextApiResponse, token: Token) => {

    try {
        const branches = await prisma.branch.findMany({ where: { companyId: token.companyId } });
        if (!branches) {
            return res.status(404).json(refineResponse(Status.DATA_NOT_FOUND, 'Branches not found'));
        }

        return res.status(200).json(refineResponse(Status.SUCCESS, 'Branches fetched successfully', branches));
    } catch (error: any) {
        return res.status(500).json(refineResponse(Status.UNEXPECTED_ERROR, error.message));
    }
})