import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react';
import prisma from '../../../../lib/prisma'
import { refineResponse } from 'shared/helpers/refineResponse';
import { Status } from '@/shared/modals/Response';
import { authMiddleware, Token } from '@/middleware/auth';

export default authMiddleware(async (req: NextApiRequest, res: NextApiResponse, token: Token) => {

    if (req.method == 'GET') {

        try {
            const branch = await prisma.branch.findFirst({ where: { id: req.query.id as string, adminId: token.adminId } });
            if (!branch) {
                return res.status(404).json(refineResponse(Status.DATA_NOT_FOUND, 'Branch not found'));
            }
            return res.status(200).json(refineResponse(Status.SUCCESS, 'Branch fetched successfully', branch));
        } catch (error: any) {

            return res.status(500).json(refineResponse(Status.UNEXPECTED_ERROR, error.message));
        }
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
            const item = await prisma.branch.updateMany({ where: { id: req.query.id as string, adminId: token.adminId }, data: query })
            const branch = await prisma.branch.findFirst({ where: { id: req.query.id as string, adminId: token.adminId } });
            return res.status(200).json(refineResponse(Status.SUCCESS, 'Branch updated successfully', branch))

        } catch (error: any) {
            return res.status(500).json(refineResponse(Status.UNEXPECTED_ERROR, error.message))
        }

    }

    if (req.method == 'DELETE') {
        try {
            const item = await prisma.branch.deleteMany({ where: { id: req.query.id as string, adminId: token.adminId } })
            return res.status(200).json(refineResponse(Status.SUCCESS, 'Branch deleted successfully', item))
        } catch (error: any) {
            return res.status(500).json(refineResponse(Status.UNEXPECTED_ERROR, error.message))
        }
    }


})