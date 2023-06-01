
import { Shipment } from "./Shipment";
import Vehicle from "./Vehicle";


interface ManagerCreate {
    name: string;
    email?: string;
    mobile: string;
    password: string;
    role?: string;
    isSuper: boolean;
    companyId: string;
    branchId: string;
    createdAt: Date;
    updatedAt: Date;
    vehicles: Vehicle[];
    shipments: Shipment[];
    
}
export interface Manager extends ManagerCreate {
    id: string;
}

export default Manager;