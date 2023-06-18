import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react';
import prisma from '@/lib/prisma'
import { refineResponse } from 'shared/helpers/refineResponse';
import { Status } from '@/shared/modals/Response';
import { PackageStatus } from '@/modals/Package';


export default async function handle(req: NextApiRequest, res: NextApiResponse<any>) {
    const no = req.query.no as string
    if(req.method !== 'GET'){
        return res.status(401).json(refineResponse(Status.INVALID_CREDENTIALS, 'Method Not Allowed'))
    }
    if (req.method === 'GET') {
        const package = await prisma.package.findFirst({ where: { packageNo: no as string } });

        try {
            if (!package) {
                return res.status(404).json(refineResponse(Status.DATA_NOT_FOUND, 'Package Not Found!!'));
            }
            if(package.status !== PackageStatus.Shipped)
            {
                return res.status(401).json(refineResponse(Status.UNHANDLED_SCENARIO, 'Package Not Shipped Yet.'))
            }
            return res.status(200).json(refineResponse(Status.SUCCESS, 'Package fetched successfully', package));
        } catch (error: any) {
            return res.status(500).json({ error: error.message });
        }
    }


}