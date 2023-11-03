import React from 'react'
import Input from '@/components/shared/ui/Input'
import Button from '@/components/shared/ui/Button'

const ContactForm = () => {
    return (
        <form className="flex flex-col justify-center my-8 p-3 rounded-lg shadow w-full bg-gray-50">

            <div className="mb-3 text-left">
                <h3 className="text-2xl font-bold text-gray-800">Have Any Questions ?</h3>
                <p className="text-gray-500">Please fill the form below and we will contact you as soon as possible.</p>
            </div>
            <div className="flex flex-col items-start justify-start w-full">
                <Input
                    id="name"
                    label="Name"
                    type="text"
                    placeholder="Name"
                />
            </div>
            <div className="flex flex-col items-start justify-start w-full">
                <Input
                    id="email"
                    label="Email"
                    type="email"
                    placeholder="Email"
                />
            </div>
            <div className="flex flex-col items-start justify-start w-full">
                <Input
                    id="phone"
                    label="Mobile Phone"
                    type="text"
                    placeholder="Phone"
                />
            </div>
            <div className="flex flex-col items-start justify-start w-full">
                <Button
                    title='Submit'
                    type='submit'
                    onClick={(e) => e.preventDefault()}
                />
            </div>
        </form>
    )
}

export default ContactForm