import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react';
import prisma from '../../../../lib/prisma'
import { refineResponse } from 'shared/helpers/refineResponse';
import { Status } from '@/shared/modals/Response';
import { authMiddleware, Token } from '@/middleware/auth';



export default authMiddleware(async (req: NextApiRequest, res: NextApiResponse, token: Token) => {

    if (req.method !== 'GET' && req.method !== 'PATCH') {
        return res.status(405).json(refineResponse(Status.METHOD_NOT_ALLOWED, 'Method not allowed'));
    }
    if (req.method == 'PATCH') {
        try {
            const { values } = req.body
            let query: any = {}

            values.forEach((i: any) => {
                const vals = Object.values(i)
                const keys = Object.keys(i)
                if (!query.hasOwnProperty(keys[0])) {
                    query[keys[0]] = vals[0]
                }
            })
            const item = await prisma.company.updateMany({ where: { id: token.companyId as string }, data: query })
            const comapny = await prisma.company.findFirst({ where: { id: token.companyId } });
            return res.status(200).json(refineResponse(Status.SUCCESS, 'Comapny updated successfully', comapny))

        } catch (error: any) {
            return res.status(500).json(refineResponse(Status.UNEXPECTED_ERROR, error.message))
        }
    }
    if (req.method == 'GET') {

        try {
            const company = await prisma.company.findFirst({ where: { id: token.companyId } });
            if (!company) {
                return res.status(404).json(refineResponse(Status.DATA_NOT_FOUND, 'Company not found'));
            }
            return res.status(200).json(refineResponse(Status.SUCCESS, 'Company fetched successfully', company));
        } catch (error: any) {

            return res.status(500).json(refineResponse(Status.UNEXPECTED_ERROR, error.message));
        }
    }
})