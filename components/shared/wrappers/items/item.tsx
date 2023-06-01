import { FADE_DOWN_ANIMATION_VARIANTS } from '@/lib/constants'
import { TriangleRightIcon } from '@radix-ui/react-icons'
import { motion } from 'framer-motion'
import Link from 'next/link'
import React from 'react'

interface Props {
    title: string
    id: string
    route: string
}
const Item: React.FC<Props> = ({ title, id, route }) => {
    return (
        <motion.div
            className='text-black bg-white py-2 border-b  relative group'
            variants={FADE_DOWN_ANIMATION_VARIANTS}
        >
            <Link href={`${route}/${id}`} key={id} className='flex items-center gap-3'>
                <TriangleRightIcon className='w-5 h-5 relative block transform transition-all duration-300 group-hover:translate-x-2' />
                <p>{title}</p>
            </Link>
        </motion.div>
    )
}

export default Item