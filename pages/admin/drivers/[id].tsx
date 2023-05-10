import Layout from '@/components/layout'
import React, { useContext, useEffect,useCallback  } from 'react'
import { useRouter } from 'next/router'
import DriverFrom from '@/components/admin/driver'
import { Status } from '@/shared/modals/Response'
import { driverRepository } from '@/lib/repositries/admin'
import FetchError from '@/components/shared/Error'
import Loading from '@/components/shared/Loading'
import { toast } from "react-toastify";
import AdminContext from '@/stores/admin'
import { INTERNAL_DRIVERS_ROUTE } from '@/lib/constants'

const Driver = () => {
  const router = useRouter()
  const { id } = router.query as { id: string }
  const { fetcher, fetchMeta, currentItem, updater, updateMeta, remover } = useContext(AdminContext);
  const { loading, error } = fetchMeta


  const fetch_data = useCallback(async () => {
    await fetcher(driverRepository.fetch_driver(id), false)
  },[])


  const update_partial_driver = async (data: any) => {

    await updater(driverRepository.update_partial_driver(id, data), false)

  }


  const delete_driver = async () => {
    await remover(driverRepository.delete_driver(id), INTERNAL_DRIVERS_ROUTE)

  }


  useEffect(() => {
    if (id)
      fetch_data()
  }, [id, fetch_data])

  return (
    <Layout>

      {loading && <Loading />}
      {error && !loading && <FetchError reload={fetch_data} error={error} />}

      {!loading && currentItem && <DriverFrom
        driver={currentItem}
        onUpdate={update_partial_driver}
        loading={updateMeta.loading}
        onDelete={delete_driver}
      />}

    </Layout>
  )
}

export default Driver