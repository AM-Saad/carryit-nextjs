import Layout from '@/components/layout'
import AdminContext from '@/stores/admin'
import { useEffect, useContext } from 'react'
import { useSession } from "next-auth/react";
import { useRouter } from 'next/router'
const Sso = () => {

    const { authenticate, fetch_admin, adminMeta } = useContext(AdminContext)
    const { data: session, status } = useSession()
    const router = useRouter()
    const fetch_data = async () => {
        await authenticate(session?.user?.email!, session?.user?.name!)
        await fetch_admin()
        router.push('/admin/dashboard')


    }
    useEffect(() => {
        if (session) {
            fetch_data()
        }
    }, [session])

    return (

        <div className='block sm:w-8/12 m-auto p-3'>
            <h1 className='text-center text-lg font-bold'>Authorization</h1>
            <p className='text-center text-gray-700'>Please wait while we redirect you</p>
        </div>

    )
}

export default Sso