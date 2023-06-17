

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
        shipping_address?:any
    };
    items?: { itemId?: string, name?: string, price?: number, quantity?: number }[]
    quantity: number;
    is_fragile: boolean;
    is_liquid: boolean;
    notes: string;
    price: number;
    shipping_cost: number;
    date: Date;
    delivery_date: Date;
    driverId?: string,
    status?: ShipmentStatus,
    shipmentNo?: string,
    total_cost?: number,
    discount?: number
    canceled?: { status: boolean, reason: string },

}


export enum ShipmentStatus {
    Pending = 0,
    Confirmed = 1,
    Preparing = 2,
    Ready = 3,
    Shipped = 4,
    Delivered = 5,
    Canceled = 6,
}

export const SHIPMENT_STATUS_LABELS = new Map<ShipmentStatus, string>([
    [ShipmentStatus.Pending, "Pending"],
    [ShipmentStatus.Confirmed, "Confirmed"],
    [ShipmentStatus.Preparing, "Preparing"],
    [ShipmentStatus.Ready, "Ready"],
    [ShipmentStatus.Shipped, "Shipped"],
    [ShipmentStatus.Delivered, "Delivered"],
    [ShipmentStatus.Canceled, "Canceled"],
]);



export const getShipmentStatusColor = (bundleStatus: ShipmentStatus) => {

    if (bundleStatus === ShipmentStatus.Pending) {
        return "#FFC107";
    } else if (bundleStatus === ShipmentStatus.Confirmed) {
        return "#2196F3";
    } else if (bundleStatus === ShipmentStatus.Preparing) {
        return "#FF9800";
    } else if (bundleStatus === ShipmentStatus.Ready) {
        return "#4CAF50";
    } else if (bundleStatus === ShipmentStatus.Shipped) {
        return "#9C27B0";
    } else if (bundleStatus === ShipmentStatus.Delivered) {
        return "#8BC34A";
    } else {
        return "#F44336";
    }
};

export const getShipmentStatus = (bundleStatus: ShipmentStatus) => {
    console.log(bundleStatus)
    if (bundleStatus === ShipmentStatus.Pending) {
        return "Pending";
    } else if (bundleStatus === ShipmentStatus.Confirmed) {
        return "Confirmed";
    } else if (bundleStatus === ShipmentStatus.Preparing) {
        return "Preparing";
    } else if (bundleStatus === ShipmentStatus.Ready) {
        return "Ready";
    } else if (bundleStatus === ShipmentStatus.Shipped) {
        return "Shipped";
    } else if (bundleStatus === ShipmentStatus.Delivered) {
        return "Delivered";
    } else {
        return "Canceled";
    }
};



export interface Shipment extends ShipmentPayload {
    id: string;
}