import Vehicle from "./Vehicle"

export default interface Driver {
    id: string
    address: string
    commission: any[]
    image: string // initally empty string
    mobile: string
    name: string
    password: string
    salary: {base_salary: number, commission:number}
    shipments: any[] // initally empty array
    vehicle?: Vehicle | null // initally null
    documents: any[] // initally empty array
    vehicleId?: string // initally null
}
