import type { NextApiRequest, NextApiResponse } from 'next'

import { getSession } from 'next-auth/react';
import prisma from '@/lib/prisma'
import { refineResponse } from 'shared/helpers/refineResponse';
import { Status } from '@/shared/modals/Response';
import jwt from 'jsonwebtoken';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  
  if (req.method === 'POST') {
    const { values } = JSON.parse(req.body);

    if (!values.email || !values.name) {
      return refineResponse(Status.INVALID_CREDENTIALS, "Missing email or name");
    }

    try {
      const isExist = await prisma.manager.findFirst({ where: { email: values.email } })
      if (isExist) {
        return res.status(401).json(refineResponse(Status.ALREADY_DONE, 'Email already exist', isExist))
      }

      let company: any = await prisma.company.create({
        data: {
          brand_name: values.name + "'s Company",
          main_email: values.email

        }
      })
      const manager = await prisma.manager.create({
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

      const payload = {
        data: {
          address: '',
          name: 'Main Branch',
          phone: '',
          state: '',
          city: '',
          notes: '',
          governorate: '',
          managerId: manager!.id,
          company: {
            connect: {
              id: manager!.companyId!
            }
          }

        }
      }

      await prisma.branch.create(payload);
      
      // Create JWT token
      const token = jwt.sign({ managerId: manager.id, companyId: manager.companyId, driverId: null, isAdmin: true, isDriver: false, isSuper: manager.isSuper }, process.env.NEXT_PUBLIC_JWT_SECRET!, {
        expiresIn: '7d',
      });

      
      return res.status(200).json(refineResponse(Status.SUCCESS, "Manager created successfully", { admin: manager, token: token }))
    }
    catch (e) {
      console.log(e)
      return res.status(500).json(refineResponse(Status.UNEXPECTED_ERROR, "Error creating manager"))


    }


  }


}

