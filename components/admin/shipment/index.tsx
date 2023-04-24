import EditableInput from '@/components/shared/EditableInput'
import ToggleBtn from '@/components/shared/ToggleBtn'
import DocumentsContainer from '@/components/admin/driver/DocumentsContainer'
import Button from '@/components/shared/Button'
import { Shipment } from '@/modals/Shipment'

interface Props {
  shipment: Shipment,
  onUpdate: (data: any) => void,
  loading: boolean
  onDelete: () => void
}

const ShipmentFrom: React.FC<Props> = ({ shipment, onUpdate, loading, onDelete }) => {

  const update_partial_shipment = async (data: any) => onUpdate({ values: [data] })

  return (
    <>
      <div className='flex gap-5 items-center justify-between lg:col-span-3'>

        <div className='flex items-center justify-between gap-5'>

          <ToggleBtn value={shipment.is_fragile} onChange={(value: any) => update_partial_shipment({ is_fragile: value })} />
          <ToggleBtn value={shipment.is_liquid} onChange={(value: any) => update_partial_shipment({ is_liquid: value })} />
          <Button
            onClick={onDelete}
            title='Delete'
            style='bg-red-500 text-white'
            loading={loading}
            disabled={loading}
          />
        </div>


      </div>
      <div className="col-span-3">


        {/* <EditProductCategory defaultVal={currentProduct!.category} loading={updatingMeta.loading} onSave={(value: any) => update_partial_product([{ category: value }])} /> */}

      </div>
      <div className="col-span-3">
        <EditableInput
          label='Name'
          inputType="text"
          onSave={(value: string | number) => { update_partial_shipment({ 'receiver.name': value }) }}
          defaultVal={shipment.receiver.name}
          loading={loading}
          required={true}
          validationMessage={'name is required'}

        />
        <EditableInput
          label='Mobile'
          inputType="number"
          onSave={(value: string | number) => { update_partial_shipment({ 'receiver.phone': value }) }}
          defaultVal={shipment.receiver.phone}
          loading={loading}
          required={true}
          validationMessage={'Mobile is required'}

        />
        <div className='grid grid-cols-2 gap-5'>

          <EditableInput
            label='Address'
            inputType="text"
            onSave={(value: string | number) => { update_partial_shipment({ 'receiver.address': value }) }}
            defaultVal={shipment.receiver.address}
            loading={loading}
            required={true}
            validationMessage={'Address is required'}

          />
          <EditableInput
            label='Apartment'
            inputType="number"
            onSave={(value: string | number) => { update_partial_shipment({ 'receiver.apartment': value }) }}
            defaultVal={shipment.receiver.apartment}
            loading={loading}
            required={true}
            validationMessage={'Apartment is required'}

          />
          <EditableInput
            label='Building'
            inputType="number"
            onSave={(value: string | number) => { update_partial_shipment({ 'receiver.building': value }) }}
            defaultVal={shipment.receiver.building}
            loading={loading}
            required={true}
            validationMessage={'Building is required'}

          />
          <EditableInput
            label='City'
            inputType="text"
            onSave={(value: string | number) => { update_partial_shipment({ 'receiver.city': value }) }}
            defaultVal={shipment.receiver.city || ''}
            loading={loading}
            required={false}
            validationMessage={'City is required'}

          />
          <EditableInput
            label='State'
            inputType="text"
            onSave={(value: string | number) => { update_partial_shipment({ 'receiver.state': value }) }}
            defaultVal={shipment.receiver.state || ''}
            loading={loading}
            required={false}
            validationMessage={'State is required'}

          />
          <EditableInput
            label='Zip'
            inputType="text"
            onSave={(value: string | number) => { update_partial_shipment({ 'receiver.zip': value }) }}
            defaultVal={shipment.receiver.zip || ''}
            loading={loading}
            required={false}
            validationMessage={'Zip is required'}

          />
        </div>

        <ToggleBtn value={shipment.receiver.is_villa} onChange={(value: any) => update_partial_shipment({ 'receiver.is_villa': value })} />

      </div>



    </>
  )
}

export default ShipmentFrom