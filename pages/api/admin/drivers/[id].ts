import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react';
import prisma from '../../../../lib/prisma'
import { refineResponse } from 'shared/helpers/refineResponse';
import  { Status } from 'shared/models/Response';
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    if (req.method == 'GET') {

        try {
            const drivers = await prisma.driver.findFirst({ where: { id: req.query.id as string } });
            if (!drivers) {
                return res.status(404).json(refineResponse(Status.DATA_NOT_FOUND, 'drivers not found'));
            }
            return res.status(200).json(refineResponse(Status.SUCCESS, 'drivers fetched successfully', drivers));
        } catch (error: any) {

            return res.status(500).json(refineResponse(Status.UNEXPECTED_ERROR, error.message));
        }
    }


    if (req.method == 'PATCH') {
        try {
            const { values } = JSON.parse(req.body);
            let query: any = {}

            values.forEach((i: any) => {
                const vals = Object.values(i)
                const keys = Object.keys(i)
                if (!query.hasOwnProperty(keys[0])) {
                    query[keys[0]] = vals[0]
                }
            })
            const item = await prisma.driver.update({ where: { id: req.query.id as string }, data: query })

            return res.status(200).json(refineResponse(Status.SUCCESS, 'Driver updated successfully', item))

        } catch (error:any) {
            return res.status(500).json(refineResponse(Status.UNEXPECTED_ERROR, error.message))
        }

    }

    if (req.method == 'DELETE') {
        try {
            const item = await prisma.driver.delete({ where: { id: req.query.id as string } })
            return res.status(200).json(refineResponse(Status.SUCCESS, 'Driver deleted successfully', item))
        } catch (error:any) {
            return res.status(500).json(refineResponse(Status.UNEXPECTED_ERROR, error.message))
        }
    }


}