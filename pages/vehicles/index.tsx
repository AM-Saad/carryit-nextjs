import React, { useEffect, useState } from 'react'
import Layout from '@/components/layout'
import Link from 'next/link';
import { vehicleRepository } from '@/lib/repositries'
import Response, { Status } from 'shared/models/Response';
import FetchError from '@/components/shared/Error';
import Loading from '@/components/shared/Loading';
import Image from "next/image";

const Vehicles = () => {
  const [vehicles, setVehicles] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const fetch_data = async () => {
    setLoading(true);
    const response: Response = await vehicleRepository.fetch_vehicles();
    setLoading(false);
    response.status === Status.SUCCESS && setVehicles(response.items);

  }



  useEffect(() => {
    fetch_data();
  }, []);
  return (
    <>
      <Layout>
        <div className='bg-gray-50 rounded shadow md:w-8/12 w-full p-3 xl:p-5 h-full'>
          {loading && <Loading />}
          {error && !loading && <FetchError reload={fetch_data} error={{ message: 'Vehicle not found', code: Status.DATA_NOT_FOUND }} />}
          {vehicles.length > 0 && vehicles.map((vehicle: any) => (
            <Link href={`/vehicles/${vehicle.id}`} key={vehicle.id} className='text-black p-2 border-b flex items-center gap-3'>
              <p>{vehicle.name}</p>
            </Link>
          ))}

          {vehicles.length === 0 && !loading && !error &&
            <div className='p-2 flex items-center justify-center flex-col'>
              <Image
                src='/package.png'
                alt='No Drivers'
                width='100'
                height='100'
                style={{ filter: 'drop-shadow(2px 2px 2px #555)' }}
              />
              <p className='mt-3 font-medium text-gray-700 text-xs sm:text-sm'>No Vehicles Associated To Your Company</p>
              <Link href={"/vehicles/create"} className='text-blue-500 text-sm mt-2'>Create New</Link>
            </div>
          }
        </div>
      </Layout>
    </>
  )
}

export default Vehicles  