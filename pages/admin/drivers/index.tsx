import React, { useEffect, useState, useContext } from 'react'
import { useSession } from "next-auth/react";
import Link from 'next/link';
import Image from "next/image";
import Layout from '@/components/layout'
import { driverRepository } from '@/lib/repositries/admin';
import { Status, Error } from '@/shared/modals/Response';
import Loading from '@/components/shared/Loading';
import FetchError from '@/components/shared/Error';
import { TriangleRightIcon } from '@radix-ui/react-icons';
import AdminContext from '@/stores/admin';
import { INTERNAL_DRIVERS_ROUTE } from '@/lib/constants'

const Drivers = () => {
  const { data: session } = useSession()
  const { fetcher, fetchMeta, currentItems } = useContext(AdminContext);
  const { loading, error } = fetchMeta

  const fetch_data = async () => {

    await fetcher(driverRepository.fetch_drivers(), true)

  }
  useEffect(() => {
    if (session) {
      fetch_data()
    }
  }, [session]);

  return (
    <>
      <Layout>

        {loading && <Loading />}
        {error && !loading && <FetchError reload={fetch_data} error={error} />}

        {currentItems.length > 0 &&
          <>
            <h1 className='text-xl font-medium mb-5 flex items-center gap-3'>
              <Image
                src='/driver.png '
                alt='Drivers'
                width='35'
                height='35'
              />
              Your Drivers
            </h1>
            <div className='bg-white rounded shadow px-5 xl:px-0 h-full'>
              {currentItems.map((driver: any) => (
                <Link href={`${INTERNAL_DRIVERS_ROUTE}/${driver.id}`} key={driver.id} className='text-black bg-white p-2 border-b flex items-center gap-3 relative group'>
                  <TriangleRightIcon className='w-5 h-5 relative block transform transition-all duration-300 group-hover:translate-x-2' />

                  <p>{driver.name}</p>
                </Link>
              ))
              }
            </div>
          </>
        }


        {currentItems.length === 0 && !loading && !error &&
          <div className='p-2 flex items-center justify-center flex-col'>
            <Image
              src='/nodriver.png'
              alt='No Drivers'
              width='100'
              height='100'
              style={{ filter: 'drop-shadow(2px 2px 2px #555)' }}
            />
            <p className='mt-3 font-medium text-gray-700 text-xs sm:text-sm'>No Drivers Associated To Your Company</p>
            <Link href={`${INTERNAL_DRIVERS_ROUTE}/create`} className='text-blue-500 text-sm mt-2'>Create New</Link>
          </div>
        }
      </Layout>
    </>
  )
}

export default Drivers  