import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react';
import prisma from '../../../../lib/prisma'
import { refineResponse } from 'shared/helpers/refineResponse';
import { Status } from '@/shared/modals/Response';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    let shipment
    if (req.method === 'GET' || req.method === 'PATCH') {
         shipment = await prisma.shipment.findFirst({ where: { id: req.query.id as string } });

    }
    if (req.method === 'GET') {

        try {
            if (!shipment) {
                return res.status(404).json(refineResponse(Status.DATA_NOT_FOUND, 'shipments not found'));
            }
            return res.status(200).json(refineResponse(Status.SUCCESS, 'Shipment fetched successfully', shipment));
        } catch (error: any) {
            return res.status(500).json({ error: error.message });
        }
    }

    if (req.method == 'PATCH') {
        try {

            const { values } = JSON.parse(req.body);
            console.log(values)
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
                            console.log(subKey )
                            temp[subKey] = temp[subKey] || {}
                            temp = temp[subKey]
                        }

                    })
                })

                query = { ...query, ...tempObj }
            })

            const newShipment = {...shipment, ...query}

            const id = req.query.id as string
            // const item = await prisma.shipment.update({
            //     where: {
            //         id: id
            //     },

            //     data: {
            //         receiver: {

            //         }
            //     }
            // })

            // return res.status(200).json(refineResponse(Status.SUCCESS, 'Shipment updated successfully', item))

        } catch (error: any) {
            return res.status(500).json(refineResponse(Status.UNEXPECTED_ERROR, error.message))
        }

    }

    if (req.method == 'DELETE') {
        try {
            const item = await prisma.shipment.delete({ where: { id: req.query.id as string } })
            return res.status(200).json(refineResponse(Status.SUCCESS, 'Shipment deleted successfully', item))
        } catch (error: any) {
            return res.status(500).json(refineResponse(Status.UNEXPECTED_ERROR, error.message))
        }
    }
}