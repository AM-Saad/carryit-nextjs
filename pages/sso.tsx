import Layout from '@/components/layout'
import AdminContext from '@/stores/admin'
import { useEffect, useContext } from 'react'
import { useSession } from "next-auth/react";

const Sso = () => {

    const { authenticate, adminMeta } = useContext(AdminContext)
    const { data: session, status } = useSession()


    useEffect(() => {
        if(session){
            console.log(session)
            authenticate(session?.user?.email!, session?.user?.name!)
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