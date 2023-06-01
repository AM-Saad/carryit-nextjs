
import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/lib/prisma'
import { refineResponse } from 'shared/helpers/refineResponse';
import { Status } from '@/shared/modals/Response';
import { Token, authMiddleware } from '@/middleware/auth';
export default authMiddleware(async (req: NextApiRequest, res: NextApiResponse, token: Token) => {
if(req.method == 'GET'){
    try {
        const manager = await prisma.admin.findMany({ where: { companyId: token.companyId } });
        if (!manager) return res.status(404).json(refineResponse(Status.DATA_NOT_FOUND, 'Manager not found'));

        return res.status(200).json(refineResponse(Status.SUCCESS, 'Manager fetched successfully', manager));
    } catch (error: any) {
        return res.status(500).json(refineResponse(Status.UNEXPECTED_ERROR, error.message));
    }
}

})