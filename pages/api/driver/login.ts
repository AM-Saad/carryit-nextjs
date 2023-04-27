import prisma from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from 'next'

import { getSession } from 'next-auth/react';
import { refineResponse } from 'shared/helpers/refineResponse';
import { Status } from '@/shared/modals/Response';
import jwt from 'jsonwebtoken';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  const { values } = JSON.parse(req.body);
  try {
    // Check if driver exists
    const driver = await prisma.driver.findUnique({
      where: { mobile: values.phone, },
    });

    if (!driver) {
      return res.status(401).json(refineResponse(Status.DATA_NOT_FOUND, 'Data Not Found!'));
    }

    // Check if password is correct
    if (driver.password !== values.password) {
      return res.status(401).json(refineResponse(Status.INVALID_CREDENTIALS, 'Invalid Credentials!'));
    }
    console.log(driver)
    // Create JWT token
    const token = jwt.sign({ driverId: driver.id, company: driver.companyId, adminId: driver.adminId, isAdmin:false, isDriver:true  }, process.env.NEXT_PUBLIC_JWT_SECRET!, {
      expiresIn: '7d',
    });

    return res.status(200).json(refineResponse(Status.SUCCESS, "Login successful", { token }));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}