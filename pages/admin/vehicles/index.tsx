import React, { useEffect, useContext } from 'react'
import Layout from '@/components/layout'
import Link from 'next/link';
import { vehicleRepository } from '@/lib/repositries/admin'
import { Status } from '@/shared/modals/Response';
import FetchError from '@/components/shared/Error';
import Loading from '@/components/shared/Loading';
import Image from "next/image";
import AdminContext from '@/stores/admin';
import { useSession } from "next-auth/react";
import { INTERNAL_VEHICLES_ROUTE } from '@/lib/constants';
import Item from '@/components/shared/wrappers/items/item';
import ItemsWrapper from '@/components/shared/wrappers/items';
import withAuth from '@/components/shared/auth';

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

            <div className='items-header'>

              <h1 className='text-md font-medium flex items-center gap-2'>
                <Image
                  src='/icons/truck_list.png'
                  alt='Drivers'
                  width='40'
                  height='40'
                />
                Your Vehicles
              </h1>

              <Link href={`${INTERNAL_VEHICLES_ROUTE}/create`} className='text-blue-500 text-sm'>Create New</Link>
            </div>

            <ItemsWrapper>
              {currentItems.map((item: any) => (
                <Item id={item.id} title={item.name} route={INTERNAL_VEHICLES_ROUTE} />
              ))
              }
            </ItemsWrapper>
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

export default withAuth(Vehicles)