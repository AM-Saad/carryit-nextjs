import React, { useContext, useEffect } from 'react'
import { useRouter } from 'next/router'
import DriverContext from '@/stores/driver'
import { shipmentRepository } from '@/lib/repositries/driver'
import Layout from '@/components/layout/driver'
import Loading from '@/components/shared/Loading'
import FetchError from '@/components/shared/Error'
import Map from '@/components/driver/map'
// import socket from '@/lib/socket/trip'
const Trip = () => {

  const router = useRouter()
  const { id } = router.query as { id: string }

  const { fetcher, fetchMeta, currentItem } = useContext(DriverContext);
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
    <Layout>

      {loading && <Loading />}
      {error && !loading && <FetchError reload={fetch_data} error={error} />}
      {(!loading && currentItem) &&
        <>
          <h1 className="text-xl font-bold">Trip For {currentItem.shipmentNo} Started</h1>

          <Map shipmentId={currentItem.id}/>
        </>
      }
    </Layout>
  )
}


export default Trip