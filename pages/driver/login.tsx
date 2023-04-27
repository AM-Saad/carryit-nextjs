import { useContext } from 'react'
import Layout from '@/components/layout/driver'
import Form from '@/components/driver/auth'
import DriverContext from '@/stores/driver'

const Login = () => {

  const { authenticate, driverMeta } = useContext(DriverContext)

  return (
    <Layout>
      <div>
        <h1>Login</h1>
        <Form onSubmit={authenticate} loading={driverMeta.loading} error={driverMeta.error?.message} />
      </div>
    </Layout>
  )
}

export default Login