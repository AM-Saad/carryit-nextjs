import React from 'react'
import { DEFAULT_KEYWORD, DEFUALT_DESCRIPTION } from '@/lib/constants';
import Layout from "@/components/layout";

const Why = () => {
    return (
        <Layout
            meta={{
                title: "Karry | Why Karry",
                description: DEFUALT_DESCRIPTION,
                keywords: DEFAULT_KEYWORD,
            }}
            isDashboard={false}
        >
            <div className="flex flex-col items-start justify-start w-full px-5">
                <div className="flex flex-col items-start justify-start w-full mt-3">
                    <h1 className="title text-4xl">

                        Why Karry!</h1>
                    <div>
                        <p className="mt-5 text-left text-gray-700 text-lg">* We've been in your shoe, and we know that one of the most reasons for problems is the drivers and managing them.
                            <br />
                            Thats why we created Karry, to help you manage your drivers and orders in a simple and easy way.
                            By tracking your drivers and orders, you can easily know where your drivers are and how many orders they have.
                            <br />
                            <br />
                            * Karry is a web application that can be used on any device, so you can use it on your phone, tablet or computer.
                            <br />
                            <br />
                            * Karry is a cloud based application, so you don't need to install anything on your device, just open the browser and start using it.
                            <br />
                            <br />
                            * Karry is a <span className='italic'>Pay as you use based application</span>, so you don't need to pay for the application, you just pay for you usage.
                            <br />
                            <span className="text-yellow-500">* We are currently in beta, so you can use the application for free until we launch the final version
                                <br />
                                if you're curious about the pricing, you can check <a href="/pricing" className="text-blue-500">Our Pricing calculator here</a>
                            </span>
                            <br />
                            <br />
                            * Karry is a stright forward, so you don't need to spend a lot of time learning how to use it, just sign up and start using it.
                        </p>

                    </div>
                </div>

            </div>

        </Layout>
    )
}

export default Why