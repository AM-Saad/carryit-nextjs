import Layout from '@/components/layout'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { vehicleRepository } from '@/lib/repositries'
import { Status } from '@/shared/models/Response'
import {Error} from '@/shared/models/Response'
import FetchError from '@/components/shared/Error'
import VehicleFrom from '@/components/admin/vehicle'
import { toast } from "react-toastify";

const Vehicles = () => {
  const router = useRouter()
  const { id } = router.query as { id: string }
  const [vehicle, setVehicle] = useState(null)
  const [loading, setLoading] = useState(false)
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const fetch_vehicle = async () => {
    setLoading(true)
    const res = await vehicleRepository.fetch_vehicle(id)
    setLoading(false)
    res.status === Status.SUCCESS && setVehicle(res.items)
    res.status !== Status.SUCCESS && setError({ message: res.message, code: res.status })
  }

  const update_partial_vehicle = async (data: any) => {
    setUpdating(true)
    const res = await vehicleRepository.update_partial_vehicle(id, data)
    setUpdating(false)
    if (res.status !== Status.SUCCESS) {
      return toast.error(res.message)
    }
    res.status === Status.SUCCESS && setVehicle(res.items)
  }

  const delete_vehicle = async () => {
    setUpdating(true)
    const res = await vehicleRepository.delete_vehicle(id)
    setUpdating(false)
    if (res.status !== Status.SUCCESS) {
      return toast.error(res.message)
    }
    res.status === Status.SUCCESS && router.push('/vehicles')
  }


  useEffect(() => {
    id && fetch_vehicle()

  }, [id])

  return (
    <Layout>
      <div className='border-2 border-black h-full md:w-8/12 p-3 rounded-xl w-full xl:p-5'>

        {error !== null && !loading && <FetchError reload={fetch_vehicle} error={error} />}
        {loading && <div>Loading...</div>}
        {!loading && vehicle && <VehicleFrom
         onUpdate={update_partial_vehicle} 
         onDelete={delete_vehicle}
         loading={updating} 
         vehicle={vehicle} />}
      </div>

    </Layout>
  )
}

export default Vehicles