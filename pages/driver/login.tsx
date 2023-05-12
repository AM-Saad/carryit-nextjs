import { useContext, useEffect, useState } from 'react'
import Layout from '@/components/layout/driver'
import Form from '@/components/driver/auth'
import DriverContext from '@/stores/driver'
import { useRouter } from 'next/router'

const Login = () => {
  const { authenticate, driverMeta } = useContext(DriverContext)
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(true)
  useEffect(() => {
    const token = localStorage.getItem('didjwt')
    if (!token) {
      setIsAuthenticated(false)
      return
    }
    router.push(('/driver/shipments'))
  }, []);
  return (
    <Layout>
      {!isAuthenticated && <div>
        <h1>Login</h1>
        <Form onSubmit={authenticate} loading={driverMeta.loading} error={driverMeta.error?.message} />
      </div>}
    </Layout>
  )
}

export default Login