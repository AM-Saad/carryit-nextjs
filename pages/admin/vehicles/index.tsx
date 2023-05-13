import React, { useEffect, useState, useContext } from 'react'
import Layout from '@/components/layout'
import Link from 'next/link';
import { vehicleRepository } from '@/lib/repositries/admin'
import Response, { Status } from '@/shared/modals/Response';
import FetchError from '@/components/shared/Error';
import Loading from '@/components/shared/Loading';
import Image from "next/image";
import AdminContext from '@/stores/admin';
import { useSession } from "next-auth/react";
import { TriangleRightIcon } from '@radix-ui/react-icons';
import { INTERNAL_VEHICLES_ROUTE } from '@/lib/constants';

const Vehicles = () => {
  const { data: session } = useSession()


  const { fetcher, fetchMeta, currentItems } = useContext(AdminContext);
  const { loading, error } = fetchMeta

  const fetch_data = async () => {

    await fetcher(vehicleRepository.fetch_vehicles(), true)

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
        {error && !loading && <FetchError reload={fetch_data} error={{ message: 'Vehicle not found', code: Status.DATA_NOT_FOUND }} />}
        {(!loading && currentItems.length > 0) &&
          <>
            <h1 className='text-md font-medium mb-5 flex items-center gap-2'>
              <Image
                src='/driver.png'
                alt='Drivers'
                width='25'
                height='25'
              />
              Your Vehicles
            </h1>
            <div className='bg-white rounded h-full'>
              {currentItems.map((item: any) => (
                <Link href={`/admin/vehicles/${item.id}`} key={item.id} className='text-black bg-white p-2 border-b flex items-center gap-3 relative group'>
                  <TriangleRightIcon className='w-5 h-5 relative block transform transition-all duration-300 group-hover:translate-x-2' />
                  <p>{item.name}</p>
                </Link>
              ))
              }
            </div>
          </>
        }

        {currentItems.length === 0 && !loading && !error &&
          <div className='p-2 flex items-center justify-center flex-col'>
            <Image
              src='/package.png'
              alt='No Drivers'
              width='100'
              height='100'
              style={{ filter: 'drop-shadow(2px 2px 2px #555)' }}
            />
            <p className='mt-3 font-medium text-gray-700 text-xs sm:text-sm'>No Vehicles Associated To Your Company</p>
            <Link href={`${INTERNAL_VEHICLES_ROUTE}/create`} className='text-blue-500 text-sm mt-2'>Create New</Link>
          </div>
        }
      </Layout>
    </>
  )
}

export default Vehicles  