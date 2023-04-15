import React, { useEffect, useState } from 'react'
import Link from 'next/link';
import Image from "next/image";
import { useSession } from "next-auth/react";
import { TriangleRightIcon, } from '@radix-ui/react-icons'

import Layout from '@/components/layout'
import { shipmentRepository } from '@/lib/repositries'
import { Status, Error } from '@/shared/models/Response';
import FetchError from '@/components/shared/Error';
import Loading from '@/components/shared/Loading';

const Shipments = () => {
  const { data: session } = useSession()

  const [shipments, setShipments] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null)


  const fetch_data = async () => {

    setLoading(true);
    const response = await shipmentRepository.fetch_shipments();
    setLoading(false);
    return response.status === Status.SUCCESS ? setShipments(response.items) : setError({ message: response.message, code: response.status })
  }


  useEffect(() => {
    if (session) {

      fetch_data();
    }
  }, [session]);
  return (
    <>
      <Layout>
        <div className='md:w-8/12 w-full p-3 xl:p-5 h-full'>

          {loading && <Loading />}
          {error && !loading && <FetchError reload={fetch_data} error={error} />}

          {shipments && shipments.length > 0 &&
            <>
              <h1 className='text-xl font-medium mb-5 flex items-center gap-3'>
                <Image
                  src='/package.png '
                  alt='Shipments'
                  width='20'
                  height='20'
                />
                Your Shipments
              </h1>
              <div className='bg-white rounded shadow px-5 xl:px-0 h-full '>


                {shipments.map((shipment: any) => (
                  <Link href={`/shipments/${shipment.id}`} key={shipment.id} className='text-black bg-white p-2 border-b flex group items-center gap-3 relative'>
                    <TriangleRightIcon className='w-5 h-5 relative block transform transition-all duration-300 group-hover:translate-x-2' />
                    <p>{shipment.shipmentNo}</p>
                  </Link>
                ))}
              </div>
            </>
          }

          {shipments.length === 0 && !loading && !error &&
            <div className='p-2 flex items-center justify-center flex-col'>
              <Image
                src='/package.png'
                alt='No Drivers'
                width='100'
                height='100'
                style={{ filter: 'drop-shadow(2px 2px 2px #555)' }}
              />
              <p className='mt-3 font-medium text-gray-700 text-xs sm:text-sm'>No Drivers Associated To Your Company</p>
              <Link href={"/shipments/create"} className='text-blue-500 text-sm mt-2'>Create New</Link>
            </div>
          }

        </div>
      </Layout>
    </>
  )
}

export default Shipments  