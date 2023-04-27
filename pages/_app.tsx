import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Analytics } from "@vercel/analytics/react";
import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { Provider as RWBProvider } from "react-wrap-balancer";
import cx from "classnames";
import localFont from "@next/font/local";
import { Inter } from "@next/font/google";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AdminContextProvider } from '@/stores/admin'
import { DriverContextProvider } from '@/stores/driver'
import { useRouter } from 'next/router';

const sfPro = localFont({
  src: "../styles/SF-Pro-Display-Medium.otf",
  variable: "--font-sf",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export default function MyApp({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps<{ session: Session }>) {
  const router = useRouter();

  let contextProvider = (
    <>
      <AdminContextProvider>
        <RWBProvider>
          <div className={cx(sfPro.variable, inter.variable)}>
            <Component {...pageProps} />
          </div>
          <ToastContainer
            toastStyle={{ fontSize: '1rem', color: 'white' }}
            theme="colored"
            position="bottom-left"
            autoClose={8000}
            newestOnTop
            closeOnClick={false}
            pauseOnFocusLoss={false}
            draggable
            pauseOnHover={true}
          />
        </RWBProvider>
        <Analytics />
      </AdminContextProvider>
    </>
  );

  // conditionally wrap Component with DriverContextProvider
  console.log(router)
  if (router.pathname.includes('driver') && !router.pathname.includes('admin')) {
    contextProvider = (
      <DriverContextProvider>
      <RWBProvider>
        <div className={cx(sfPro.variable, inter.variable)}>
          <Component {...pageProps} />
        </div>
        <ToastContainer
          toastStyle={{ fontSize: '1rem', color: 'white' }}
          theme="colored"
          position="bottom-left"
          autoClose={8000}
          newestOnTop
          closeOnClick={false}
          pauseOnFocusLoss={false}
          draggable
          pauseOnHover={true}
        />
      </RWBProvider>
      <Analytics />
    </DriverContextProvider>
    );
  }

  return (
    <SessionProvider session={session}>
      {contextProvider}
    </SessionProvider>
  );
}