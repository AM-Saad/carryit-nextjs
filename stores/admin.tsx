
import React, { useState, useEffect } from 'react';
import Meta from '@/shared/modals/meta'
import AdminContext from "@/modals/admin_context"
import { toast } from "react-toastify";
import { Status } from '@/shared/modals/Response';
import { sharedRepository, driverRepository, vehicleRepository, shipmentRepository } from '@/lib/repositries';
import { useRouter } from 'next/router';

const AdminContext = React.createContext<AdminContext>({

    adminMeta: { loading: false, error: null },
    admin: null,
    fetch_admin: () => Promise.resolve() as any,

    fetcher: (callback: any, isList: boolean = false) => Promise.resolve() as any,
    currentItem: null,
    currentItems: [],
    updater: (callback: any, isList: boolean = false) => Promise.resolve() as any,
    remover: (callback: any, redirectUrl: string) => Promise.resolve() as any,

    fetchMeta: { loading: false, error: null },
    updateMeta: { loading: false, error: null },

    authenticate: (email: string, name: string) => Promise.resolve() as any,

})


export const AdminContextProvider: React.FC<{ children: React.ReactNode }> = (props) => {

    const [adminMeta, setAdminMeta] = useState<Meta>({ loading: false, error: null })

    const [currentItems, setCurrentItems] = useState<any>([])
    const [currentItem, setCurrentItem] = useState<any>(null)
    const [fetchMeta, setFetchMeta] = useState<Meta>({ loading: true, error: null })
    const [updateMeta, setUpdateMeta] = useState<Meta>({ loading: false, error: null })
    const [admin, setAdmin] = useState<any>(null)
    const router = useRouter()

    const fetcher = async (callback: any, isList: boolean = false): Promise<void | boolean> => {
        setFetchMeta({ loading: true, error: null })
        setCurrentItem(null)
        setCurrentItems([])
        try {
            const { status, message, items } = await callback
            if (status != Status.SUCCESS) {
                setFetchMeta({ loading: false, error: { code: status, message } })
                return false
            }

            setFetchMeta({ loading: false, error: null })
            isList ? setCurrentItems(items) : setCurrentItem(items)
            return true
        } catch (error) {

            setFetchMeta({ loading: false, error: { code: Status.UNEXPECTED_ERROR, message: 'Something went wrong' } })
        }

    }

    const updater = async (callback: any, isList: boolean = false): Promise<void | boolean> => {
        setUpdateMeta({ loading: true, error: null })
        try {
            const { status, message, items } = await callback
            if (status != Status.SUCCESS) {
                setUpdateMeta({ loading: false, error: { code: status, message } })
                toast.error(message)
                return false
            }

            setUpdateMeta({ loading: false, error: null })
            setCurrentItem(items)
            return true
        } catch (error) {
            setUpdateMeta({ loading: false, error: { code: Status.UNEXPECTED_ERROR, message: 'Something went wrong' } })
            toast.error('Something went wrong')
            return false
        }

    }
    const remover = async (callback: any, redirectUrl: string): Promise<void> => {
        setUpdateMeta({ loading: true, error: null })
        try {
            const { status, message, items } = await callback
            if (status != Status.SUCCESS) {
                setUpdateMeta({ loading: false, error: { code: status, message } })
                toast.error(message)
                return
            }
            router.push(redirectUrl)
            setUpdateMeta({ loading: false, error: null })

        } catch (error) {
            setUpdateMeta({ loading: false, error: { code: Status.UNEXPECTED_ERROR, message: 'Something went wrong' } })
            toast.error('Something went wrong')
        }

    }

    const authenticate = async (email: string, name: string) => {
        setAdminMeta({ loading: true, error: null })
        try {
            let response = await sharedRepository.login(email)

            if (response.status === Status.DATA_NOT_FOUND) {
                 response = await sharedRepository.create_admin(email, name)
            } else {
                if (response.status !== Status.SUCCESS) {
                    toast.error(response.message)
                    router.push('/')
                    return
                }
            }
            localStorage.setItem('uidjwt', response.items.token)
            router.push('/dashboard')
            return
        } catch (error) {
            toast.error('Something went wrong')
        }
        setAdminMeta({ loading: false, error: null })
    }

    const fetch_admin  = async () => {
        setAdminMeta({ loading: true, error: null })
        try {
            const response = await sharedRepository.fetch_admin()
            if (response.status !== Status.SUCCESS) {
                toast.error(response.message)
                return
            }
            const admin = response.items
            setAdmin(admin)
        } catch (error) {
            toast.error('Something went wrong')
        }
        setAdminMeta({ loading: false, error: null })
    }

    const update_partial_driver = async (id: string, data: any) => {
        setUpdateMeta({ loading: true, error: null })
        try {
            const { status, message } = await driverRepository.update_partial_driver(id, data)
            if (status != Status.SUCCESS) {
                // setUpdateMeta({ loading: false, error: message })
                toast.error(message)
                return
            }
            setUpdateMeta({ loading: false, error: null })
            // setDriver(data)
        } catch (error) {
            toast.error('Something went wrong')

        }
    }




    useEffect(() => {

    }, [])

    const userCtx = {
        adminMeta,
        admin,
        fetch_admin,
        fetcher,
        currentItem,
        currentItems,
        updater,

        fetchMeta,

        updateMeta,
        remover,

        authenticate
    }
    return <AdminContext.Provider value={userCtx}>
        {props.children}
    </AdminContext.Provider>
}

export default AdminContext
