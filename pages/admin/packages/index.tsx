import React, { useEffect, useContext } from 'react'
import Link from 'next/link';
import Image from "next/image";
import { useSession } from "next-auth/react";
import Layout from '@/components/layout'
import { packageRepository } from '@/lib/repositries/admin'
import FetchError from '@/components/shared/Error';
import Loading from '@/components/shared/Loading';
import AdminContext from '@/stores/admin';
import { INTERNAL_SHIPMENTS_ROUTE } from '@/lib/constants'
import Item from '@/components/shared/wrappers/items/item';
import ItemsWrapper from '@/components/shared/wrappers/items';
import { Package } from '@/modals/Package';
import withAuth from '@/components/shared/auth';


const imageLoader = ({ src, width, quality }: any) => {
  return `https://karry.live/${src}?w=${width}&q=${quality || 75}`;
};
const Packages = () => {
  const { data: session } = useSession()

  const { fetcher, fetchMeta, currentItems } = useContext(AdminContext);
  const { loading, error } = fetchMeta

  const fetch_data = async () => {
    await fetcher(packageRepository.fetch_packages(), true)
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
          title: 'Packages | Admin',
          description: 'Packages',
        }}
      >

        {loading && <Loading />}
        {error && !loading && <FetchError reload={fetch_data} error={error} />}


        {currentItems && currentItems.length > 0 &&
          <>

            <div className='items-header'>

              <h1 className='text-md font-medium flex items-center gap-2'>
                Your Packages

                <Image
                  // loader={imageLoader}
                  src='/icons/package_list.png'
                  alt='Packages'
                  width='20'
                  height='20'
                />
              </h1>

              <Link href={`${INTERNAL_SHIPMENTS_ROUTE}/create`} className='text-blue-500 text-sm'>Create New</Link>
            </div>

            <ItemsWrapper>

              {currentItems.map((item: Package) => (
                <Item
                  key={item.id}
                  id={item.id}
                  title={item.packageNo!}
                  route={INTERNAL_SHIPMENTS_ROUTE} />
              ))}
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
            <p className='mt-3 font-medium text-gray-700 text-xs sm:text-sm'>No Packages Associated To Your Company</p>
            <Link href={`${INTERNAL_SHIPMENTS_ROUTE}/create`} className='text-blue-500 text-sm mt-2'>Create New</Link>
          </div>
        }

      </Layout>
    </>
  )
}

export default withAuth(Packages)