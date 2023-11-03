import Layout from '@/components/layout'
import ContactForm from '@/components/shared/ContactForm'
import { DEFAULT_KEYWORD, DEFUALT_DESCRIPTION } from '@/lib/constants'
import React from 'react'

const Contact = () => {
    return (
        <Layout
            meta={{
                title: "Karry | Contact Us",
                description: DEFUALT_DESCRIPTION,
                keywords: DEFAULT_KEYWORD,
            }}
            isDashboard={false}
        >
            <div className="flex flex-col items-start justify-start w-full px-5">
                <div className="flex flex-col items-start justify-start w-full mt-3">
                    <h1 className="title text-4xl">
                        Contact Us
                    </h1>
                    <div>
                        <p className="mt-5 text-left text-gray-500">* You can contact us by sending an email to <a href="mailto:abdelrhmanm525@gmail.com" className="text-blue-500">
                        Here</a> or by filling the form below.</p>
                    </div>
                </div>
                <div className="w-full mt-4">
                    <ContactForm />
                </div>
            </div>
        </Layout >
    )
}

export default Contact