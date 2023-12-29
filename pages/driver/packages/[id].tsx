import Layout from '@/components/layout/driver'
import React, { useContext, useEffect } from 'react'
import { useRouter } from 'next/router'
import { packageRepository } from '@/lib/repositries/driver'
import DriverContext from '@/stores/driver'
import Loading from '@/components/shared/Loading'
import FetchError from '@/components/shared/Error'
import { PackageStatus, getPackageStatus, getPackageStatusColor } from '@/modals/Package'
import Button from '@/components/shared/ui/Button'
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
            if (currentItem.status === PackageStatus.Shipped) {
                router.push(`/driver/packages/trip/${id}`)
            }
        }
    }, [currentItem]);

    return (
        <Layout >

            {loading && <Loading />}
            {error && !loading && <FetchError reload={fetch_data} error={error} />}
            {(!loading && currentItem) &&
                <div className='p-2'>
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
                    <div className='grid sm:grid-cols-3 gap-5 my-5'>
                        <div className='mt-4 col-span-2'>
                            <h2 className='mb-4 font-medium'>Receiver Details</h2>
                            <div className='flex flex-col gap-3 text-xs'>
                                <p><b>Name:</b> {currentItem.receiver.name}</p>
                                <p><b>Phone:</b> {currentItem.receiver.phone}</p>
                                <p><b>Address:</b> {currentItem.receiver.address || '.n.c'}</p>
                                <p><b>City:</b> {currentItem.receiver.city || '.n.c'}</p>
                                <p><b>State:</b> {currentItem.receiver.state || '.n.c'}</p>
                                <p><b>Building:</b> {currentItem.receiver.building || '.n.c'}</p>
                                <p><b>Floor:</b> {currentItem.receiver.floor || '.n.c'}</p>
                                <p><b>Apartment:</b> {currentItem.receiver.apartment || '.n.c'}</p>
                            </div>
                        </div>
                        <div className='mt-4 col-span-1'>
                            <h2 className='mb-4 font-medium'>Package Info</h2>
                            <div className='flex items-center gap-5 text-xs mb-2'>
                                <p><b>Liquid:</b> {currentItem.is_liquid ? 'Yes' : 'No'}</p>
                                <p><b>Fragile:</b> {currentItem.is_fragile ? 'Yes' : 'No'}</p>
                            </div>
                            <div className='flex flex-col gap-3 w-full'>
                                {currentItem.items?.map(item =>
                                    <div key={item.itemId} className='p-2 bg-gray-50 dark:bg-stone-900 rounded text-xs shadow'>
                                        <p className='mb-2'><b>Name:</b> {item.name}</p>
                                        <p className='mb-2'><b>Price:</b> {item.price}$</p>
                                        <p className='mb-3'><b>Quantity:</b> {item.quantity}</p>
                                        <p className='font-medium'><b>Total:</b> {(item.price || 0) * (item.quantity || 0)}$</p>
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>
                    <hr></hr>
                    <div className='mt-4'>
                        <h2 className='mb-4 font-medium'>Shipping Info</h2>
                        <div className='flex flex-col gap-3 text-xs'>
                            <p><b>Total:</b> {(currentItem.total_cost || 0 - currentItem.shipping_cost)}$</p>
                            <p><b>Discount:</b> {currentItem.discount}$</p>
                            <p><b>Shipping Cost:</b> {currentItem.shipping_cost}$</p>

                            <p className='font-medium text-xl'>Grand Total: {(currentItem.total_cost || 0) - (currentItem.discount || 0)}$</p>



                        </div>
                    </div>

                </div>
            }
        </Layout>
    )
}

export default withAuth(Package)