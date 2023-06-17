import useWindowSize from '@/lib/hooks/use-window-size';
import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react'
import Image from "next/image";
import { AnimatePresence, motion, useAnimation } from "framer-motion";

const Sidemenu: React.FC<{ links: any }> = ({ links }) => {
    const { isMobile, isDesktop } = useWindowSize();
    const leafletRef = useRef<HTMLUListElement>(null);
    const [show, setShow] = useState(false);
    const controls = useAnimation();

    const transitionProps = { type: "spring", stiffness: 700, damping: 60, ease: "easeInOut" };


    async function handleDragEnd(_: any, info: any) {
        const offset = info.offset.x;
        const velocity = info.velocity.x;
        const width = leafletRef.current?.getBoundingClientRect().width || 0;
        console.log(offset)
        console.log(info.velocity.x)
        if (offset > width / 4 || velocity > 400) {
            await controls.start({ x: '0px', transition: transitionProps });
            setShow(false);
        } else {
            // console.log(velocity)
            // if(velocity > 10){
            setShow(true);

            controls.start({ x: '-70%', transition: transitionProps });
            // }
        }
    }

    function handleDragStart(_: any, info: any) {
        const offset = info.offset.x;
        const velocity = info.velocity.x;
        const width = leafletRef.current?.getBoundingClientRect().width || 0;
        console.log(offset)

        console.log('drag start')
        // setShow(true);
    }


    useEffect(() => {
        if (isMobile) {
            setShow(true)
        } else {
            setShow(false)
        }
        controls.start({ transition: transitionProps });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <div className={`${show ? 'w-14' : 'w-auto'} transition-transform duration-1000 delay-100`}>

            <AnimatePresence>

                <motion.ul
                    ref={leafletRef}
                    key="leaflet"
                    className={`group cursor-grab pb-5 active:cursor-grabbing
                        flex flex-col items-start gap-4 sm:gap-3 p-2 px-4 border rounded-tr-lg  sm:bg-white bg-gray-50 min-h-screen overflow-hidden
                        transition-all duration-75
                        w-40
                    `}
                    animate={controls}
                    transition={transitionProps}
                    drag="x"
                    initial={{ x: '-70%' }}
                    dragDirectionLock
                    onDragEnd={handleDragEnd}
                    dragElastic={{ top: 0, bottom: 1 }}
                    dragConstraints={{ top: 0, bottom: 0 }}
                    onDragStart={handleDragStart}
                    onDrag={(_, info) => {
                        const offset = info.offset.x;
                        const width = leafletRef.current?.getBoundingClientRect().width || 0;

                        console.log(offset)
                        if (offset > width / 6) {
                            setShow(false);
                        }
                    }
                    }
                >

                    {links.map((link: any) =>
                        <li className="sm:mb-5 cursor-pointer block w-full">
                            <Link href={link.href} className="flex  sm:gap-1 justify-between text-xs md:text-sm w-full text-gray-800 cursor-pointer transition-all duration-300">
                                <span className='w-9/12 block'>{link.name}</span>
                                <Image
                                    src={link.icon}
                                    width="20"
                                    height="20"
                                    className="h-5 w-5"
                                    alt={link.name}
                                />

                            </Link>
                        </li>
                    )}

                </motion.ul>
                {/* {show && <motion.div
                key="leaflet-backdrop"
                className="fixed inset-0 z-30 bg-gray-100 bg-opacity-40 backdrop-blur"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShow(false)}
            />} */}
            </AnimatePresence>
        </div>
    )
}

export default Sidemenu