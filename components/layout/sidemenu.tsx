import useWindowSize from '@/lib/hooks/use-window-size';
import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react'
import Image from "next/image";
import { AnimatePresence, motion, useAnimation } from "framer-motion";

const Sidemenu: React.FC<{ links: any }> = ({ links }) => {
    const { isMobile, isDesktop } = useWindowSize();
    const leafletRef = useRef<HTMLDivElement>(null);
    const [show, setShow] = useState(false);
    const controls = useAnimation();
    const transitionProps = { type: "spring", stiffness: 500, damping: 50 };


    async function handleDragEnd(_: any, info: any) {
        const offset = info.offset.x;
        const velocity = info.velocity.x;
        const width = leafletRef.current?.getBoundingClientRect().width || 0;

        console.log(offset, velocity, width)

        if (offset > width / 2 || velocity > 300) {
            await controls.start({ x: '0px', transition: transitionProps });
            setShow(false);
        } else {
            controls.start({ x: '-63%', transition: transitionProps });
        }
    }

    
    useEffect(() => {
        controls.start({
            x: 0,
            transition: transitionProps,
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <AnimatePresence>
            <motion.div
                ref={leafletRef}
                key="leaflet"
                className="group z-40 cursor-grab pb-5 active:cursor-grabbing"
                initial={{ x: "100%" }}
                animate={controls}
                exit={{ x: "100%" }}
                transition={transitionProps}
                drag="x"
                dragDirectionLock
                onDragEnd={handleDragEnd}
                dragElastic={{ top: 0, bottom: 1 }}
                dragConstraints={{ top: 0, bottom: 0 }}
            >
                <ul
                    className="flex flex-col items-start gap-4 sm:gap-3 p-2 border rounded-t-md sm:rounded-tr-lg  sm:bg-white bg-gray-50 min-h-screen overflow-hidden">
                    {links.map((link: any) =>
                        <li className="sm:mb-5 cursor-pointer block w-full">
                            <Link href={link.href} className="flex items-center sm:gap-1 justify-between text-xs md:text-sm text-gray-800 cursor-pointer transition-all duration-300">
                                <span>{link.name}</span>
                                <Image
                                    src={link.icon}
                                    width="20"
                                    height="20"
                                    className="h-5 w-5 sm:h-7 sm:w-7 mr-1"
                                    alt={link.name}
                                />

                            </Link>
                        </li>
                    )}
                </ul>
            </motion.div>
            {show && <motion.div
                key="leaflet-backdrop"
                className="fixed inset-0 z-30 bg-gray-100 bg-opacity-40 backdrop-blur"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShow(false)}
            />}
        </AnimatePresence>
    )
}

export default Sidemenu