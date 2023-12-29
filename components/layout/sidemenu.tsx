import useWindowSize from "@/lib/hooks/use-window-size";
import Link from "next/link";
import React, { useEffect, useMemo, useRef, useState, memo } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useAnimation } from "framer-motion";
import { useRouter } from "next/router";


type Link = {
  href: string;
  name: string;
  icon: string;
};

export interface Props {
  links: Link[];
  isMobile: boolean;
}

const Sidemenu: React.FC<Props> = memo(({ links, isMobile }) => {
  // const { isMobile } = useWindowSize();
  const leafletRef = useRef<HTMLUListElement>(null);
  const [show, setShow] = useState(isMobile ? false : true);
  const controls = useAnimation();
  const router = useRouter();
  const menuLinks = useMemo(() => links, [links])

  console.log(isMobile)
  const transitionProps = {
    type: "spring",
    stiffness: 700,
    damping: 60,
    ease: "easeInOut",
  };

  async function handleDragEnd(_: any, info: any) {
    const offset = info.offset.x;
    const velocity = info.velocity.x;
    const width = leafletRef.current?.getBoundingClientRect().width || 0;
    if (offset > width / 4 || velocity > 400) {
      await controls.start({ x: "0px", transition: transitionProps });
      setShow(true);
    } else {
      setShow(false);
      // console.log(velocity)
      // if(velocity > 10){

      controls.start({ x: "-70%", transition: transitionProps });
      // }
    }
  }

  function handleDragStart(_: any, info: any) {
    const offset = info.offset.x;
    const velocity = info.velocity.x;
    const width = leafletRef.current?.getBoundingClientRect().width || 0;
    console.log(offset);

    console.log("drag start");
    // setShow(true);
  }

  useEffect(() => {
    // if (isMobile) {
    //   controls.start({ x: "-110px", transition: transitionProps });
    // } else {
    //   controls.start({ x: "0px", transition: transitionProps });
    // }
    // controls.start({ transition: transitionProps });
    // // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);



  return (
    <div
      className={`${!show ? "w-14" : ""
        } transition-transform delay-100 duration-1000`}
    >
      <AnimatePresence>
        <motion.ul
          ref={leafletRef}
          key="leaflet"
          className={`flex h-full w-40
                        cursor-grab flex-col items-start gap-4 overflow-hidden rounded-tr-lg border border-b-0 bg-gray-50 dark:bg-stone-900 p-2  px-4 pb-5 transition-all duration-75
                        active:cursor-grabbing sm:gap-3
                    `}
          animate={controls}
          transition={transitionProps}
          drag="x"
          initial={{ x: isMobile ? "-110px" : "0px" }}
          dragDirectionLock
          onDragEnd={handleDragEnd}
          dragElastic={{ top: 0, bottom: 1 }}
          dragConstraints={{ top: 0, bottom: 0 }}
          onDragStart={handleDragStart}
          onDrag={(_, info) => {
            const offset = info.offset.x;
            const width =
              leafletRef.current?.getBoundingClientRect().width || 0;

            console.log(offset);
            if (offset > width / 6) {
              setShow(false);
            }
          }}
        >
          {menuLinks.map((link: any) => (
            <li className="block w-full cursor-pointer mb-5 group" key={link.name}>
              <Link
                href={link.href}
                className={`flex w-full cursor-pointer justify-between font-medium text-xs text-gray-500 dark:text-white transition-all duration-300 sm:gap-1 md:text-sm ${router.pathname.includes(link.name.toLowerCase()) ? 'text-gray-900' : 'group-hover:text-gray-900'}`}
              >
                <span className="block w-9/12">{link.name}</span>
                <Image
                  src={link.icon}
                  width="20"
                  height="20"
                  className={`h-5 w-5 ${router.pathname.includes(link.name.toLowerCase()) ? '' : 'filter grayscale'} group-hover:grayscale-0 transition-all duration-300`}
                  alt={link.name}
                />
              </Link>
            </li>
          ))}
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
  );
});

export default Sidemenu
