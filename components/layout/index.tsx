import { FADE_IN_ANIMATION_SETTINGS } from "@/lib/constants";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ReactNode, useEffect, useContext } from "react";
import AdminContext from '@/stores/admin'
import useScroll from "@/lib/hooks/use-scroll";
import Meta from "./meta";
import { useSignInModal } from "./sign-in-modal";
import UserDropdown from "./user-dropdown";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { getCookie } from "@/lib/utils";

const links = [
  { href: '/drivers', name: 'Drivers', icon: '' },
  { href: '/vehicles', name: 'Vehicles', icon: '' },
  { href: '/shipments', name: 'Shipments', icon: '' },
  { href: '/settings', name: 'Setting', icon: '' }
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
  const { SignInModal, setShowSignInModal } = useSignInModal();
  const scrolled = useScroll(50);

  const { admin, fetch_admin, adminMeta } = useContext(AdminContext)
  const router = useRouter()

  const getAdmin = async () => {
    await fetch_admin()
  }





  useEffect(() => {
    const token = localStorage.getItem('uidjwt')
    if (!token) {
      router.push('/')
      return
    }
    getAdmin();
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
          <Link href="/" className="flex items-center font-display text-2xl">
            <Image
              src="/logo.png"
              alt="Precedent logo"
              width="30"
              height="30"
              className="mr-2 rounded-sm"
            ></Image>
            <p>Carry it</p>
          </Link>


          <div>
            <AnimatePresence>
              {!admin ? (
                <motion.button
                  className="rounded-full border border-black bg-black p-1.5 px-4 text-sm text-white transition-all hover:bg-white hover:text-black"
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
      <main className="sm:flex gap-10 min-h-[93vh] pt-32 w-full">
        <div className="bg-gray-50 sm:w-40 p-3 my-1">
          {admin &&
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
}
export default Layout