import DriverContext from '@/stores/driver'
import { useEffect, useContext } from 'react'
import driver from '../api/driver'
import { useRouter } from 'next/router'

const Sso = () => {

    const { fetch_driver, driverMeta, driver } = useContext(DriverContext)

    const router = useRouter()

    useEffect(() => {
        const token = localStorage.getItem('didjwt')
        if (!token) {
            return
        }
        fetch_driver()
    }, [])

    useEffect(() => {
        if (driverMeta.error) {
            localStorage.removeItem('didjwt')
        }
        if (driver) {
            router.push(('/driver/packages'))
        }
    }, [driverMeta.error, driver])

    return (

        <div className='block sm:w-8/12 m-auto p-3'>
            <h1 className='text-center text-lg font-bold'>{driverMeta.loading ? 'Authorization...' : driverMeta.error ? driverMeta.error.message : 'Redirecting...'}</h1>
            <p className='text-center text-gray-700'>Please wait while we authorize you</p>
        </div>

    )
}

export default Sso