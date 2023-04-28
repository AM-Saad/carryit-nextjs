import React from 'react'

const Badge: React.FC<{ label: string | undefined, className: string,color?:string }> = ({ label, className, color }) => {
    return (
        <>
            <span className={`inline-flex rounded-full items-center py-0.5 px-2 text-sm font-medium ${className}`}
                style={{ backgroundColor: color }}
            >
                {label || 'Badge'}
            </span>
        </>
    )
}

export default Badge