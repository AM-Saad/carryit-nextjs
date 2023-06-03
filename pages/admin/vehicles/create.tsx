import React, { useState } from 'react'
import ToggleBtn from '@/components/shared/ToggleBtn'
import MultiSelect from '@/components/shared/MultiSelect'
import { VehiclePayload, VehicleTypes, getFuelUnit, fuelTypesArray, vehicleTypesArray } from '@/modals/Vehicle'
import Input from '@/components/shared/Input'
import Layout from '@/components/layout'
import { vehicleRepository } from '@/lib/repositries/admin'
import Button from '@/components/shared/Button'
import { Formik } from 'formik'
import * as Yup from "yup";
import { Status } from '@/shared/modals/Response'
import { toast } from 'react-toastify'
import { useRouter } from 'next/router';

import { INTERNAL_VEHICLES_ROUTE } from '@/lib/constants'
import withAuth from '@/components/shared/auth';





const Create: React.FC = () => {

    const [loading, setLoading] = useState<boolean>(false)
    const router = useRouter()



    const initialValues = {
        name: null,
        vehicle_type: null,
        fuel_type: null,
        fuel_tank: {
            full_capacity: 0,
            unit: "",
            cost_per_unit: 0,
        },
        active: true,
        plate_number: null,
        model: null,


    }

    const validationScheme = Yup.object({
        name: Yup.string()
            .required("Name is required"),
        vehicle_type: Yup.string(),
        fuel_type: Yup.string()
            .required("Fuel type is required"),
        fuel_tank: Yup.object({
            full_capacity: Yup.number()
                .required("Capacity is required"),
            unit: Yup.string(),
            cost_per_unit: Yup.number()
                .required("Cost per unit is required")
        }).required("Fuel tank is required"),
        plate_number: Yup.string()
            .required("Plate number is required"),
        model: Yup.string()
            .required("Model is required"),
        active: Yup.boolean()


    })
    const createVehicle = async (payload: VehiclePayload) => {

        setLoading(true)
        const response = await vehicleRepository.create_vehicle(payload)

        setLoading(false);
        if (response.status === Status.SUCCESS) {
            return router.push(`${INTERNAL_VEHICLES_ROUTE}/${response.items.id}`)
        }
        toast.error(response.message)

    }


    return (
        <Layout
            meta={{
                title: 'Create Vehicle | Admin',
                description: 'Create Vehicle',
            }}
        >
            <div className='form-body'>

                <Formik
                    initialValues={initialValues}
                    validationSchema={validationScheme}
                    onSubmit={(values, { setSubmitting }) => {
                        createVehicle(values)
                        setSubmitting(false)
                    }}


                >
                    {({ handleChange, handleBlur, submitForm, errors, touched, values }) => {
                        { console.log(errors) }
                        return (
                            <>
                                <div className='flex gap-5 items-center lg:col-span-3'>
                                    <div className="flex gap-2 items-center">
                                        <span className=" text-gray-600 block">Active</span>
                                        <ToggleBtn value={values.active}
                                            onChange={(active: boolean) => handleChange({ target: { name: 'active', value: active } })}
                                        />
                                    </div>
                                </div>
                                <Input
                                    label="Name"
                                    id="name"
                                    placeholder=""
                                    onChange={handleChange('name')}
                                    value={values.name}
                                    handleBlur={handleBlur('name')}
                                    hasError={errors.name && touched.name}
                                    error={errors.name}
                                />
                                <Input
                                    label="Model"
                                    id="model"
                                    placeholder=""
                                    onChange={handleChange('model')}
                                    value={values.model}
                                    handleBlur={handleBlur('model')}
                                    hasError={errors.model && touched.model}
                                    error={errors.model}
                                />
                                <Input
                                    label="Plate Number"
                                    id="plate_number"
                                    placeholder=""
                                    onChange={handleChange('plate_number')}
                                    value={values.plate_number}
                                    handleBlur={handleBlur('plate_number')}
                                    hasError={errors.plate_number && touched.plate_number}
                                    error={errors.plate_number}
                                />
                                <div className='mt-3 mb-2'>
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
                                </div>

                                <div className='mt-3 mb-2'>
                                    <label htmlFor="fuel_type" className='text-xs font-medium text-gray-600 mr-3 editable-input_label'>Fuel Type</label>
                                    <MultiSelect
                                        label='label'
                                        multiple={false}
                                        trackBy="val"
                                        closeOnSelect={true}
                                        input={(props: any) => {
                                            if (props[0]) {
                                                handleChange({ target: { name: 'fuel_type', value: props[0].val } })
                                                handleChange({ target: { name: 'fuel_tank.unit', value: getFuelUnit(props[0].val) } })
                                            }
                                        }}
                                        id='fuel_type'
                                        options={fuelTypesArray.map((type: string) => ({ label: type, val: type }))}
                                        placeholder={'Fuel type'}
                                        disabled={loading}
                                    />
                                    {errors.fuel_type && touched.fuel_type && <span className='text-xs text-red-500'>{errors.fuel_type}</span>}
                                </div>

                                <div className='grid md:grid-cols-3 gap-3'>
                                    <Input
                                        label={`Full Capacity in ${getFuelUnit(values.fuel_type)}`}
                                        id="fuel_tank.full_capacity"
                                        placeholder=""
                                        type='number'
                                        onChange={handleChange('fuel_tank.full_capacity')}
                                        value={values.fuel_tank?.full_capacity}
                                        handleBlur={handleBlur}
                                        hasError={errors.fuel_tank?.full_capacity && touched.fuel_tank?.full_capacity}
                                        error={errors.fuel_tank?.full_capacity}
                                    />

                                    <Input
                                        label="Cost per Unit"
                                        id="fuel_tank.cost_per_unit"
                                        placeholder=""
                                        type='number'
                                        onChange={handleChange('fuel_tank.cost_per_unit')}
                                        value={values.fuel_tank?.cost_per_unit}
                                        handleBlur={handleBlur}
                                        hasError={errors.fuel_tank?.cost_per_unit && touched.fuel_tank?.cost_per_unit}
                                        error={errors.fuel_tank?.cost_per_unit}
                                    />
                                </div>

                                <Button
                                    title='Create'
                                    style='bg-theme text-white'
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