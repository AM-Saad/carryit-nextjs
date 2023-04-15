import Layout from '@/components/layout'
import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import { fetcher } from '@/lib/utils'
import {SHIPMENTS_ROUTE} from '@/lib/constants'
const Shipment = () => {
  const router = useRouter()
  const { id } = router.query

  const fetch_shipment = async () => {
    const res = await fetcher(`${SHIPMENTS_ROUTE}/${id}`)

    console.log(res)
  }
  useEffect(() => {
    if (id) {
      fetch_shipment()
    }
  }, [id])

  return (
    <Layout>

    </Layout>
  )
}

export default Shipment