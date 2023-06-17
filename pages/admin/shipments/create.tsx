import React, { useState } from 'react'
import { Shipment, ShipmentPayload } from '@/modals/Shipment'
import Layout from '@/components/layout'
import { shipmentRepository } from '@/lib/repositries/admin'
import { Formik } from 'formik'
import * as Yup from "yup";
import { useRouter } from 'next/router'
import { toast } from 'react-toastify'
import { INTERNAL_SHIPMENTS_ROUTE } from '@/lib/constants'
import loadable from "@loadable/component"
import PlacesAutocomplete from '@/components/shared/PlaceAutoComplete2'
import { Status } from '@/shared/modals/Response'
import withAuth from '@/components/shared/auth';

const ToggleBtn = loadable(() => import("@/components/shared/ToggleBtn"))
const Input = loadable(() => import("@/components/shared/Input"))
const Button = loadable(() => import("@/components/shared/Button"))
const FormikInput = loadable(() => import("@/components/shared/FormikInput"))


const Create: React.FC = () => {

    const [loading, setLoading] = useState<boolean>(false)
    const [shippingAddress, setShippingAddress] = useState<any>(null)
    const router = useRouter()

    const initialValues = {
        receiver: {
            address: '',
            apartment: '',
            building: '',
            floor: '',
            name: '',
            phone: '',
            shipping_address: null,
        },
        quantity: 1,
        is_fragile: false,
        is_liquid: false,
        notes: '',
        price: 0,
        shipping_cost: 0,
        date: new Date(),
        delivery_date: new Date(),

    }

    const validationScheme = Yup.object({

        receiver: Yup.object({
            address: Yup.string(),
            apartment: Yup.string(),
            building: Yup.string()
                .required("Building number is required"),
            floor: Yup.string()
                .required("Floor number is required"),
            name: Yup.string()
                .required("Name is required"),
            phone: Yup.string()
                .required("Phone number is required"),

        }).required("All Receiver info is required"),
        quantity: Yup.number()
            .required("Quantity is required")
            .min(1, "Quantity must be at least 1"),
        is_fragile: Yup.boolean(),
        is_liquid: Yup.boolean(),
        notes: Yup.string(),
        price: Yup.number()
            .required("Price is required")
            .min(0, "Price must be positive")
        ,
        shipping_cost: Yup.number()
            .required("Shipping cost is required")
            .min(0, "Shipping cost must be positive")
        ,
        date: Yup.date()
            .default(() => new Date()),
        delivery_date: Yup.date()
            .default(() => new Date()),

    })
    const createShipment = async (payload: ShipmentPayload) => {

        setLoading(true)
        const response = await shipmentRepository.create_shipment(payload)
        setLoading(false)
        if (response.status === Status.SUCCESS) {
            const shipment = response.items as Shipment
            router.push(`${INTERNAL_SHIPMENTS_ROUTE}/${shipment.id}`)
            return toast.success(response.message)
        }
        toast.error(response.message)

    }

    return (
        <Layout
            meta={{
                title: "Create Shipment",
                description: "Create Shipment",
            }}
        >
            <div className="form-body">
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationScheme}
                    onSubmit={(values, { setSubmitting }) => {
                        createShipment({ ...values, receiver: { ...values.receiver, address: shippingAddress.formatted_address, shipping_address: shippingAddress } })
                        setSubmitting(false)
                    }}
                >
                    {({ handleChange, handleBlur, submitForm, errors, touched, values }) => {
                        { console.log(errors) }
                        return (
                            <>
                                <h1 className='font-medium mb-5'>Create Shipment</h1>
                                <div className='flex gap-5 items-center lg:col-span-3'>
                                    <div className="flex gap-2 items-center">
                                        <span className=" text-gray-600 block">Fragile</span>
                                        <ToggleBtn value={values.is_fragile}
                                            onChange={(is_fragile: boolean) => handleChange({ target: { name: 'is_fragile', value: is_fragile } })}
                                        />
                                    </div>
                                    <div className="flex gap-2 items-center">
                                        <span className=" text-gray-600 block">Liquid </span>
                                        <ToggleBtn value={values.is_liquid}
                                            onChange={(is_liquid: boolean) => handleChange({ target: { name: 'is_liquid', value: is_liquid } })}
                                        />
                                    </div>
                                </div>
                                <FormikInput label="Receiver Name" name="receiver.name" />
                                <FormikInput label="Receiver Phone" name="receiver.phone" />
                                <FormikInput label="Amount to be collected" name="price" type="number" />
                                <FormikInput label="Shipping Cost" name="shipping_cost" type="number" />
                                <FormikInput label="Quantity" name="quantity" type="number" />
                                <div className='grid md:grid-cols-3 gap-3'>
                                    <div className='my-2'>
                                        <label htmlFor={"Address"} className='block font-medium text-xs text-gray-700 mb-1'>Address</label>
                                        <PlacesAutocomplete setSelected={(e: any) => { setShippingAddress(e) }} />
                                    </div>
                                    {/* <FormikInput label="Address" name="receiver.address" /> */}
                                    <FormikInput label="Building Number" name="receiver.building" type="number" />
                                    <FormikInput label="Floor Number" name="receiver.floor" type="number" />
                                    <FormikInput label="Apartment Number" name="receiver.apartment" type="number" />
                                </div>

                                <Input
                                    label="Additional Notes"
                                    id="notes"
                                    placeholder="Add Notes"
                                    type='text'
                                    onChange={handleChange('notes')}
                                    value={values.notes}
                                    handleBlur={handleBlur}
                                    hasError={errors.notes && touched.notes}
                                    error={errors.notes}
                                />

                                <Button
                                    title='Create'
                                    style='bg-theme text-white'
                                    type='submit'
                                    onClick={submitForm}
                                    loading={loading}
                                    disabled={loading} />
                            </>
                        )
                    }}
                </Formik>
            </div>
        </Layout>
    )
}

export default withAuth(Create)

