import useWindowSize from "@/lib/hooks/use-window-size";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useAnimation } from "framer-motion";

const Sidemenu: React.FC<{ links: any }> = ({ links }) => {
  const { isMobile, isDesktop } = useWindowSize();
  const leafletRef = useRef<HTMLUListElement>(null);
  const [show, setShow] = useState(false);
  const controls = useAnimation();

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
    console.log(offset);
    console.log(info.velocity.x);
    if (offset > width / 4 || velocity > 400) {
      await controls.start({ x: "0px", transition: transitionProps });
      setShow(false);
    } else {
      // console.log(velocity)
      // if(velocity > 10){
      setShow(true);

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
    if (isMobile) {
      setShow(true);
      controls.start({ x: "-110px", transition: transitionProps });
    } else {
      setShow(false);
      controls.start({ x: "0px", transition: transitionProps });
    }
    controls.start({ transition: transitionProps });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile, isDesktop]);
  return (
    <div
      className={`${
        show ? "w-14" : "w-auto"
      } transition-transform delay-100 duration-1000`}
    >
      <AnimatePresence>
        <motion.ul
          ref={leafletRef}
          key="leaflet"
          className={`group flex min-h-screen w-40
                        cursor-grab flex-col items-start gap-4 overflow-hidden rounded-tr-lg border bg-gray-50 p-2  px-4 pb-5 transition-all duration-75
                        active:cursor-grabbing sm:gap-3
                        sm:bg-white
                    `}
          animate={controls}
          transition={transitionProps}
          drag="x"
          initial={{ x: isDesktop ? "-70%" : "0px" }}
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
          {links.map((link: any) => (
            <li className="block w-full cursor-pointer sm:mb-5" key={link.name}>
              <Link
                href={link.href}
                className="flex  w-full cursor-pointer justify-between text-xs text-gray-800 transition-all duration-300 sm:gap-1 md:text-sm"
              >
                <span className="block w-9/12">{link.name}</span>
                <Image
                  src={link.icon}
                  width="20"
                  height="20"
                  className="h-5 w-5"
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
};

export default Sidemenu;
