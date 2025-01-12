import { useContext, useState, useEffect } from 'react'


import Popover from "@/components/shared/ui/popover";
import { motion } from "framer-motion";
import { FADE_IN_ANIMATION_SETTINGS } from "@/lib/constants";

import { getPackageStatusColor, SHIPMENT_STATUS_LABELS, PackageStatus } from '@/modals/Package';
import AdminContext from '@/stores/admin';
import { packageRepository } from '@/lib/repositries/admin';
import Badge from '@/components/shared/ui/Badge';
import Button from '@/components/shared/ui/Button';

export default function ChangeStatus() {
    const [openPopover, setOpenPopover] = useState(false);
    const statuses = Array.from(SHIPMENT_STATUS_LABELS.values());

    const { currentItem, updater, updateMeta } = useContext(AdminContext)
    const [status, setStatus] = useState<number>(0)
    const [reason, setReason] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)



    const changeStatus = (e: any) => {
        const value = +e.target.value
        setStatus(value)
    }

    const update = async () => {
        setError(null)
        try {
            if (status === PackageStatus.Canceled && currentItem?.status !== PackageStatus.Canceled) {
                if (!reason) return setError('Reason is required')
            }

            await updater(packageRepository.change_status(currentItem?.id!, status, { status: reason ? true : false, reason: reason }), false)

            setTimeout(() => {
                console.log(openPopover)
                setOpenPopover(false)
            }, 1000);
        } catch (e: any) {
            setError(e.message || 'Something went wrong')
        }
    }


    useEffect(() => {
        setStatus(currentItem?.status!)
    }, [currentItem])

    useEffect(() => {
        setError(null)
        setReason(null)
    }, [])

    return (
        <motion.div
            className="relative inline-block text-left"
            {...FADE_IN_ANIMATION_SETTINGS}
        >
            <Popover
                align="end"
                openPopover={openPopover}
                setOpenPopover={setOpenPopover}
                content={
                    <div className='w-40 p-2'>
                        <select className='w-full p-1 border rounded text-sm' onChange={changeStatus}>
                            {statuses.map((item, idx) =>
                                <option value={idx} selected={item === SHIPMENT_STATUS_LABELS.get(status!)} key={idx}>{item}</option>
                            )}
                        </select>

                        {status === PackageStatus.Canceled && currentItem?.status !== PackageStatus.Canceled && <div>
                            <div className='mt-4 text-xs'>
                                <label htmlFor="reason" className='mb-1 block'>Reason</label>
                                <textarea
                                    id='reason'
                                    className='w-full p-2 border border-gray-300 rounded'
                                    onChange={(e) => setReason(e.target.value)}
                                    placeholder='Enter reason'> </textarea>
                                {error && <p className='text-red-400'>{error}</p>}
                            </div>

                        </div>}
                        <div className='flex mt-2 justify-end'>
                            <Button
                                onClick={update} title='Update' disabled={updateMeta.loading}
                                loading={updateMeta.loading}
                            />
                        </div>
                    </div>}>
                <button
                    className="flex items-center justify-center overflow-hidden rounded-full shadow transition-all duration-75 focus:outline-none active:scale-95" >
                    <Badge label={SHIPMENT_STATUS_LABELS.get(currentItem?.status!)} className="cursor-pointer-hover" color={getPackageStatusColor(currentItem?.status!)} />
                </button>

            </Popover>
        </motion.div>
    );
}
