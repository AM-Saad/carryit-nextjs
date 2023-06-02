import useWindowSize from '@/lib/hooks/use-window-size';
import Link from 'next/link';
import React, { useState } from 'react'
import Image from "next/image";

const Sidemenu: React.FC<{ links: any }> = ({ links }) => {
    const { isMobile, isDesktop } = useWindowSize();
    const [open, setOpen] = useState(false);
    const toggle = () => setOpen(!open);

    return (
        <ul
            className="flex flex-col items-start gap-4 sm:gap-3 p-2 border rounded-t-md sm:rounded-tr-lg  sm:bg-white bg-gray-50 overflow-auto sm:min-h-screen overflow-hidden">
            {links.map((link: any) =>
                <li className="sm:mb-5 cursor-pointer block w-full">
                    <Link href={link.href} className="flex items-center sm:gap-1 justify-between text-xs md:text-sm text-gray-800 cursor-pointer transition-all duration-300">
                        <span className={`${isMobile ? 'w-0 opacity-0' : 'opacity-1 w-auto'}`}>{link.name}</span> 
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
    )
}

export default Sidemenu