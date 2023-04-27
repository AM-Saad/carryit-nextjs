
import React, { useState, useEffect } from 'react';
import Meta from '@/shared/modals/meta'
import DriverContext from "@/modals/driver_context"
import { toast } from "react-toastify";
import { Status } from '@/shared/modals/Response';
import { sharedRepository } from '@/lib/repositries/driver/';
import { useRouter } from 'next/router';

const DriverContext = React.createContext<DriverContext>({

    driverMeta: { loading: false, error: null },
    driver: null,
    fetch_driver: () => Promise.resolve() as any,


    fetchMeta: { loading: false, error: null },
    updateMeta: { loading: false, error: null },

    authenticate: (phone: string, password: string) => Promise.resolve() as any,


})


export const DriverContextProvider: React.FC<{ children: React.ReactNode }> = (props) => {

    const [driverMeta, setDriverMeta] = useState<Meta>({ loading: false, error: null })

    const [fetchMeta, setFetchMeta] = useState<Meta>({ loading: true, error: null })
    const [updateMeta, setUpdateMeta] = useState<Meta>({ loading: false, error: null })
    const [driver, setDriver] = useState<any>(null)
    const router = useRouter()

   

    const authenticate = async (phone: string, password: string) => {
        setDriverMeta({ loading: true, error: null }) 
        try {
            let response = await sharedRepository.login(phone, password)

            if (response.status === Status.DATA_NOT_FOUND || response.status === Status.INVALID_CREDENTIALS) {
                setDriverMeta({ loading: false, error: {message: response.message,  code: response.status}})
                return
            
            }
         
            localStorage.setItem('didjwt', response.items.token)
            router.push('/driver/dashboard')
            return
        } catch (error) {
            toast.error('Something went wrong')
        }
        setDriverMeta({ loading: false, error: null })
    }

    const fetch_driver  = async () => {
        setDriverMeta({ loading: true, error: null })
        try {
            const response = await sharedRepository.fetch_driver()
            if (response.status !== Status.SUCCESS) {
                toast.error(response.message)
                return
            }
            const admin = response.items
            setDriver(admin)
        } catch (error) {
            toast.error('Something went wrong')
        }
        setDriverMeta({ loading: false, error: null })
    }




    useEffect(() => {

    }, [])

    const userCtx = {
        driverMeta,
        driver,
        fetch_driver,

        fetchMeta,

        updateMeta,

        authenticate
    }
    return <DriverContext.Provider value={userCtx}>
        {props.children}
    </DriverContext.Provider>
}

export default DriverContext
