import Layout from '@/components/layout'
import React, { useEffect, useState, useContext } from 'react'
import { useRouter } from 'next/router'
import { vehicleRepository } from '@/lib/repositries'
import { Status } from '@/shared/modals/Response'
import { Error } from '@/shared/modals/Response'
import FetchError from '@/components/shared/Error'
import VehicleFrom from '@/components/admin/vehicle'
import { toast } from "react-toastify";
import AdminContext from '@/stores/admin'


const Vehicle = () => {
  const router = useRouter()
  const { id } = router.query as { id: string }
  const { fetcher, fetchMeta, currentItem, updateMeta, updater, remover } = useContext(AdminContext);
  const { loading, error } = fetchMeta

  const fetch_data = async () => {
    await fetcher(vehicleRepository.fetch_vehicle(id), false)


  }

  const update_partial_vehicle = async (data: any) => {
    await updater(vehicleRepository.update_partial_vehicle(id, data), false)
  }

  const delete_vehicle = async () => {
     await remover((vehicleRepository.delete_vehicle(id)), '/vehicles')

  }


  useEffect(() => {
    id && fetch_data()

  }, [id])

  return (
    <Layout>

      {error !== null && !loading && <FetchError reload={fetch_data} error={error} />}
      {loading && <div>Loading...</div>}
      {!loading && currentItem && <VehicleFrom
        onUpdate={update_partial_vehicle}
        onDelete={delete_vehicle}
        loading={updateMeta.loading}
        vehicle={currentItem} />}

    </Layout>
  )
}

export default Vehicle