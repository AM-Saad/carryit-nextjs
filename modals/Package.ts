

export interface PackagePayload {

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
    status?: PackageStatus,
    packageNo?: string,
    total_cost?: number,
    discount?: number
    canceled?: { status: boolean, reason: string },

}


export enum PackageStatus {
    Pending = 0,
    Confirmed = 1,
    Preparing = 2,
    Ready = 3,
    Shipped = 4,
    Delivered = 5,
    Canceled = 6,
}

export const SHIPMENT_STATUS_LABELS = new Map<PackageStatus, string>([
    [PackageStatus.Pending, "Pending"],
    [PackageStatus.Confirmed, "Confirmed"],
    [PackageStatus.Preparing, "Preparing"],
    [PackageStatus.Ready, "Ready"],
    [PackageStatus.Shipped, "Shipped"],
    [PackageStatus.Delivered, "Delivered"],
    [PackageStatus.Canceled, "Canceled"],
]);



export const getPackageStatusColor = (bundleStatus: PackageStatus) => {

    if (bundleStatus === PackageStatus.Pending) {
        return "#FFC107";
    } else if (bundleStatus === PackageStatus.Confirmed) {
        return "#2196F3";
    } else if (bundleStatus === PackageStatus.Preparing) {
        return "#FF9800";
    } else if (bundleStatus === PackageStatus.Ready) {
        return "#4CAF50";
    } else if (bundleStatus === PackageStatus.Shipped) {
        return "#9C27B0";
    } else if (bundleStatus === PackageStatus.Delivered) {
        return "#8BC34A";
    } else {
        return "#F44336";
    }
};

export const getPackageStatus = (bundleStatus: PackageStatus) => {
    console.log(bundleStatus)
    if (bundleStatus === PackageStatus.Pending) {
        return "Pending";
    } else if (bundleStatus === PackageStatus.Confirmed) {
        return "Confirmed";
    } else if (bundleStatus === PackageStatus.Preparing) {
        return "Preparing";
    } else if (bundleStatus === PackageStatus.Ready) {
        return "Ready";
    } else if (bundleStatus === PackageStatus.Shipped) {
        return "Shipped";
    } else if (bundleStatus === PackageStatus.Delivered) {
        return "Delivered";
    } else {
        return "Canceled";
    }
};



export interface Package extends PackagePayload {
    id: string;
}