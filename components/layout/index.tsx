import { FADE_IN_ANIMATION_SETTINGS, INTERNAL_MANAGERS_ROUTE, INTERNAL_BRANCHES_ROUTE, INTERNAL_DRIVERS_ROUTE, INTERNAL_SHIPMENTS_ROUTE, INTERNAL_VEHICLES_ROUTE } from "@/lib/constants";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ReactNode, useEffect, useContext } from "react";
import AdminContext from '@/stores/admin'
import useScroll from "@/lib/hooks/use-scroll";
import Meta from "@/components/layout/meta";
import { useSignInModal } from "@/components/layout/sign-in-modal";
import UserDropdown from "@/components/layout/user-dropdown";
import { useRouter } from "next/router";
import Sidemenu from "./sidemenu";



const links = [
  { href: INTERNAL_BRANCHES_ROUTE, name: 'Branches', icon: '/icons/branch_list.png' },
  { href: INTERNAL_DRIVERS_ROUTE, name: 'Drivers', icon: '/icons/driver_list.png' },
  { href: INTERNAL_VEHICLES_ROUTE, name: 'Vehicles', icon: '/icons/truck_list.png' },
  { href: INTERNAL_SHIPMENTS_ROUTE, name: 'Shipments', icon: '/icons/shipment_list.png' },
  { href: INTERNAL_MANAGERS_ROUTE, name: 'Managers', icon: '/icons/admin_list.png' },
  { href: '/admin/settings', name: 'Settings', icon: '/icons/settings_list.png' }
]

interface Props {
  meta?: {
    title?: string;
    description?: string;
    image?: string;
    keywords?: string;
  };
  children: ReactNode;
  isSecured?: boolean;
}

const Layout = ({ meta, children, isSecured = true }: Props) => {
  const { SignInModal, setShowSignInModal } = useSignInModal();
  const scrolled = useScroll(50);

  const { admin, fetch_admin, adminMeta } = useContext(AdminContext)
  const router = useRouter()

  const getAdmin = async () => {
    await fetch_admin()
  }





  useEffect(() => {
    // if (!isSecured) return
    const token = localStorage.getItem('uidjwt')
    // if (!token && !router.pathname.includes('user')) {
    //   router.push('/')
    //   return
    // }
    token && getAdmin();

  }, []);
  return (
    <div className="pb-8">
      <Meta {...meta} />
      <SignInModal />
      <div
        className={`fixed top-0 w-full ${scrolled
          ? "border-b border-gray-200 bg-white/50 backdrop-blur-xl"
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
      <main className="flex gap-3 sm:gap-5 min-h-[100dvh] pr-2 pt-20 w-full">

        <Sidemenu links={links} />

        <div className='min-h-[100vh] w-full rounded-md border '>
          {children}
        </div>

      </main>

      <div className="fixed bottom-0 w-full border-t border-gray-200 bg-white py-3 text-center text-sm">
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
}
export default Layout