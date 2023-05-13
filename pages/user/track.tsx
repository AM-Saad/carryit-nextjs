import { useState } from 'react'
import Layout from '@/components/layout'
import Input from '@/components/shared/Input'
import Button from '@/components/shared/Button'
import { fetcher } from '@/lib/utils'
import Response, { Error, Status } from '@/shared/modals/Response'
import { useRouter } from 'next/router'
const Track: React.FC = () => {
    const [shipmentNo, setShipmentNo] = useState<string>('SHP-')
    const [validationError, setValidationError] = useState<null | string>(null)
    const [requestError, setRequestError] = useState<Error | null>(null)
    const router = useRouter()

    const fetchShipment = async () => {
        if (!shipmentNo || shipmentNo.trim() === '') return setValidationError('Shipment Number Is Required')
        setValidationError(null)

        const res: Response<any> = await fetcher(`/api/public/shipments/SHP-${shipmentNo}`)
        if (res.status !== Status.SUCCESS) {
            return setRequestError({ message: res.message, code: res.status })
        }
        router.push(`/user/${res.items.id}`)

    }

    const shipmentNoChange = (e: any) => {
        setValidationError(null)

        // check if the value is numerice and return error
        if (isNaN(Number(e.target.value))) {
            return setValidationError('Shipment Number Must Be Numeric')
        }
        setShipmentNo(e.target.value)
    }

    return (
        <>
            <Layout meta={
                {
                    title: "Karry | Track Shipment",
                    description: "Welcome to the ultimate logistics solution for brands! Our powerful SaaS platform makes it easy to manage your shipments and drivers, assign deliveries with just a few clicks, and track your packages in real-time. Our system offers unparalleled transparency and visibility to both you and your customers, ensuring that everyone knows exactly where their package is at all times. With our automated driver assignment system and smart routing algorithms, deliveries are faster and more efficient than ever before. Say goodbye to headaches and delays, and hello to seamless logistics management with our app. Sign up today and streamline your logistics operations like never before!",
                    keywords: "Karry, Track Shipment, Shipment Tracking, Track Shipment Online, Driver tracking, Delivery tracking ,Real-time location tracking, Order status, Package delivery tracking,  Restaurant delivery tracking "
                }
            }>
                <div>Track Shipment</div>
                <div className='my-3'>
                    <div className="my-2 w-full h-16 relative rounded-lg border text-lg">
                        {/* <label className="block font-medium text-xs text-gray-700" htmlFor="shipmentNo">Shipment Number </label> */}
                        <input
                            id="shipmentNo"
                            className="  outline-none w-full h-full pl-14 bg-transparent text-lg text-gray-700"
                            onKeyUp={shipmentNoChange}

                        />
                        <p className='absolute left-2 top-[54%] translate-y-[-50%] text-gray-600'>SHP-</p>

                    </div>
                    {validationError &&
                        <p className="text-red-500 text-xs my-2 text-left">{validationError}</p>
                    }
                    {requestError && <p className={`mb-2 text-sm ${requestError.code === Status.UNEXPECTED_ERROR ? 'text-red-500' : "text-blue-500"}`}>{requestError.message}</p>}
                    <Button
                        onClick={fetchShipment}
                        title='Track Now'
                    />
                </div>

            </Layout>
        </>
    )
}

export default Track