import { FADE_IN_ANIMATION_SETTINGS, INTERNAL_DRIVERS_ROUTE, INTERNAL_SHIPMENTS_ROUTE, INTERNAL_VEHICLES_ROUTE } from "@/lib/constants";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ReactNode, useEffect, useContext } from "react";
import DriverContext from '@/stores/driver'
import useScroll from "@/lib/hooks/use-scroll";
import Meta from "../meta";
import { useRouter } from "next/router";
import UserDropdown from "./user-dropdown";

const links = [

  { href: '/driver/shipments', name: 'Shipments', icon: '' },
  { href: '/admin/settings', name: 'Setting', icon: '' }
]

interface Props {
  meta?: {
    title?: string;
    description?: string;
    image?: string;
  };
  children: ReactNode;
}

const Layout = ({ meta, children }: Props) => {
  const scrolled = useScroll(50);

  const { driver, fetch_driver, driverMeta } = useContext(DriverContext)
  const router = useRouter()

  const getDriver = async () => {
    await fetch_driver()
  }





  return (
    <>
      <Meta {...meta} />
      <div
        className={`fixed top-0 w-full ${scrolled
          ? "border-b border-gray-200 bg-white/50 backdrop-blur-xl"
          : "bg-white/0"
          } z-30 transition-all`}
      >
        <div className="mx-5 flex h-16 max-w-screen-xl items-center justify-between xl:mx-auto">
          <Link href="/" className="flex items-center font-display text-2xl">
            <Image
              src="/logo.png"
              alt="Precedent logo"
              width="30"
              height="30"
              className="mr-2 rounded-sm"
            ></Image>
          </Link>

          <div>
            <AnimatePresence>
              {!driver ? (
                <motion.button
                  className="rounded-full border border-black bg-black p-1.5 px-4 text-sm text-white transition-all hover:bg-white hover:text-black"
                  onClick={() => { }}
                  {...FADE_IN_ANIMATION_SETTINGS}
                >
                  Sign In
                </motion.button>
              ) : (
                <UserDropdown driver={driver} />
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
      {/*  Main content goes here */}
      <main className="sm:flex gap-10 min-h-[93vh] pt-32 w-full">
        <div className="bg-gray-50 sm:w-40 p-3 my-1">
          {driver &&
            <ul className="flex sm:flex-col gap-5 justify-between">
              {links.map((link: any) =>
                <>
                  <li className="sm:mb-5">
                    <Link href={link.href}>{link.name}</Link>
                  </li>
                </>
              )}
            </ul>
          }
        </div>
        <div className='rounded md:w-8/12 w-full p-3 xl:p-5 h-full'>
          {!driverMeta.loading && <div>

            {children}
          </div>}
        </div>
      </main>

      <div className="absolute w-full border-t border-gray-200 bg-white py-5 text-center">
        <p className="text-gray-500">
          Provided by{" "}
          <a
            className="font-medium text-gray-800  transition-colors"
            href="https://amsaad.cc"
            target="_blank"
            rel="noopener noreferrer"
          >
            Abdelrahman Saad <sup> &copy;</sup>
          </a>
        </p>
      </div>
    </>
  );
}
export default Layout