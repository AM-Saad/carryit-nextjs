import type { NextApiRequest, NextApiResponse } from 'next'

import { getSession } from 'next-auth/react';
import prisma from '../../../lib/prisma'
import { refineResponse } from 'shared/helpers/refineResponse';
import { Status } from '@/shared/modals/Response';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    if (req.method === 'POST') {
        const { values } = JSON.parse(req.body);

        if (!values.email || !values.name) {
            return refineResponse(Status.INVALID_CREDENTIALS, "Missing email or name");
        }

        try {
            const isExist = await prisma.admin.findFirst({ where: { email: values.email } })
            console.log(isExist)
            if (isExist) {
                return res.status(401).json(refineResponse(Status.ALREADY_DONE, 'Email already exist', isExist))
            }

            let company: any = await prisma.company.create({
                data: {
                    brand_name: values.name + "'s Company",
                    main_email: values.email

                }
            })
            const admin = await prisma.admin.create({
                data: {
                  email: values.email,
                  name: values.name,
                  isSuper: true,
                  company: {
                    connect: {
                      id: company.id
                    }
                  }
                }
              })
          
            const updatedCompany =await prisma.company.update({
                where: { id: company.id },
                data: {
                  adminsIds: {
                    push: admin.id
                  }
                }
              })
              console.log(updatedCompany)

            return res.status(200).json(refineResponse(Status.SUCCESS, "Admin created successfully", admin))
        }
        catch (e) {
            console.log(e)
            return res.status(500).json(refineResponse(Status.UNEXPECTED_ERROR, "Error creating admin"))


        }


    }


}

