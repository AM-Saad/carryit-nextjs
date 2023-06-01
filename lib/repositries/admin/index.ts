import DriverRepository from './Driver'
import ShipmentRepository from './Shipment'
import VehicleRepository from './Vehicle'
import Shared from './Shared'
import Branch from './Branch'
import Manager from './Manager'

// create new repositories and export them individually
export const driverRepository = new DriverRepository()
export const shipmentRepository = new ShipmentRepository()
export const vehicleRepository = new VehicleRepository()
export const sharedRepository = new Shared()
export const branchRepository = new Branch()
export const managerRepository = new Manager()