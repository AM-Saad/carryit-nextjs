import DriverRepository from './Driver'
import ShipmentRepository from './Shipment'
import VehicleRepository from './Vehicle'
import Shared from './Shared'

// create new repositories and export them individually
export const driverRepository = new DriverRepository()
export const shipmentRepository = new ShipmentRepository()
export const vehicleRepository = new VehicleRepository()
export const sharedRepository = new Shared()
