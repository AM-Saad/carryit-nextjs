import DriverRepository from './Driver'
import PackageRepository from './Package'
import VehicleRepository from './Vehicle'
import Shared from './Shared'
import Branch from './Branch'
import Manager from './Manager'

// create new repositories and export them individually
export const driverRepository = new DriverRepository()
export const packageRepository = new PackageRepository()
export const vehicleRepository = new VehicleRepository()
export const sharedRepository = new Shared()
export const branchRepository = new Branch()
export const managerRepository = new Manager()

// Path: lib/repositries/admin/Driver.ts
