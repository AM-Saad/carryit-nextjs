import { FADE_IN_ANIMATION_SETTINGS, INTERNAL_BRANCHES_ROUTE, INTERNAL_DRIVERS_ROUTE, INTERNAL_SHIPMENTS_ROUTE, INTERNAL_VEHICLES_ROUTE } from "@/lib/constants";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ReactNode, useEffect, useContext } from "react";
import AdminContext from '@/stores/admin'
import useScroll from "@/lib/hooks/use-scroll";
import Meta from "./meta";
import { useSignInModal } from "./sign-in-modal";
import UserDropdown from "./user-dropdown";
import { useRouter } from "next/router";

const links = [
  { href: INTERNAL_BRANCHES_ROUTE, name: 'Branches', icon: '' },
  { href: INTERNAL_DRIVERS_ROUTE, name: 'Drivers', icon: '' },
  { href: INTERNAL_VEHICLES_ROUTE, name: 'Vehicles', icon: '' },
  { href: INTERNAL_SHIPMENTS_ROUTE, name: 'Shipments', icon: '' },
  { href: '/admin/settings', name: 'Settings', icon: '' }
]

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
  const { SignInModal, setShowSignInModal } = useSignInModal();
  const scrolled = useScroll(50);

  const { admin, fetch_admin, adminMeta } = useContext(AdminContext)
  const router = useRouter()

  const getAdmin = async () => {
    await fetch_admin()
  }





  useEffect(() => {
    const token = localStorage.getItem('uidjwt')
    if (!token && !router.pathname.includes('user')) {
      router.push('/')
      return
    }
    token && getAdmin();

  }, []);
  return (
    <>
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
      <main className="sm:flex gap-5 h-[100dvh] p-2 pt-20 w-full">
        {admin && router.pathname.includes('admin') &&
          <div className="p-3 sm:my-1 border rounded-t-md sm:rounded-tr-lg w-full sm:w-40 sm:bg-white bg-gray-50">

            <ul className="flex sm:flex-col gap-5 justify-between">
              {links.map((link: any) =>
                <>
                  <li className="sm:mb-5 ">
                    <Link href={link.href} className="block">{link.name}</Link>
                  </li>
                </>
              )}
            </ul>
          </div>}
        <div className='border sm:border-0 h-full p-2 pt-4 w-full xl:pt-0 xl:p-5 '>
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
    </>
  );
}
export default Layout