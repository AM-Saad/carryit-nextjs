
import React, { useState, useEffect } from 'react';
import Meta from '@/shared/modals/meta'
import DriverContext from "@/modals/driver_context"
import { toast } from "react-toastify";
import { Status } from '@/shared/modals/Response';
import { sharedRepository } from '@/lib/repositries/driver/';
import { useRouter } from 'next/router';
import { Shipment } from '@/modals/Shipment';

const DriverContext = React.createContext<DriverContext>({

    driverMeta: { loading: true, error: null },
    driver: null,
    fetch_driver: () => Promise.resolve() as any,

    fetcher: (callback: any, isList: boolean = false) => Promise.resolve() as any,
    currentItem: null,
    currentItems: [],
    updater: (callback: any, isList: boolean = false) => Promise.resolve() as any,

    fetchMeta: { loading: false, error: null },
    updateMeta: { loading: false, error: null },

    authenticate: (phone: string, password: string) => Promise.resolve() as any,


})


export const DriverContextProvider: React.FC<{ children: React.ReactNode }> = (props) => {

    const [driverMeta, setDriverMeta] = useState<Meta>({ loading: false, error: null })

    const [fetchMeta, setFetchMeta] = useState<Meta>({ loading: true, error: null })
    const [updateMeta, setUpdateMeta] = useState<Meta>({ loading: false, error: null })
    const [currentItems, setCurrentItems] = useState<Shipment[]>([])
    const [currentItem, setCurrentItem] = useState<Shipment | null>(null)
    const [driver, setDriver] = useState<any>(null)
    const router = useRouter()



    const authenticate = async (phone: string, password: string) => {
        setDriverMeta({ loading: true, error: null })
        try {
            let response = await sharedRepository.login(phone, password)

            if (response.status === Status.DATA_NOT_FOUND || response.status === Status.INVALID_CREDENTIALS) {
                setDriverMeta({ loading: false, error: { message: response.message, code: response.status } })
                return

            }

            localStorage.removeItem('uidjwt')
            localStorage.setItem('didjwt', response.items.token)
            return window.location.href = '/driver/shipments'


        } catch (error) {
            toast.error('Something went wrong')
        }
        setDriverMeta({ loading: false, error: null })
    }

    const fetch_driver = async () => {
        setDriverMeta({ loading: true, error: null })
        try {
            const response = await sharedRepository.fetch_driver()
            console.log(response)
            if (response.status !== Status.SUCCESS) {
                setDriverMeta({ loading: false, error: { message: response.message, code: response.status } })
                toast[response.status != Status.UNEXPECTED_ERROR ? 'info' : 'error'](response.message)
                router.push('/driver/login')

                return
            }
            setDriverMeta({ loading: false, error: null })
            const admin = response.items
            setDriver(admin)
        } catch (error) {
            toast.error('Something went wrong')
        }
    }


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
                toast[status != Status.UNEXPECTED_ERROR ? 'info' : 'error'](message)
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



    useEffect(() => {
        const token = localStorage.getItem('didjwt')
        if (!token) {
            router.push(('/driver/login'))
        }
        if (token) {
            fetch_driver()
        }
    }, []);

    const userCtx = {
        driverMeta,
        driver,
        fetch_driver,

        fetchMeta,

        updateMeta,

        authenticate,
        fetcher,
        updater,
        currentItem,
        currentItems,
    }
    return <DriverContext.Provider value={userCtx}>
        {props.children}
    </DriverContext.Provider>
}

export default DriverContext
