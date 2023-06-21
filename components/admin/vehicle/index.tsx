import { useState,useEffect } from 'react'
import EditableInput from '@/components/shared/EditableInput'
import ToggleBtn from '@/components/shared/ToggleBtn'
import DocumentsContainer from '@/components/admin/driver/DocumentsContainer'
import MultiSelect from '@/components/shared/MultiSelect'
import Vehicle, { VehicleTypes, fuelTypesArray, vehicleTypesArray, getFuelUnit } from '@/modals/Vehicle'
import Button from '@/components/shared/Button'
import Modal from '@/components/shared/modal'
import ConfirmDeleteItem from '@/components/shared/ConfirmDelete'
import { BRANCHES_ROUTE } from '@/lib/constants'
import { getHeaders } from '@/lib/utils'
import Response from '@/shared/modals/Response'
import Home from '@/components/shared/icons/home'

interface Props {
  vehicle: Vehicle,
  onUpdate: (data: any) => void,
  onDelete: () => void,
  loading: boolean
}




const VehicleFrom: React.FC<Props> = ({ vehicle, onUpdate, loading, onDelete }) => {

  const update_partial_vehicle = async (data: any) => onUpdate(data)
  const [openConfirmDeleteModal, setOpenConfirmDeleteModal] = useState<boolean>(false)
  const [branchName, setBranchName] = useState<string | null>(null)

  const fetch_driver_branch = async () => {
    if(!vehicle.branchId) return setBranchName('Not assosiated to branch')
    const token = localStorage.getItem('uidjwt')!

    const res:any= await fetch(`${BRANCHES_ROUTE}/${vehicle.branchId}`, {  headers: getHeaders(token) })
    const data:Response<Vehicle>  = await res.json().then((data:Response<Vehicle>) => data)

    const branch = data.items as Vehicle
    setBranchName(branch ? branch.name : 'Not assosiated to branch')
  }

  useEffect(() => {
    fetch_driver_branch()
  }, [])

  return (
    <>
      <div className='items-header'>
        <div>

        <h1 className='title'>{vehicle.name}</h1>
        <span className='text-xs flex items-center gap-x-2 mt-1'>
          <Home 
          className='w-3 h-3'
          />
           {branchName || '....'}</span>
        </div>
        <div className='flex items-center justify-between gap-5'>

          <Button
            onClick={() => setOpenConfirmDeleteModal(true)}
            title='Delete'
            style='bg-red-500 text-white'
            loading={loading}
            disabled={loading}
          />

          <Modal showModal={openConfirmDeleteModal} setShowModal={() => setOpenConfirmDeleteModal(false)}>
            <ConfirmDeleteItem label='driver' cancel={() => setOpenConfirmDeleteModal(false)} onConfirmDelete={onDelete} />
          </Modal>
        </div>


      </div>
      <div className='form-body'>

        <EditableInput
          label='Name'
          inputType="text"
          onSave={(value: string | number) => { update_partial_vehicle([{ name: value }]) }}
          defaultVal={vehicle.name}
          loading={loading}
          required={true}
          validationMessage={'Name is required'}
        />

     
        <div className='w-full'>

          <div className='border mb-2 mt-3 pb-2 px-2 rounded-lg'>
            <label htmlFor="vehicle_type" className='text-sm font-medium text-gray-600 block mt-2 editable-input_label'>Vehicle Type</label>
            <MultiSelect
              label='label'
              multiple={false}
              trackBy="val"
              closeOnSelect={true}
              input={(props: any) => { props[0] && update_partial_vehicle([{ vehicle_type: props[0].val }]) }}
              id='vehicle_type'
              options={vehicleTypesArray.map((i) => ({ val: i, label: i }))}
              placeholder={'Vehicle type'}
              disabled={loading}
              preSelected={[{ val: vehicle.vehicle_type, label: vehicle.vehicle_type }]}

            />
          </div>
          <div className='border mb-2 mt-3 pb-2 px-2 rounded-lg'>
            <label htmlFor="fuel_type" className='text-sm font-medium text-gray-600 block mt-2 editable-input_label'>Fuel Type</label>

            <MultiSelect
              label='label'
              multiple={false}
              trackBy="val"
              closeOnSelect={true}
              input={(props: any) => {
                props[0] && update_partial_vehicle([{ fuel_type: props[0].val }, {
                  fuel_tank: {
                    ...vehicle.fuel_tank,
                    unit: getFuelUnit(props[0].val)
                  }
                }])
              }}

              id='fuel_type'
              options={fuelTypesArray.map((i) => ({ val: i, label: i }))}
              placeholder={'Fuel type'}
              disabled={loading}
              preSelected={[{ val: vehicle.fuel_type, label: vehicle.fuel_type }]}
            />
          </div>
          <div className='border flex gap-5 items-center mb-2 p-2 rounded-lg'>
            <EditableInput
              label='Full Tank Capacity'
              inputType="number"
              onSave={(value: string | number) => {
                update_partial_vehicle([{
                  fuel_tank: {
                    ...vehicle.fuel_tank,
                    full_capacity: Number(value)
                  }
                }])
              }}
              defaultVal={vehicle.fuel_tank?.full_capacity || 0}
              loading={loading}
              required={true}
              validationMessage={'Tank Capacity is required'}


            />
            <EditableInput
              label='Cost Per Unit'
              inputType="number"
              onSave={(value: string | number) => {
                update_partial_vehicle([{
                  fuel_tank: {
                    ...vehicle.fuel_tank,
                    cost_per_unit: Number(value)
                  }
                }])
              }}
              defaultVal={vehicle.fuel_tank?.cost_per_unit || 0}
              loading={loading}
              required={true}
              validationMessage={'Cost is required'}


            />
          </div>
          {/* <EditProductCategory defaultVal={currentProduct!.category} loading={updatingMeta.loading} onSave={(value: any) => update_partial_product([{ category: value }])} /> */}

        </div>
        <DocumentsContainer
          item={vehicle}
          context='vehicles'
        />

      </div>

    </>
  )
}

export default VehicleFrom