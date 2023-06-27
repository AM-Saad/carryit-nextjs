import {
  FADE_IN_ANIMATION_SETTINGS,
  INTERNAL_MANAGERS_ROUTE,
  INTERNAL_BRANCHES_ROUTE,
  INTERNAL_DRIVERS_ROUTE,
  INTERNAL_SHIPMENTS_ROUTE,
  INTERNAL_VEHICLES_ROUTE,
} from "@/lib/constants";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import React, { ReactNode, useContext} from "react";
import AdminContext from "@/stores/admin";
import useScroll from "@/lib/hooks/use-scroll";
import Meta from "@/components/layout/meta";
import { useSignInModal } from "@/components/layout/sign-in-modal";
import UserDropdown from "@/components/layout/user-dropdown";
import Sidemenu from "./sidemenu";

const links = [
  {
    href: INTERNAL_BRANCHES_ROUTE,
    name: "Branches",
    icon: "/icons/branch_list.png",
  },
  {
    href: INTERNAL_DRIVERS_ROUTE,
    name: "Drivers",
    icon: "/icons/driver_list.png",
  },
  {
    href: INTERNAL_VEHICLES_ROUTE,
    name: "Vehicles",
    icon: "/icons/truck_list.png",
  },
  {
    href: INTERNAL_SHIPMENTS_ROUTE,
    name: "Packages",
    icon: "/icons/package_list.png",
  },
  // {
  //   href: INTERNAL_MANAGERS_ROUTE,
  //   name: "Managers",
  //   icon: "/icons/admin_list.png",
  // },
  {
    href: "/admin/settings",
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
  isDashboard?: boolean;
}

const Layout = ({ meta, children }: Props) => {
  const { SignInModal, setShowSignInModal } = useSignInModal();
  const { admin } = useContext(AdminContext);
  const scrolled = useScroll(30);



  return (
    <div className="h-[100dvh] flex flex-col justify-between align-top">
      <Meta {...meta} />
      <SignInModal />

      {/* Nav */}
      <div
        className={`fixed top-0 w-full ${scrolled
          ? "border-b border-gray-200 bg-white/50 backdrop-blur-xl "
          : "bg-white/0"
          } z-30 transition-all`}
      >
        <div className="mx-5 flex h-16 max-w-screen-xl items-center justify-between xl:mx-auto">
          <Link href="/" className="flex items-center font-display text-xl">
            <Image
              src="/logo.png"
              alt="Karry logo"
              width="30"
              height="30"
              className="mr-2 rounded-sm"
            ></Image>
          </Link>

          <div>
            <AnimatePresence>
              {!admin ? (
                <motion.button
                  className="rounded-full border border-black p-1.5 px-4 text-sm transition-all hover:bg-black hover:text-white "
                  onClick={() => setShowSignInModal(true)}
                  {...FADE_IN_ANIMATION_SETTINGS}
                >
                  Sign In
                </motion.button>
              ) : (
                <UserDropdown />
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>


      {/*  Main content goes here */}
      <main className="flex w-full gap-3 flex-1 pt-20">
        <Sidemenu links={links} isMobile={true} />
        <div className="w-full rounded-tl-md border border-b-0 overflow-auto">
          {children}
        </div>
      </main>

      {/* Footer */}
      <div className="w-full border-t border-gray-200 bg-white py-3 text-center text-sm">
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

    </div>
  );
};
export default React.memo(Layout);
