import Layout from '@/components/layout'
import React, { useEffect, useContext, useCallback } from 'react'
import { useRouter } from 'next/router'
import { vehicleRepository } from '@/lib/repositries/admin'
import FetchError from '@/components/shared/Error'
import VehicleFrom from '@/components/admin/vehicle'
import AdminContext from '@/stores/admin'
import { INTERNAL_VEHICLES_ROUTE } from '@/lib/constants'
import withAuth from '@/components/shared/auth';


const Vehicle = () => {
  const router = useRouter()
  const { id } = router.query as { id: string }
  const { fetcher, fetchMeta, currentItem, updateMeta, updater, remover } = useContext(AdminContext);
  const { loading, error } = fetchMeta

  const fetch_data = useCallback(async () => {

    await fetcher(vehicleRepository.fetch_vehicle(id), false)

  }, [id])


  const update_partial_vehicle = async (data: any) => {
    await updater(vehicleRepository.update_partial_vehicle(id, data), false)
  }

  const delete_vehicle = async () => {
    await remover((vehicleRepository.delete_vehicle(id)), INTERNAL_VEHICLES_ROUTE)

  }


  useEffect(() => {
    if (id) {
      fetch_data()
    }

  }, [id])

  return (
    <Layout>

      {(error && !loading) && <FetchError reload={fetch_data} error={error} />}
      {(loading && error) && <div>Loading...</div>}

      {(!loading && currentItem) &&
        <VehicleFrom
          onUpdate={update_partial_vehicle}
          onDelete={delete_vehicle}
          loading={updateMeta.loading}
          vehicle={currentItem} />
      }

    </Layout>
  )
}

export default withAuth(Vehicle)