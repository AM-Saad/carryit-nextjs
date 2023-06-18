import Card from "@/components/home/card";
import Layout from "@/components/layout";
import Balancer from "react-wrap-balancer";
import { motion } from "framer-motion";
import { DEPLOY_URL, FADE_DOWN_ANIMATION_VARIANTS } from "@/lib/constants";
import { Github, Twitter } from "@/components/shared/icons";
import WebVitals from "@/components/home/web-vitals";
import ComponentGrid from "@/components/home/component-grid";
import Image from "next/image";

const Home = () => {
  return (
    <Layout
      meta={{
        title: "Karry",
        description:
          "Welcome to the ultimate logistics solution for brands! Our powerful SaaS platform makes it easy to manage your packages and drivers, assign deliveries with just a few clicks, and track your packages in real-time. Our system offers unparalleled transparency and visibility to both you and your customers, ensuring that everyone knows exactly where their package is at all times. With our automated driver assignment system and smart routing algorithms, deliveries are faster and more efficient than ever before. Say goodbye to headaches and delays, and hello to seamless logistics management with our app. Sign up today and streamline your logistics operations like never before!",
        keywords:
          "Karry, Track Package, Package Tracking, Track Package Online, Driver tracking, Delivery tracking ,Real-time location tracking, Order status, Package delivery tracking,  Restaurant delivery tracking ",
      }}
      isDashboard={false}
    >
      <motion.div
        className="px-5 xl:px-0"
        initial="hidden"
        whileInView="show"
        animate="show"
        viewport={{ once: true }}
        variants={{
          hidden: {},
          show: {
            transition: {
              staggerChildren: 0.15,
            },
          },
        }}
      >
        <motion.h1
          className="bg-gradient-to-br from-black to-stone-500 bg-clip-text text-center font-display text-4xl font-bold tracking-[-0.02em] text-transparent drop-shadow-sm md:text-7xl md:leading-[5rem]"
          variants={FADE_DOWN_ANIMATION_VARIANTS}
        >
          <Balancer>Karry</Balancer>
        </motion.h1>
        <motion.h1
          className="bg-gradient-to-br from-black to-stone-500 bg-clip-text text-center font-display text-3xl font-bold tracking-[-0.02em] text-transparent drop-shadow-sm md:text-5xl md:leading-[5rem]"
          variants={FADE_DOWN_ANIMATION_VARIANTS}
        >
          <Balancer>Let Em Track!</Balancer>
        </motion.h1>
        <motion.p
          className="mt-6 text-center text-gray-500 md:text-xl"
          variants={FADE_DOWN_ANIMATION_VARIANTS}
        >
          <Balancer>
            Take your order fulfillment to the next level with our cutting-edge
            app.
          </Balancer>
        </motion.p>
        <motion.div
          className="mx-auto mt-6 flex items-center justify-center space-x-5"
          variants={FADE_DOWN_ANIMATION_VARIANTS}
        >
          <a
            className="group flex max-w-fit items-center justify-center space-x-2 rounded-full border border-black bg-black px-5 py-2 text-sm text-white transition-colors hover:bg-white hover:text-black"
            target="_blank"
            rel="noopener noreferrer"
          >
            <p>Get Started</p>
          </a>
          <a
            className="flex max-w-fit items-center justify-center space-x-2 rounded-full border border-gray-300 bg-white px-5 py-2 text-sm text-gray-600 shadow-md transition-colors hover:border-gray-800"
            href="/user/track"
            rel="noopener noreferrer"
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 15 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9.62129 1.13607C9.81656 0.940808 10.1331 0.940809 10.3284 1.13607L11.3891 2.19673L12.8033 3.61094L13.8639 4.6716C14.0592 4.86687 14.0592 5.18345 13.8639 5.37871C13.6687 5.57397 13.3521 5.57397 13.1568 5.37871L12.5038 4.7257L8.86727 9.57443L9.97485 10.682C10.1701 10.8773 10.1701 11.1939 9.97485 11.3891C9.77959 11.5844 9.463 11.5844 9.26774 11.3891L7.85353 9.97491L6.79287 8.91425L3.5225 12.1846C3.32724 12.3799 3.01065 12.3799 2.81539 12.1846C2.62013 11.9894 2.62013 11.6728 2.81539 11.4775L6.08576 8.20714L5.0251 7.14648L3.61089 5.73226C3.41563 5.537 3.41562 5.22042 3.61089 5.02516C3.80615 4.8299 4.12273 4.8299 4.31799 5.02516L5.42557 6.13274L10.2743 2.49619L9.62129 1.84318C9.42603 1.64792 9.42603 1.33133 9.62129 1.13607Z"
                fill="currentColor"
                fill-rule="evenodd"
                clip-rule="evenodd"
              ></path>
              <path
                d="M9.62129 1.13607C9.81656 0.940808 10.1331 0.940809 10.3284 1.13607L11.3891 2.19673L12.8033 3.61094L13.8639 4.6716C14.0592 4.86687 14.0592 5.18345 13.8639 5.37871C13.6687 5.57397 13.3521 5.57397 13.1568 5.37871L12.5038 4.7257L8.86727 9.57443L9.97485 10.682C10.1701 10.8773 10.1701 11.1939 9.97485 11.3891C9.77959 11.5844 9.463 11.5844 9.26774 11.3891L7.85353 9.97491L6.79287 8.91425L3.5225 12.1846C3.32724 12.3799 3.01065 12.3799 2.81539 12.1846C2.62013 11.9894 2.62013 11.6728 2.81539 11.4775L6.08576 8.20714L5.0251 7.14648L3.61089 5.73226C3.41563 5.537 3.41562 5.22042 3.61089 5.02516C3.80615 4.8299 4.12273 4.8299 4.31799 5.02516L5.42557 6.13274L10.2743 2.49619L9.62129 1.84318C9.42603 1.64792 9.42603 1.33133 9.62129 1.13607Z"
                fill="currentColor"
                fill-rule="evenodd"
                clip-rule="evenodd"
              ></path>
            </svg>
            <p>Track Package</p>
          </a>
        </motion.div>
      </motion.div>
      {/* here we are animating with Tailwind instead of Framer Motion because Framer Motion messes up the z-index for child components */}
      <div className=" grid w-full max-w-screen-xl animate-[slide-down-fade_0.5s_ease-in-out] grid-cols-1 gap-5 px-5 md:grid-cols-3 xl:px-0">
        {/* {features.map(({ title, description, demo, large }) => (
          <Card
            key={title}
            title={title}
            description={description}
            demo={
              title === "Beautiful, reusable components" ? (
                <ComponentGrid />
              ) : (
                demo
              )
            }
            large={large}
          />
        ))} */}
      </div>
    </Layout>
  );
};

// const features = [
//   {
//     title: "Beautiful, reusable components",
//     description:
//       "Pre-built beautiful, a11y-first components, powered by [Tailwind CSS](https://tailwindcss.com/), [Radix UI](https://www.radix-ui.com/), and [Framer Motion](https://framer.com/motion)",
//     large: true,
//   },
//   {
//     title: "Performance first",
//     description:
//       "Built on [Next.js](https://nextjs.org/) primitives like `@next/font` and `next/image` for stellar performance.",
//     demo: <WebVitals />,
//   },
//   {
//     title: "One-click Deploy",
//     description:
//       "Jumpstart your next project by deploying Precedent to [Vercel](https://vercel.com/) in one click.",
//     demo: (
//       <a href={DEPLOY_URL}>
//         {/* eslint-disable-next-line @next/next/no-img-element */}
//         <img
//           src="https://vercel.com/button"
//           alt="Deploy with Vercel"
//           width={120}
//         />
//       </a>
//     ),
//   },
//   {
//     title: "Built-in Auth + Database",
//     description:
//       "Precedent comes with authentication and database via [Auth.js](https://authjs.dev/) + [Prisma](https://prisma.io/)",
//     demo: (
//       <div className="flex items-center justify-center space-x-20">
//         <Image alt="Auth.js logo" src="/authjs.webp" width={50} height={50} />
//         <Image alt="Prisma logo" src="/prisma.svg" width={50} height={50} />
//       </div>
//     ),
//   },
//   {
//     title: "Hooks, utilities, and more",
//     description:
//       "Precedent offers a collection of hooks, utilities, and `@vercel/og`",
//     demo: (
//       <div className="grid grid-flow-col grid-rows-3 gap-10 p-10">
//         <span className="font-mono font-semibold">useIntersectionObserver</span>
//         <span className="font-mono font-semibold">useLocalStorage</span>
//         <span className="font-mono font-semibold">useScroll</span>
//         <span className="font-mono font-semibold">nFormatter</span>
//         <span className="font-mono font-semibold">capitalize</span>
//         <span className="font-mono font-semibold">truncate</span>
//       </div>
//     ),
//   },
// ];

export default Home;
