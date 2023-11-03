import React, { useState, useEffect } from 'react'
import { calculateCost } from '@/lib/utils'

export const PricingCalculator = () => {
    const [cost, setCost] = useState(0)
    const [branches, setBranches] = useState(1)
    const [drivers, setDrivers] = useState(1)
    const [trips, setTrips] = useState(1)

    useEffect(() => {
        setCost(calculateCost(branches, drivers, trips) * 1.5)
    }, [branches, drivers, trips])

    return (
        <>
            <div>
                <div className='max-w-full bg-gray-50 border p-2 rounded-lg flex flex-col gap-2 mb-5'>
                    <label className='mb-2 font-medium' id="branches">How many branches do you have?</label>
                    <input
                        className="range"
                        type="range"
                        name="branches"
                        min="1"
                        max="20"
                        value={branches}
                        onChange={(e) => setBranches(parseInt(e.target.value))}
                    />
                    <span>{branches === 1 ? `${branches} branch` : `${branches} branches`}</span>
                </div>
                <div className='max-w-full bg-gray-50 border p-2 rounded-lg flex flex-col gap-2 mb-5'>
                    <label className='mb-2 font-medium' id="drivers">How many drivers Per branch do you have?</label>
                    <input
                        className="range"
                        type="range"
                        name="drivers"
                        min="1"
                        max="20"
                        value={drivers}
                        onChange={(e) => setDrivers(parseInt(e.target.value))}
                    />
                    <span>{drivers === 1 ? `${drivers} driver` : `${drivers} drivers`}</span>
                </div>
                <div className='max-w-full bg-gray-50 border p-2 rounded-lg flex flex-col gap-2'>
                    <label className='mb-2 font-medium' id="trips">How many trips per day the driver do?</label>
                    <input
                        className="range"
                        type="range"
                        name="trips"
                        min="1"
                        max="20"
                        value={trips}
                        onChange={(e) => setTrips(parseInt(e.target.value))}
                    />
                    <span>{trips === 1 ? `${trips} trip` : `${trips} trips`}</span>
                </div>
                <div className='mt-5 px-2 py-4 text-2xl flex items-center gap-x-1'>
                    <p id="cost">Your estimated cost is:{" "} </p>
                    <span className="font-medium text-md">{cost.toFixed(2)} $ / Month</span>
                </div>
            </div>
        </>
    )
}
