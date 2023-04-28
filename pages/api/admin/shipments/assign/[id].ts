import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/lib/prisma'
import { refineResponse } from 'shared/helpers/refineResponse';
import { Status } from '@/shared/modals/Response';
import { authMiddleware, Token } from '@/middleware/auth';
import { ShipmentStatus } from '@/modals/Shipment';
import { ObjectId } from 'mongodb';
export default authMiddleware(async (req: NextApiRequest, res: NextApiResponse, token: Token) => {

    if (req.method !== 'PUT') {
        return res.status(405).json(refineResponse(Status.UNHANDLED_SCENARIO, 'Method not allowed'));
    }

    const { id, driverId } = req.query;

    if (!id || !driverId) {
        return res.status(400).json(refineResponse(Status.INVALID_PARAMETER, 'Invalid parameter'));
    }
    const shipment = await prisma.shipment.findFirst({ where: { id: id as string, adminId: token.adminId } });
    const driver = await prisma.driver.findFirst({ where: { id: driverId as string, adminId: token.adminId } })
    try {
        if (!shipment || !driver) {
            return res.status(404).json(refineResponse(Status.DATA_NOT_FOUND, 'Data not found'));
        }

        if (shipment.status === ShipmentStatus.Delivered) {
            return res.status(400).json(refineResponse(Status.ALREADY_DONE, 'Shipment is already delivered'));
        }

        // Check if shipment is already assigned to this driver
        if (shipment.driverId === driverId) {
            return res.status(400).json(refineResponse(Status.ALREADY_DONE, 'Shipment is already assigned to this driver'));
        }


        // Remove shipment from previous driver
        if (shipment.driverId !== null) {
            const currentDriver = await prisma.driver.findFirst({ where: { id: shipment.driverId as string, adminId: token.adminId } })
            const driverShipments = currentDriver?.shipments.filter(shipment => shipment.shipmentId !== id as string);
            await prisma.driver.update({
                where: { id: shipment.driverId as string },
                data: {
                    shipments: driverShipments
                }

            })

        }

        // Assign shipment to driver
        await prisma.shipment.update({
            where: { id: id as string },
            data: {
                driverId: driverId as string,
            }
        })

        // Add shipment to driver shipments
        const updateShipment = await prisma.shipment.findFirst({ where: { id: id as string, adminId: token.adminId } });
        const driverShipments = [...driver.shipments, { id: (new ObjectId()).toString(), shipmentId: updateShipment?.id!, shipmentNo: updateShipment?.shipmentNo! }]
        await prisma.driver.update({
            where: { id: driverId as string },
            data: {
                shipments: driverShipments
            }

        })

        return res.status(200).json(refineResponse(Status.SUCCESS, 'Shipment assigned successfully', updateShipment));

    } catch (error: any) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }




})