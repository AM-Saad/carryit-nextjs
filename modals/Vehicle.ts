
export default interface Vehicle {
    id: string;
    name: string;
    active: boolean;
    managerId: number | string
    fuel_tank: FuelTank | null;
    fuel_type: FuelTypes;
    gas_history: { cost: number, amount: number, date: string }[];
    maintenance_history: { amount: number, type?: string, date: string, description: string, done?: boolean }[];
    mileage: number; // in km
    driver: { name: string, id: string | number } | null;
    vehicle_type: VehicleTypes
    plate_number: string;
    model: string;
    documents: any[];

}
export interface VehiclePayload {
    name: string | null;
    active: boolean;
    vehicle_type: VehicleTypes | null;
    plate_number: string | null;
    model: string | null;
    fuel_type?: FuelTypes | null;
    fuel_tank?: FuelTank | null;

}
export type FuelTank = {
    full_capacity: number,
    unit: string
    cost_per_unit: number
}









export enum FuelTypes {
    GAS = 'Gasoline',
    DIESEL = 'Diesel',
    ELECTRIC = 'Electricity',
    HYBRID = 'Hybrid',
    OTHER = 'Other'
}


export enum VehicleTypes {
    CAR = 'Car',
    TRUCK = 'Truck',
    MOTORCYCLE = 'Motorcycle',
    Van = 'Van',
    Bicycle = 'Bicycle',
    Other = 'Other'
}



export enum FuelUnits {
    GAS= 'Gallons / Liters',
    DIESEL= 'Gallons / Liters',
    ELECTRIC= 'Kilowatt-hours',
    HYBRID= 'Gallons / Liters',
    OTHER= 'Units'
};

export const getFuelUnit = (
    type: FuelTypes | undefined | null
  ) => {
        switch (type) {
        case FuelTypes.GAS:
            return FuelUnits.GAS;
        case FuelTypes.DIESEL:
            return FuelUnits.DIESEL;
        case FuelTypes.ELECTRIC:
            return FuelUnits.ELECTRIC;
        case FuelTypes.HYBRID:
            return FuelUnits.HYBRID;
        case FuelTypes.OTHER:
            return FuelUnits.OTHER;
        default:
            return FuelUnits.OTHER;
    }
  };
  



export const fuelTypesArray: string[] = [
    FuelTypes.GAS,
    FuelTypes.DIESEL,
    FuelTypes.ELECTRIC,
    FuelTypes.HYBRID,
    FuelTypes.OTHER,
];

export const vehicleTypesArray = [
    VehicleTypes.CAR,
    VehicleTypes.TRUCK,
    VehicleTypes.MOTORCYCLE,
    VehicleTypes.Van,
    VehicleTypes.Bicycle,
    VehicleTypes.Other,
];


export const validateVehicle = (vehicle: VehiclePayload) => {
    const errors: string[] = [];
    if (!vehicle.name) {
        errors.push('Name is required');
    }
    if (!vehicle.vehicle_type) {
        errors.push('Vehicle Type is required');
    }
    if (!vehicle.plate_number) {

        errors.push('Plate Number is required');
    }
    if (!vehicle.model) {
        errors.push('Model is required');
    }
    return errors;

}

