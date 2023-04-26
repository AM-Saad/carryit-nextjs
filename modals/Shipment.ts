

export interface ShipmentPayload {

    receiver: {
        address: string;
        apartment: string;
        building: string;
        floor: string;
        name: string;
        phone: string;
        zip?: string;
        city?: string;
        state?: string;
        is_villa?: boolean

    };
    quantity: number;
    is_fragile: boolean;
    is_liquid: boolean;
    notes: string;
    price: number;
    shipping_cost: number;
    date: Date;
    delivery_date: Date;
    driverId?: string,
    status?: number,
}


export enum ShipmentStatus {
    Pending = 0,
    Confirmed = 1,
    Preparing = 2,
    Shipped = 3,
    Delivered = 4,
    Canceled = 5,
}

export const ORDER_STATUS_LABELS = new Map<ShipmentStatus, string>([
    [ShipmentStatus.Pending, "Pending"],
    [ShipmentStatus.Confirmed, "Confirmed"],
    [ShipmentStatus.Preparing, "Preparing"],
    [ShipmentStatus.Shipped, "Shipped"],
    [ShipmentStatus.Delivered, "Delivered"],
    [ShipmentStatus.Canceled, "Canceled"],
]);

export const getShipmentStatusColor = (bundleStatus: ShipmentStatus) => {

    if (bundleStatus === ShipmentStatus.Pending) {
        return "gray";
    } else if (bundleStatus === ShipmentStatus.Confirmed) {
        return "purple";
    } else if (bundleStatus === ShipmentStatus.Preparing) {
        return "yellow";
    } else if (bundleStatus === ShipmentStatus.Shipped) {
        return "orange";
    } else if (bundleStatus === ShipmentStatus.Delivered) {
        return "green";
    } else {
        return "red";
    }
};

export const getShipmentStatus = (bundleStatus: ShipmentStatus) => {
    if (bundleStatus === ShipmentStatus.Pending) {
        return ShipmentStatus.Pending;
    } else if (bundleStatus === ShipmentStatus.Confirmed) {
        return ShipmentStatus.Confirmed;
    } else if (bundleStatus === ShipmentStatus.Preparing) {
        return ShipmentStatus.Preparing;
    } else if (bundleStatus === ShipmentStatus.Shipped) {
        return ShipmentStatus.Shipped;
    } else if (bundleStatus === ShipmentStatus.Delivered) {
        return ShipmentStatus.Delivered;
    } else {
        return "red";
    }
};



export interface Shipment extends ShipmentPayload {
    id: string;
}