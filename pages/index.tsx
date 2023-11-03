import Layout from "@/components/layout";
import Balancer from "react-wrap-balancer";
import { motion } from "framer-motion";
import { DEFAULT_KEYWORD, DEFUALT_DESCRIPTION } from '@/lib/constants';
import MainScene from "@/components/home/3d/index";
const Home = () => {


  return (
    <Layout
      meta={{
        title: "Karry",
        description: DEFUALT_DESCRIPTION,
        keywords: DEFAULT_KEYWORD,
      }}
      isDashboard={false}
    >
      <div

      >
        <motion.div className={`mt-10 md:mt-20 absolute z-20 p-5 md:p-10`}
          initial="hidden"
          whileInView="show"
          animate="show"
          viewport={{ once: true }}
          variants={
            {
              hidden: {
                opacity: 0,
                y: 800,
                transition: {
                  delay: 1.5
                },
              },
              show: {
                opacity: 1,
                y: 0,
                transition: {
                  delay: 1.5
                }
              },
            }
          }
        >

          <motion.p
            className="text-xl lg:text-4xl mt-4 text-gray-500 max-w-lg"
          // variants={FADE_DOWN_ANIMATION_VARIANTS}
          >
            <Balancer>
              Take your order fulfillment to the next level with our cutting-edge service.
            </Balancer>
          </motion.p>
          <motion.h1
            className="title ml-[3px]"
          // variants={FADE_DOWN_ANIMATION_VARIANTS}
          >
            <Balancer>Let Em Karry!</Balancer>
          </motion.h1>
          <motion.div
            className="mx-auto mt-6 flex items-center space-x-5"
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


      </div>

      <MainScene />


    </Layout>
  );
};

export default Home;
