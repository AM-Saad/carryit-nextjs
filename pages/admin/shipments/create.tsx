import React, { useState } from 'react'
import { ShipmentPayload } from '@/modals/Shipment'
import Layout from '@/components/layout'
import { shipmentRepository } from '@/lib/repositries/admin'
import { Formik } from 'formik'
import * as Yup from "yup";
import { Status } from '@/shared/modals/Response'
import { useRouter } from 'next/router'
import { toast } from 'react-toastify'
import { INTERNAL_SHIPMENTS_ROUTE } from '@/lib/constants'
import loadable from "@loadable/component"
import GooglePlacesAutocomplete from '@/components/shared/PlaceAutoComplete'

const ToggleBtn = loadable(() => import("@/components/shared/ToggleBtn"))
const Input = loadable(() => import("@/components/shared/Input"))
const Button = loadable(() => import("@/components/shared/Button"))
const FormikInput = loadable(() => import("@/components/shared/FormikInput"))


const Create: React.FC = () => {

    const [loading, setLoading] = useState<boolean>(false)
    const router = useRouter()

    const initialValues = {
        receiver: {
            address: '',
            apartment: '',
            building: '',
            floor: '',
            name: '',
            phone: '',
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
            address: Yup.string()
                .required("Address is required"),
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
            return router.push(`${INTERNAL_SHIPMENTS_ROUTE}/${response.items}`)
        }
        toast.error(response.message)

    }


    const placeChanged = (place: {
        lat: number;
        lng: number;
        address_components: google.maps.GeocoderAddressComponent[] | undefined;
    }) => {
        const componentsToRetrieve = {
            street_number: "short_name",
            route: "long_name",
            locality: "long_name",
            country: "long_name",
            postal_code: "short_name",
        };
        const result = {
            street_number: "",
            route: "",
            locality: "",
            country: "",
            postal_code: "",
        };
        if (place.address_components) {
            for (let i = 0; i < place.address_components.length; i++) {
                const addressType = place.address_components[i].types[0];
                if ((componentsToRetrieve as any)[addressType]) {
                    (result as any)[addressType] = (place.address_components[i] as any)[
                        (componentsToRetrieve as any)[addressType]
                    ];
                }
            }
        }
        const shippingAddress = {
            streetAddress: `${result.street_number} ${result.route}`,
            streetAddressBis: "",
            postalCode: result.postal_code,
            city: result.locality,
            // name: this.form.shippingAddress.name,
        };
        const autoCompleteAddress = place
        console.log(shippingAddress)
        console.log(autoCompleteAddress)

        // this.form.autoCompleteAddress = place;
    }

    const setCurrentAddress = (val: string) => {
        const completeAddress = val;
        console.log(completeAddress)
    }

    const addressInputChanged = (val: string) => {
        if (!val || val == "") {

            // this.validation.autoCompleteAddress = true;
            // this.form.completeAddress = null;
            // this.form.shippingAddress = {
            //     streetAddress: "",
            //     streetAddressBis: "",
            //     city: "",
            //     postalCode: "",
            //     name: this.form.shippingAddress.name,
            // };
        }

        const completeAddress = null
        const autoCompleteAddress = true
        const shippingAddress = {
            streetAddress: "",
            streetAddressBis: "",
            city: "",
            postalCode: "",
            // name: this.form.shippingAddress.name,
        };
        console.log(completeAddress)
        console.log(autoCompleteAddress)
        console.log(shippingAddress)
    }

    return (
        <Layout>
            <Formik
                initialValues={initialValues}
                validationSchema={validationScheme}
                onSubmit={(values, { setSubmitting }) => {
                    createShipment(values)
                    setSubmitting(false)
                }}
            >
                {({ handleChange, handleBlur, submitForm, errors, touched, values }) => {
                    { console.log(errors) }
                    return (
                        <>
                            <div className='flex gap-5 items-center lg:col-span-3'>
                                <div className="flex gap-2 items-center">
                                    <span className=" text-gray-600 block">Is Fragile</span>
                                    <ToggleBtn value={values.is_fragile}
                                        onChange={(is_fragile: boolean) => handleChange({ target: { name: 'is_fragile', value: is_fragile } })}
                                    />
                                </div>
                                <div className="flex gap-2 items-center">
                                    <span className=" text-gray-600 block">Is Liquid </span>
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

                                    <GooglePlacesAutocomplete
                                        onChange={addressInputChanged}
                                        onInput={placeChanged}
                                        onCurrentAddress={setCurrentAddress}
                                        onInit={(e: any) => { console.log(e) }}
                                    />

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


                            {/* <div className='mt-3 mb-2'>
                                    <label htmlFor="vehicle_type" className='text-xs font-medium text-gray-600 mr-3 editable-input_label'>Vehicles Type</label>
                                    <MultiSelect
                                        label='label'
                                        multiple={false}
                                        trackBy="val"
                                        closeOnSelect={true}
                                        input={(props: any) => {
                                            if (props[0]) {
                                                handleChange({ target: { name: 'vehicle_type', value: props[0].val } })
                                            }
                                        }}
                                        id='vehicle_type'
                                        options={vehicleTypesArray.map((type: string) => ({ label: type, val: type }))}
                                        placeholder={'Vehicles type'}
                                        disabled={loading}
                                    />
                                    {errors.vehicle_type && touched.vehicle_type && <span className='text-xs text-red-500'>{errors.vehicle_type}</span>}
                                </div> */}


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
        </Layout >
    )
}

export default Create