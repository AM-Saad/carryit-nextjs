import { FADE_IN_ANIMATION_SETTINGS } from "@/lib/constants";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ReactNode, useEffect, useContext } from "react";
import DriverContext from "@/stores/driver";
import useScroll from "@/lib/hooks/use-scroll";
import Meta from "../meta";
import { useRouter } from "next/router";
import Sidemenu from "@/components/layout/sidemenu";
import UserDropdown from "./user-dropdown";

const links = [
  {
    href: "/driver/packages",
    name: "Packages",
    icon: "/icons/package_list.png",
  },
  {
    href: "/driver/settings",
    name: "Settings",
    icon: "/icons/settings_list.png",
  },
];

interface Props {
  meta?: {
    title?: string;
    description?: string;
    image?: string;
    keywords?: string;
  };
  children: ReactNode;
}

const Layout = ({ meta, children }: Props) => {
  const scrolled = useScroll(50);
  const router = useRouter();

  const { fetch_driver, driver, driverMeta } = useContext(DriverContext);


  useEffect(() => {

    fetch_driver();
  }, []);

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
                  className="rounded-full border border-black p-1.5 px-4 text-sm transition-all hover:bg-black hover:text-white "
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
      <main className="flex min-h-[100dvh] w-full gap-3 pr-2 pt-20 sm:gap-5">
        {driver && <Sidemenu links={links} isMobile={true} />}
        <div className={`min-h-[100vh] rounded-md  ${!driver ? 'w-9/12 m-auto' : ' w-full border'}`}>
          {children}
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
};
export default Layout;
