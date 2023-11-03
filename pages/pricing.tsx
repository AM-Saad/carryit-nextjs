import Layout from "@/components/layout";
import React from 'react'
import { DEFAULT_KEYWORD, DEFUALT_DESCRIPTION } from '@/lib/constants';
import { PricingCalculator } from "@/components/shared/PricingCalculator";
import ContactForm from "@/components/shared/ContactForm";
const pricing = () => {

    return (
        <Layout
            meta={{
                title: "Karry | Pricing",
                description: DEFUALT_DESCRIPTION,
                keywords: DEFAULT_KEYWORD,
            }}
            isDashboard={false}
        >
            <div className="flex flex-col items-start justify-start w-full px-5">
                <div className="flex flex-col items-start justify-start w-full mt-3">
                    <h1 className="title text-4xl">
                        Pricing
                    </h1>
                    <div>
                        <p className="mt-5 text-left text-gray-500">* This is an estimate cost, please contact us for more details.</p>
                        <p className="text-left text-gray-500">* The cost is calculated based on the number of branches, drivers and trips per day.</p>
                    </div>
                </div>

                <div className="w-full mt-4">
                    <PricingCalculator />

                    <ContactForm />
                </div>
            </div>
        </Layout >)
}

export default pricing