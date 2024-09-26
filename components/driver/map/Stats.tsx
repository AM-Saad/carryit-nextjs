import React from 'react'

const Stats: React.FC<any> = (props) => {
    return (
        <div className='p-1 my-2 text-xs md:text-sm flex justify-start gap-x-2'>
            <p>Accuracy Threshold: {props.accuracyThreshold}</p>
            <p>Accuracy: {props.accuracy}</p>
            <p>Attempts: {props.attempts}</p>
        </div>
    )
}

export default Stats