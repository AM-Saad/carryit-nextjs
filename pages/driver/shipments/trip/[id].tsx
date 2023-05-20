import React, { useContext, useEffect } from 'react'
import { useRouter } from 'next/router'
import DriverContext from '@/stores/driver'
import { shipmentRepository } from '@/lib/repositries/driver'
import Loading from '@/components/shared/Loading'
import FetchError from '@/components/shared/Error'
import Map from '@/components/driver/map'
import CancelModel from '@/components/driver/map/CancelModel'
const Trip = () => {

  const router = useRouter()
  const { id } = router.query as { id: string }

  const { fetcher, fetchMeta, currentItem, driver } = useContext(DriverContext);
  const { loading, error } = fetchMeta

  const fetch_data = async () => {
    await fetcher(shipmentRepository.fetch_shipment(id), false)
  }


  useEffect(() => {
    if (id) {
      fetch_data()
    }

  }, [id]);
  return (
    <div className='p-3'>

      {loading && <Loading />}
      {error && !loading && <FetchError reload={fetch_data} error={error} />}
      {(!loading && currentItem) &&
        <>
          <h1 className="text-lg font-bold text-gray-500 my-2">Trip For {currentItem.shipmentNo} Started</h1>
          <div  style={{ height: '83vh', width: '100%' }} className='mb-10 rounded-md overflow-hidden shadow-md'>
            <Map shipmentId={currentItem.id} shipment={currentItem} driver={driver} />
          </div>
          <div tabIndex={0} className='w-full bg-white p-2 fixed left-0 bottom-0 flex items-center gap-x-3 border-t-2'>
            <CancelModel shipmentId={currentItem.id} />
            <button className='bg-green-500 text-white p-2 rounded-md w-full' onClick={() => { }}>Delivered</button>


          </div>
        </>
      }
    </div>
  )
}


export default Trip