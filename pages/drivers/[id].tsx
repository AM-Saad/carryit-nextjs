import Layout from '@/components/layout'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import DriverFrom from '@/components/admin/driver'
import Response, { Status } from 'shared/models/Response'
import { driverRepository } from '@/lib/repositries/index'
import FetchError from '@/components/shared/Error'
import Loading from '@/components/shared/Loading'
import { toast } from "react-toastify";

const Driver = () => {
  const router = useRouter()
  const { id } = router.query as { id: string }
  const [driver, setDriver] = useState<any>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [updating, setUpdating] = useState<boolean>(false)
  const [error, setError] = useState<string>('')

  const fetch_driver = async () => {
    setLoading(true)
    const { status, items, message }: Response = await driverRepository.fetch_driver(id)
    setLoading(false)
    status === Status.SUCCESS && setDriver(items)
    status !== Status.SUCCESS && setError(message)
  }

  const update_partial_driver = async (data: any) => {
    setUpdating(true)
    const res: Response = await driverRepository.update_partial_driver(id, data)
    setUpdating(false)
    if (res.status !== Status.SUCCESS) {
      return toast.error(res.message)
    }
    setDriver(res.items)


  }
  const delete_driver = async () => {
    setUpdating(true)
    const res = await driverRepository.delete_driver(id)
    setUpdating(false)
    if (res.status !== Status.SUCCESS) {
      return toast.error(res.message)
    }
    res.status === Status.SUCCESS && router.push('/drivers')
  }

  useEffect(() => {
    if (id)
      fetch_driver()
  }, [id])

  return (
    <Layout>
      <div className='border-2 border-black h-full md:w-8/12 p-3 rounded-xl w-full xl:p-5'>

        {loading && <Loading />}
        {error && !loading && <FetchError reload={fetch_driver} error={{ message: error, code: Status.UNEXPECTED_ERROR }} />}

        {!loading && driver && <DriverFrom
          driver={driver}
          onUpdate={update_partial_driver}
          loading={updating}
          onDelete={delete_driver}
        />}
      </div>

    </Layout>
  )
}

export default Driver