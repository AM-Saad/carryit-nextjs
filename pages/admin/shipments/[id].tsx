import Layout from '@/components/layout'
import React, { useContext, useEffect } from 'react'
import { useRouter } from 'next/router'
import { shipmentRepository } from '@/lib/repositries/admin'
import AdminContext from '@/stores/admin'
import { useSession } from 'next-auth/react'
import Loading from '@/components/shared/Loading'
import FetchError from '@/components/shared/Error'
import ShipmentFrom from '@/components/admin/shipment'
import { INTERNAL_SHIPMENTS_ROUTE } from '@/lib/constants'

const Shipment = () => {
  const router = useRouter()
  const { id } = router.query as { id: string }
  const { data: session } = useSession()

  const { fetcher, fetchMeta, currentItem, updater,updateMeta, remover } = useContext(AdminContext);
  const { loading, error } = fetchMeta

  const fetch_data = async () => {
    await fetcher(shipmentRepository.fetch_shipment(id), false)
  }

  const update_data = async (data: any) => {
    await updater(shipmentRepository.update_partial_shipment(id, data), false)
  }
  const remove_data = async () => {
    await remover(shipmentRepository.delete_shipment(id), INTERNAL_SHIPMENTS_ROUTE)
  }

  useEffect(() => {
    if (session && id) {
      fetch_data()
    }
  }, [session, id]);


  return (
    <Layout>

      {loading && <Loading />}
      {error && !loading && <FetchError reload={fetch_data} error={error} />}
      {(!loading && currentItem) && <ShipmentFrom shipment={currentItem} onDelete={remove_data} onUpdate={update_data} loading={updateMeta.loading} />}
    </Layout>
  )
}

export default Shipment