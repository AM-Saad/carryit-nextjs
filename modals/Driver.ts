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
    vehicle?: any // initally null
    documents: any[] // initally empty array
}
