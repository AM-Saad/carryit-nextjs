import Layout from '@/components/layout'
import React from 'react'
import { motion } from "framer-motion";
import { FADE_DOWN_ANIMATION_VARIANTS } from '@/lib/constants';
import Balancer from 'react-wrap-balancer';

const terms = () => {
    return (
        <Layout>
            <motion.h1
                className="bg-gradient-to-br from-black to-stone-500 bg-clip-text text-left font-display text-3xl font-bold tracking-[-0.02em] text-transparent drop-shadow-sm md:text-5xl md:leading-[5rem]"
                variants={FADE_DOWN_ANIMATION_VARIANTS}>
                <Balancer>Terms of Use</Balancer>
            </motion.h1>
            <p className='text-gray-600 fon-medium mb-3'>
                The privacy policy governs the manner in which “Karry” collects, uses, maintains and discloses the information collected by users of the “Karry” application, and this privacy policy applies to the application and all products and services provided by Karry.
            </p>
            <div className='my-4'>

                <h3 className='font-medium mb-1'>Personally identifiable information:</h3>
                <p className='text-gray-500 text-sm'>

                    Karry collects personally identifiable information from Users in various ways, including but not limited to when the User visits the Application, registers on the Application, fills out an order form, analyzes a survey, and other activities, services, features or resources that we may offer on our Application. Users may be asked to provide their full name, email address, phone number, and credit card information.
                </p>
            </div>
            <div className='my-4'>
                <h3 className='font-medium mb-1'>Non-personal identification information:</h3>
                <p className='text-gray-500 text-sm'>
                    Karry may collect non-personal identification information about Users whenever they interact with our Application. Non-personal identification information may include the browser name, the type of computer, and technical information about the User’s means of connection to our Application, such as the operating system and the Internet service providers utilized and other similar information.
                </p>
            </div>
            <div className='my-4'>
                <h3 className='font-medium mb-1'>How we use collected information:</h3>
                <p className='text-gray-500 text-sm'>
                    Karry collects Users personal information and uses it for the following purposes:

                    Improve the quality of customer service.
                    Your information helps us respond to your customer service requests and support needs more effectively.

                    To improve the application.
                    We are constantly striving to improve the offers offered through the App or our Website according to the information and feedback we receive from you.

                    Send emails periodically.
                    The email address Users register to process their order will only be used to send information and updates pertaining to their order. It may also be used to respond to inquiries, requests, or other questions. And if the user decides to join our mailing list, he will receive messages on his email that may include news, latest updates and information related to the application. And if the user wants at any time to cancel the registration of receiving any future messages, we provide him with detailed instructions about canceling the registration at the end of each message on his e-mail, or the user can communicate with us through the application or our website.
                </p>
            </div>
            <div className='my-4'>
                <h3 className='font-medium mb-1'>How we protect your information:</h3>
                <p className='text-gray-500 text-sm'>
                    We follow appropriate security procedures and standards in data collection, storage and processing, in order to protect that data from unauthorized processing, modification, disclosure or destruction of your personal data, username, password, information about your transactions and data stored on our App. Sensitive and private data is exchanged between messengers and their users through secure communication channels and is encrypted and protected through approved digital methods and methods.
                </p>
            </div>
            <div className='my-4'>
                <h3 className='font-medium mb-1'>Sharing personal data:</h3>
                <p className='text-gray-500 text-sm'>
                    We at Karry do not sell, trade, or rent Users personally identifiable data to third parties, and we may share generic aggregated demographic information not linked to any personally identifiable information about visitors and users with our partners, affiliates, and advertisers for the purposes described above. We may use third party service providers to help us operate our business and the Application or administer activities on our behalf, such as sending out newsletters or surveys. We may share your data with these third parties for those specified purposes only if you have given us permission to do so.
                    <br />
                    We also do not share your data with any official government agency except with an official letter addressed to our company to disclose your data personally in security or criminal cases.
                </p>
            </div>
            <div className='my-4'>
                <h3 className='font-medium mb-1'>Changes to the Privacy Policy:</h3>
                <p className='text-gray-500 text-sm'>

                    Karry is free to update this privacy policy at any time. When we do, the user should review the update date at the bottom of this page, and we will send an email. We encourage Users to frequently check the Privacy Policy for any changes so that they are aware of what we are doing to protect the personal data we collect. And that the user acknowledges and agrees that it is his responsibility to review this privacy policy periodically and to be aware of the modifications.

                </p>
            </div>
            <div className='my-4'>
                <h3 className='font-medium mb-1'>
                    Agree to the Terms of Use:
                </h3>
                <p className='text-gray-500 text-sm'>
                    By using this app, you agree to our Privacy Policy and Terms of Use. If you do not agree to this policy, please do not use our app. Your continued use of the app after posting changes to this policy will be deemed your acceptance of those changes.
                </p>
            </div>

        </Layout>
    )
}

export default terms