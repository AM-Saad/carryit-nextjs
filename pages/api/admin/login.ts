import prisma from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from 'next'

import { getSession } from 'next-auth/react';
import { refineResponse } from 'shared/helpers/refineResponse';
import { Status } from '@/shared/modals/Response';
import jwt from 'jsonwebtoken';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  const { values } = JSON.parse(req.body);
  console.log(values)

  try {
    // Check if admin exists
    const admin = await prisma.admin.findUnique({
      where: { email: values.email },
    });

    if (!admin) {
      return res.status(401).json(refineResponse(Status.DATA_NOT_FOUND, 'Data Not Found!'));
    }

    // Create JWT token
    const token = jwt.sign({ sub: admin.id, company: admin.companyId }, process.env.NEXT_PUBLIC_JWT_SECRET!, {
      expiresIn: '7d',
    });

    return res.status(200).json(refineResponse(Status.SUCCESS, "Login successful", { token }));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}