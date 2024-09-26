import React, { useContext, useEffect } from 'react'
import { useRouter } from 'next/router'
import DriverContext from '@/stores/driver'
import { packageRepository } from '@/lib/repositries/driver'
import Loading from '@/components/shared/Loading'
import FetchError from '@/components/shared/Error'
import Map from '@/components/driver/map'
import CancelModel from '@/components/driver/map/CancelModel'
import withAuth from '@/components/shared/auth'
import Layout from "@/components/layout/driver";

const Trip = () => {

  const router = useRouter()
  const { id } = router.query as { id: string }

  const { fetcher, fetchMeta, currentItem, driver } = useContext(DriverContext);
  const { loading, error } = fetchMeta
  const [isReady, setIsReady] = React.useState<boolean>(false)



  const fetch_data = async () => {
    await fetcher(packageRepository.fetch_package(id), false)
  }


  useEffect(() => { if (id) fetch_data() }, [id]);


  return (
    <Layout>


      <div className='p-3'>

        {loading && <Loading />}

        {error && !loading && <FetchError reload={fetch_data} error={error} />}

        {(!loading && currentItem) &&
          <>

            <h1 className="text-lg font-bold text-gray-500 my-2"> {currentItem.packageNo} </h1>
            <Map packageId={currentItem.id} currentPackage={currentItem} driver={driver} ready={() => setIsReady(true)} />

            {isReady &&
              <div tabIndex={0} className='w-full bg-white p-2 fixed left-0 bottom-0 flex items-center gap-x-3 border-t-2'>
                <CancelModel packageId={currentItem.id} />
                <button className='bg-green-500 text-white p-2 rounded-md w-full' onClick={() => { }}>Delivered</button>

              </div>
            }
          </>
        }
      </div>
    </Layout>
  )
}


export default withAuth(Trip)