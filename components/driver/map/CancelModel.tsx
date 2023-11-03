import Button from '@/components/shared/ui/Button'
import Input from '@/components/shared/ui/Input'
import Modal from '@/components/shared/modal'
import { DRIVER_SHIPMENTS_ROUTE } from '@/lib/constants'
import { PackageStatus } from '@/modals/Package'
import Response, { Status } from '@/shared/modals/Response'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { toast } from 'react-toastify'
const CancelModel: React.FC<{ packageId: string }> = ({ packageId }) => {
    const [openConfirmDeleteModal, setOpenConfirmDeleteModal] = useState<boolean>(false)
    const [reason, setReason] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()


    const cancelTrip = async () => {
        if (!reason) return setError('Please enter a reason')
        try {

            setLoading(true)

            const res = await fetch(`${DRIVER_SHIPMENTS_ROUTE}/${packageId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('didjwt')}`
                },
                body: JSON.stringify({ status: PackageStatus.Canceled, reason })
            })

            const data: Response<any> = await res.json()
            setLoading(false)

            if (data.status === Status.SUCCESS) {
                setOpenConfirmDeleteModal(false)
                toast.info('Trip canceled successfully')
                setTimeout(() => {
                router.push('/driver/packages')
                }, 1000)
                return
            }

            setError(data.message)
        } catch (error: any) {
            setError(error.message || 'Something went wrong. Please try again later')
        }
    }


    return (
        <>
            <button className='bg-red-500 text-white p-2 rounded-md w-full' onClick={() => setOpenConfirmDeleteModal(true)}>Cancel</button>

            <Modal showModal={openConfirmDeleteModal} setShowModal={() => setOpenConfirmDeleteModal(false)}>
                <h1>Cancel Trip?</h1>
                <Input
                    label='Reason'
                    type="text"
                    onChange={(e) => { setReason(e.target.value as string) }}
                    defaultVal={''}
                    id='reason'
                    placeholder='Enter Reason'
                />
                {error && <p className='text-red-500'>{error}</p>}

                <div className='flex items-center gap-3'>
                    <Button title='Close' style='bg-gray-500 text-white' onClick={() => setOpenConfirmDeleteModal(false)} loading={loading} disabled={loading} />
                    <Button title='Cancel Trip' style='bg-red-500 text-white' onClick={cancelTrip} loading={loading} disabled={loading} />
                </div>


            </Modal>
        </>

    )
}

export default CancelModel