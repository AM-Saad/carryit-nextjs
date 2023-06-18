import { fetcher } from "@/lib/utils";
import Response, { Status } from "@/shared/modals/Response";
import { DRIVER_SHIPMENTS_ROUTE } from '@/lib/constants'
import { Package } from "@/modals/Package";


export default class PackageRepository {
    constructor() {

    }
    getToken = () => {
        return window.localStorage.getItem('didjwt')

    }

    fetch_packages: () => Promise<Response<Package[]>> = async () => {

        try {
            const response: Response<Package[]> = await fetcher(DRIVER_SHIPMENTS_ROUTE, {
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
    fetch_package: (id: string) => Promise<Response<Package>> = async (id) => {
        try {
            const response: Response<Package> = await fetcher(`${DRIVER_SHIPMENTS_ROUTE}/${id}`, {
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