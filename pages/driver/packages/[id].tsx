import Layout from '@/components/layout/driver'
import React, { useContext, useEffect } from 'react'
import { useRouter } from 'next/router'
import { packageRepository } from '@/lib/repositries/driver'
import DriverContext from '@/stores/driver'
import Loading from '@/components/shared/Loading'
import FetchError from '@/components/shared/Error'
import { PackageStatus, getPackageStatus, getPackageStatusColor } from '@/modals/Package'
import Button from '@/components/shared/Button'
import withAuth from '@/components/shared/auth'

const Package = () => {
    const router = useRouter()
    const { id } = router.query as { id: string }

    const { fetcher, fetchMeta, currentItem } = useContext(DriverContext);
    const { loading, error } = fetchMeta

    const fetch_data = async () => {
        const res = await fetcher(packageRepository.fetch_package(id), false)
       
    }


    useEffect(() => {
        if (id) {
            fetch_data()
        }
    }, [id]);

    useEffect(() => {
        if (currentItem) {
            if(currentItem.status === PackageStatus.Shipped){
                router.push(`/driver/packages/trip/${id}`)
            }
        }
    }, [currentItem]);

    return (
        <Layout >

            {loading && <Loading />}
            {error && !loading && <FetchError reload={fetch_data} error={error} />}
            {(!loading && currentItem) &&
                <>
                    <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-3'>
                            <h1 className="text-xl font-bold">{currentItem.packageNo}</h1>
                            <span style={{ backgroundColor: getPackageStatusColor(currentItem.status!) }} className='rounded-full px-2 py-1 text-xs'>{getPackageStatus(currentItem.status!)}</span>
                        </div>
                        <div className='flex items-center gap-3'>
                            <button className='btn btn-primary'>Print</button>
                            <Button title='Start Trip' disabled={currentItem.status !== PackageStatus.Ready} onClick={() => { router.push(`/driver/packages/trip/${id}`) }} />
                        </div>
                    </div>
                    <div className='grid grid-cols-3 gap-5 my-5'>
                        <div className='mt-4 col-span-2'>
                            <h2 className='mb-4 font-medium'>Receiver Details</h2>
                            <div className='flex flex-col gap-3 text-xs'>
                                <p>Name: {currentItem.receiver.name}</p>
                                <p>Phone: {currentItem.receiver.phone}</p>
                                <p>Address: {currentItem.receiver.address || '.n.c'}</p>
                                <p>City: {currentItem.receiver.city || '.n.c'}</p>
                                <p>State: {currentItem.receiver.state || '.n.c'}</p>
                                <p>Building: {currentItem.receiver.building || '.n.c'}</p>
                                <p>Floor: {currentItem.receiver.floor || '.n.c'}</p>
                                <p>Apartment: {currentItem.receiver.apartment || '.n.c'}</p>
                            </div>
                        </div>
                        <div className='mt-4 col-span-1'>
                            <h2 className='mb-4 font-medium'>Package Info</h2>
                            <div className='flex items-center gap-5 text-xs mb-2'>
                                <p >Is Liquid: {currentItem.is_liquid ? 'Yes' : 'No'}</p>
                                <p>Is Fragile: : {currentItem.is_fragile ? 'Yes' : 'No'}</p>
                            </div>
                            <div className='flex flex-col gap-3'>
                                {currentItem.items?.map(item =>
                                    <div key={item.itemId} className='p-2 bg-gray-50 rounded text-xs'>
                                        <p className='mb-2'>Item Name: {item.name}</p>
                                        <p className='mb-2'>Item Price: {item.price}$</p>
                                        <p className='mb-3'>Item Quantity: {item.quantity}</p>
                                        <p className='font-medium'>Total: {(item.price || 0) * (item.quantity || 0)}$</p>
                                    </div>
                                )}


                            </div>
                        </div>

                    </div>
                    <hr></hr>
                    <div className='mt-4'>
                        <h2 className='mb-4 font-medium'>Shipping Info</h2>
                        <div className='flex flex-col gap-3 text-xs'>
                            <p>Total: {(currentItem.total_cost || 0 - currentItem.shipping_cost)}$</p>
                            <p>Discount: {currentItem.discount}$</p>
                            <p>Shipping Cost: {currentItem.shipping_cost}$</p>

                            <p className='font-medium text-md'>Grand Total: {(currentItem.total_cost || 0) -( currentItem.discount || 0)}$</p>



                        </div>
                    </div>

                </>
            }
        </Layout>
    )
}

export default withAuth(Package)