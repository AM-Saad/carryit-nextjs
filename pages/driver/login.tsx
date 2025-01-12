import { useContext, useEffect, useState } from 'react'
import Layout from '@/components/layout/driver'
import Form from '@/components/driver/auth'
import DriverContext from '@/stores/driver'
import { useRouter } from 'next/router'

const Login = () => {
  const { authenticate, driverMeta,driver } = useContext(DriverContext)
  const router = useRouter()

  useEffect(() => {
    console.log(router.pathname)
    if(router.pathname === '/driver/login' && driver){
      router.push('/driver/packages')
    }
  }, [driver]);

  
  return (
    <Layout
      meta={{
        title: "Driver Login",
        description: "Welcome to the ultimate logistics solution for brands! Our powerful SaaS platform makes it easy to manage your packages and drivers, assign deliveries with just a few clicks, and track your packages in real-time. Our system offers unparalleled transparency and visibility to both you and your customers, ensuring that everyone knows exactly where their package is at all times. With our automated driver assignment system and smart routing algorithms, deliveries are faster and more efficient than ever before. Say goodbye to headaches and delays, and hello to seamless logistics management with our app. Sign up today and streamline your logistics operations like never before!",
        keywords: "Karry, Track Package, Package Tracking, Track Package Online, Driver tracking, Delivery tracking ,Real-time location tracking, Order status, Package delivery tracking,  Restaurant delivery tracking "
      }}
    >
     <div>
        <h1 className='font-medium text-xl mb-5'>Login</h1>
        <Form onSubmit={authenticate} loading={driverMeta.loading} error={driverMeta.error?.message} />
      </div>
    </Layout>
  )
}

export default Login