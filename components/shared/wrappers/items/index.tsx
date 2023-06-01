import { motion } from 'framer-motion'
import React from 'react'

const index: React.FC<{ children: any }> = ({ children }) => {
    return (
        <motion.div
            initial="hidden"
            whileInView="show"
            animate="show"
            viewport={{ once: true }}
            variants={{
                hidden: {},
                show: {
                    transition: {
                        staggerChildren: 0.15,
                    },
                },
            }}
        >
            <div className='bg-white rounded h-full'>
                {children}
            </div>
        </motion.div>
    )
}

export default index