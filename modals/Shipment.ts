

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
        is_villa:boolean

    };
    quantity: number;
    is_fragile: boolean;
    is_liquid: boolean;
    notes: string;
    price: number;
    shipping_cost: number;
    date: Date;
    delivery_date: Date;

}

export interface Shipment extends ShipmentPayload {
    id: string;
}