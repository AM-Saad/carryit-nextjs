import React, { useEffect, useState } from 'react'
import { ClockIcon, CountdownTimerIcon } from "@radix-ui/react-icons";

const Info: React.FC<{ currentMap: any }> = ({ currentMap }) => {
    const [duration, setDuration] = useState<string>('')
    const [distance, setDistance] = useState<string>('')
    const [map, setMap] = useState<any>(null)

    const watchInfo = () => {
        setInterval(() => {
            const { distance, duration } = map.getInfo()
            setDistance(distance)
            setDuration(duration)
        }, 2000)

    }

    useEffect(() => {
        if (!map) setMap(currentMap)
        if (map) watchInfo()
    }, [map])

    return (
        <>
            <div className="sm:flex items-center gap-3 text-xs my-3">
                <p className="text-gray-800 font-medium flex gap-[2px] items-center"><ClockIcon width={14} height={14} />Estimated Duration: <b> {duration || 'Calculating..'}</b></p>
                <p className="text-gray-800 font-medium flex gap-[2px] items-center"><CountdownTimerIcon width={14} height={14} />Estimated Distance: <b> {distance || 'Calculating..'}</b></p>
            </div>
        </>
    )
}

export default Info