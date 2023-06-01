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



const links = [
  { href: INTERNAL_BRANCHES_ROUTE, name: 'Branches', icon: '/icons/branch_list.jpeg' },
  { href: INTERNAL_SHIPMENTS_ROUTE, name: 'Shipments', icon: '/icons/shipment_list.jpeg' },
  { href: INTERNAL_DRIVERS_ROUTE, name: 'Drivers', icon: '/icons/driver_list.jpeg' },
  { href: INTERNAL_VEHICLES_ROUTE, name: 'Vehicles', icon: '/icons/truck_list.jpeg' },
  { href: INTERNAL_MANAGERS_ROUTE, name: 'Managers', icon: '/icons/admin_list.jpeg' },
  { href: '/admin/settings', name: 'Settings', icon: '/icons/settings_list.jpeg' }
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
    if (!isSecured) return
    const token = localStorage.getItem('uidjwt')
    if (!token && !router.pathname.includes('user')) {
      router.push('/')
      return
    }
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
      <main className="sm:flex gap-5 min-h-[100dvh] p-2 pt-20 w-full">
        {admin && router.pathname.includes('admin') &&

          <ul className="flex sm:flex-col gap-4 sm:gap-3 p-2 sm:my-1 border rounded-t-md sm:rounded-tr-lg w-full sm:w-44 sm:bg-white bg-gray-50 overflow-auto sm:min-h-screen">
            {links.map((link: any) =>
              <li className="sm:mb-5 cursor-pointer block min-w-[120px]">
                <Link href={link.href} className="flex items-center sm:gap-1 justify-center text-xs md:text-sm text-gray-800 cursor-pointer  min-w-full">
                  <Image
                    src={link.icon}
                    width="25"
                    height="25"
                    alt={link.name}
                  />
                  {link.name}

                </Link>
              </li>
            )}
          </ul>
        }

        <div className=' h-full w-full xl:p-5 '>
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