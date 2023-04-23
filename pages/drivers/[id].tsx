import Layout from '@/components/layout'
import React, { useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import DriverFrom from '@/components/admin/driver'
import Response, { Status } from '@/shared/modals/Response'
import { driverRepository } from '@/lib/repositries/index'
import FetchError from '@/components/shared/Error'
import Loading from '@/components/shared/Loading'
import { toast } from "react-toastify";
import AdminContext from '@/stores/admin'

const Driver = () => {
  const router = useRouter()
  const { id } = router.query as { id: string }
  const [updating, setUpdating] = useState<boolean>(false)

  const { fetcher, fetchMeta, currentItem } = useContext(AdminContext);
  const { loading, error } = fetchMeta

  const fetch_data = async () => {
    await fetcher(driverRepository.fetch_driver(id), false)

  }


  const update_partial_driver = async (data: any) => {
    setUpdating(true)
    const res: Response = await driverRepository.update_partial_driver(id, data)
    setUpdating(false)
    if (res.status !== Status.SUCCESS) {
      return toast.error(res.message)
    }
    // setDriver(res.items)


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
      fetch_data()
  }, [id])

  return (
    <Layout>

      {loading && <Loading />}
      {error && !loading && <FetchError reload={fetch_data} error={error} />}

      {!loading && currentItem && <DriverFrom
        driver={currentItem}
        onUpdate={update_partial_driver}
        loading={updating}
        onDelete={delete_driver}
      />}

    </Layout>
  )
}

export default Driver