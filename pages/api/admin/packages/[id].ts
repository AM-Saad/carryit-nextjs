import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react';
import prisma from '@/lib/prisma'
import { refineResponse } from 'shared/helpers/refineResponse';
import { Status } from '@/shared/modals/Response';
import { authMiddleware, Token } from '@/middleware/auth';


export default authMiddleware(async (req: NextApiRequest, res: NextApiResponse<any>, token: Token) => {
    const id = req.query.id as string

    let item
    if (req.method === 'GET' || req.method === 'PATCH') {
        item = await prisma.package.findFirst({ where: { id: id as string, managerId: token.managerId } });

    }
    if (req.method === 'GET') {

        try {
            if (!item) {
                return res.status(404).json(refineResponse(Status.DATA_NOT_FOUND, 'Packages not found'));
            }
            return res.status(200).json(refineResponse(Status.SUCCESS, 'Package fetched successfully', item));
        } catch (error: any) {
            return res.status(500).json({ error: error.message });
        }
    }

    if (req.method == 'PATCH') {
        try {

            const { values } = req.body
            let query: any = {}



            values.forEach((i: any) => {
                const keys = Object.keys(i)
                const value = Object.values(i)[0]

                let tempObj = {}

                keys.forEach((key: string) => {
                    const keyArr = key.split(".")
                    let temp: any = tempObj

                    keyArr.forEach((subKey: string, index: number) => {
                        if (index === keyArr.length - 1) {
                            temp[subKey] = value
                        } else {
                            console.log(subKey)
                            temp[subKey] = temp[subKey] || {}
                            temp = temp[subKey]
                        }

                    })
                })

                query = { ...query, ...tempObj }
            })
            const receiverQuery = query.receiver

            delete query.receiver
            await prisma.package.updateMany({
                where: {
                    id: id,
                    managerId: token!.managerId!
                },

                data: {
                    ...query,
                    receiver: {
                        set: { ...item?.receiver, ...receiverQuery },
                    }
                }
            })

            const updatedPackage = await prisma.package.findFirst({ where: { id: id } })

            return res.status(200).json(refineResponse(Status.SUCCESS, 'Package updated successfully', updatedPackage))

        } catch (error: any) {
            return res.status(500).json(refineResponse(Status.UNEXPECTED_ERROR, error.message))
        }

    }

    if (req.method == 'DELETE') {
        try {
            const item = await prisma.package.deleteMany({ where: { id: req.query.id as string, managerId: token!.managerId } })
            return res.status(200).json(refineResponse(Status.SUCCESS, 'Package deleted successfully', item))
        } catch (error: any) {
            return res.status(500).json(refineResponse(Status.UNEXPECTED_ERROR, error.message))
        }
    }
})