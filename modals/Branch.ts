
export default interface Branch {
    id?: string
    name: string
    notes?: string
    managerId?: string
    companyId?: string
    drivers?: string[]
    vehicles?: string[]
    address?: string

    phone?: string
    governorate?: string
    city?: string
    state?: string
    createdAt?: string
}
