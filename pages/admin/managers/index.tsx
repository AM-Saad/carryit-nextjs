import React, { useEffect, useContext } from 'react'
import { useSession } from "next-auth/react";
import Link from 'next/link';
import Image from "next/image";
import Layout from '@/components/layout'
import { managerRepository } from '@/lib/repositries/admin';
import Loading from '@/components/shared/Loading';
import FetchError from '@/components/shared/Error';
import AdminContext from '@/stores/admin';
import { INTERNAL_MANAGERS_ROUTE } from '@/lib/constants'
import Item from '@/components/shared/wrappers/items/item';
import ItemsWrapper from '@/components/shared/wrappers/items';
import withAuth from '@/components/shared/auth';

const Managers = () => {
  const { data: session } = useSession()
  const { fetcher, fetchMeta, currentItems } = useContext(AdminContext);
  const { loading, error } = fetchMeta

  const fetch_data = async () => {

    await fetcher(managerRepository.fetch_managers(), true)

  }
  useEffect(() => {
    if (session) {
      fetch_data()
    }
  }, [session]);

  return (
    <>
      <Layout
        meta={{
          title: 'Managers | Admin',
          description: 'Managers',
        }}
      >

        {loading && <Loading />}
        {error && !loading && <FetchError reload={fetch_data} error={error} />}

        {currentItems.length > 0 &&
          <>

            <div className='items-header'>
              <h1 className='text-md font-medium flex items-center gap-2'>
                Your Managers
                <Image
                  src='/icons/admin_list.png'
                  alt='Drivers'
                  width='20'
                  height='20'
                />
              </h1>

              <Link href={`${INTERNAL_MANAGERS_ROUTE}/create`} className='text-blue-500 text-sm'>Create New</Link>
            </div>
            <ItemsWrapper>
              {currentItems.map((item: any) => (
                <Item
                  key={item.id}
                  id={item.id}
                  title={item.name}
                  route={INTERNAL_MANAGERS_ROUTE} />
              ))
              }
            </ItemsWrapper>
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
            <p className='mt-3 font-medium text-gray-700 text-xs sm:text-sm'>No Managers Yet!</p>
            <Link href={`${INTERNAL_MANAGERS_ROUTE}/create`} className='text-blue-500 text-sm mt-2'>Create New</Link>
          </div>
        }
      </Layout>
    </>
  )
}

export default withAuth(Managers)