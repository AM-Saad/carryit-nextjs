import { fetcher } from "@/lib/utils";
import Response, { Status } from "@/shared/modals/Response";
import { DRIVER_SHIPMENTS_ROUTE } from '@/lib/constants'
import { Shipment } from "@/modals/Shipment";


export default class ShipmentRepository {
    constructor() {

    }
    getToken = () => {
        return window.localStorage.getItem('didjwt')

    }

    fetch_shipments: () => Promise<Response<Shipment[]>> = async () => {

        try {
            const response: Response<Shipment[]> = await fetcher(DRIVER_SHIPMENTS_ROUTE, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${this.getToken()}`,
                    "Content-Type": "application/json"
                }
            });
            return response

        } catch (error: any) {
            return {
                message: error.message,
                status: Status.UNEXPECTED_ERROR,
                items: []
            }

        }
    }
    fetch_shipment: (id: string) => Promise<Response<Shipment>> = async (id) => {
        try {
            const response: Response<Shipment> = await fetcher(`${DRIVER_SHIPMENTS_ROUTE}/${id}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${this.getToken()}`,
                    "Content-Type": "application/json"
                }
            });
            return response

        } catch (error: any) {
            return {
                message: error.message,
                status: Status.UNEXPECTED_ERROR,
                items: []
            }

        }
    }





}