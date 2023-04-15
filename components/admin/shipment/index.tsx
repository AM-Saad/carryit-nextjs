import EditableInput from '@/components/shared/EditableInput'
import ToggleBtn from '@/components/shared/ToggleBtn'
import DocumentsContainer from '@/components/admin/driver/DocumentsContainer'
import MultiSelect from '@/components/shared/MultiSelect'
import Button from '@/components/shared/Button'

interface Props {
  shipment: any,
  onUpdate: (data: any) => void,
  onDelete: () => void,
  loading: boolean
}




const ShipmentFrom: React.FC<Props> = ({ shipment, onUpdate, loading,onDelete }) => {

  const update_partial = async (data: any) => onUpdate(data)



  return (
    <div>
      <div className=' justify-between items-center'>
        <div className='flex justify-end items-center gap-3'>
        
          <Button
            onClick={onDelete}
            title='Delete'
            style='bg-red-500 text-white'
            loading={loading}
            disabled={loading}
          />
        </div>
        <EditableInput
          label='Name'
          inputType="text"
          onSave={(value: string | number) => { update_partial([{ name: value }]) }}
          defaultVal={shipment.name}
          loading={loading}
          required={true}
          validationMessage={'Name is required'}
        />

      </div>

      <div className=' '>
        <div className='w-full'>

          <div className='border mb-2 mt-3 pb-2 px-2 rounded-xl'>
            <label htmlFor="vehicle_type" className='text-sm font-medium text-gray-600 block mt-2 editable-input_label'>Vehicle Type</label>
            <MultiSelect
              label='label'
              multiple={false}
              trackBy="val"
              closeOnSelect={true}
              input={(props: any) => { props[0] && update_partial([{ vehicle_type: props[0].val }]) }}
              id='vehicle_type'
              options={vehicleTypesArray.map((i) => ({ val: i, label: i }))}
              placeholder={'Vehicle type'}
              disabled={loading}
              preSelected={[{ val: vehicle.vehicle_type, label: vehicle.vehicle_type }]}

            />
          </div>
          <div className='border mb-2 mt-3 pb-2 px-2 rounded-xl'>
            <label htmlFor="fuel_type" className='text-sm font-medium text-gray-600 block mt-2 editable-input_label'>Fuel Type</label>

            <MultiSelect
              label='label'
              multiple={false}
              trackBy="val"
              closeOnSelect={true}
              input={(props: any) => {
                props[0] && update_partial([{ fuel_type: props[0].val }, {
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
          <div className='border flex gap-5 items-center mb-2 p-2 rounded-xl'>
            <EditableInput
              label='Full Tank Capacity'
              inputType="number"
              onSave={(value: string | number) => {
                update_partial([{
                  fuel_tank: {
                    ...vehicle.fuel_tank,
                    full_capacity: Number(value)
                  }
                }])
              }}
              defaultVal={vehicle.fuel_tank?.full_capacity   || 0}
              loading={loading}
              required={true}
              validationMessage={'Tank Capacity is required'}


            />
            <EditableInput
              label='Cost Per Unit'
              inputType="number"
              onSave={(value: string | number) => {
                update_partial([{
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

      </div>
      )
}

      export default ShipmentFrom