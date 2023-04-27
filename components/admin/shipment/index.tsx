import EditableInput from '@/components/shared/EditableInput'
import ToggleBtn from '@/components/shared/ToggleBtn'
import Button from '@/components/shared/Button'
import { Shipment } from '@/modals/Shipment'
import Modal from '@/components/shared/modal'
import ConfirmDeleteItem from '@/components/shared/ConfirmDelete'
import { useEffect, useState, useContext } from 'react'
import { shipmentRepository } from '@/lib/repositries/admin'
import MultiSelect from '@/components/shared/MultiSelect'
import AdminContext from '@/stores/admin'

interface Props {
  shipment: Shipment,
  onUpdate: (data: any) => void,
  loading: boolean
  onDelete: () => void
}

const ShipmentFrom: React.FC<Props> = ({ shipment, onUpdate, loading, onDelete }) => {

  const update_partial_shipment = async (data: any) => onUpdate({ values: [data] })
  const [openConfirmDeleteModal, setOpenConfirmDeleteModal] = useState<boolean>(false)
  const [drivers, setDrivers] = useState<any[]>([])
  const [driverToAssign, setDriverToAssign] = useState<any[]>([])
  const [selectedDrivers, setSelectedDrivers] = useState<any[]>([])
  const [assignDriverError, setAssignDriverError] = useState<string | null>(null)
  const { updater, updateMeta } = useContext(AdminContext)


  const assign_shipment = async (driverId: string) => {

    await updater(shipmentRepository.assign_shipment(shipment.id, driverId), false)
  }



  const fetch_drivers = async () => {
    const token = localStorage.getItem('uidjwt')

    const res = await fetch('/api/admin/drivers', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
    const data = await res.json()

    const drivers = data.items.map((item: any) => ({ value: item.id, label: item.name }))

    const currentDriver = drivers.find((item: any) => item.value === shipment.driverId)


    if (currentDriver) {
      setSelectedDrivers([{ label: currentDriver.label, value: currentDriver.value }])
    }
    setDriverToAssign(drivers)
    setDrivers(data.items)
  }



  useEffect(() => {

    fetch_drivers()

  }, [])


  return (
    <>
      <div className='flex gap-5 items-center justify-between lg:col-span-3'>

        <div className='flex items-center justify-between gap-5'>

          <ToggleBtn value={shipment.is_fragile} onChange={(value: any) => update_partial_shipment({ is_fragile: value })} />
          <ToggleBtn value={shipment.is_liquid} onChange={(value: any) => update_partial_shipment({ is_liquid: value })} />
          <Button
            onClick={() => setOpenConfirmDeleteModal(true)}
            title='Delete'
            style='bg-red-500 text-white'
            loading={loading}
            disabled={loading}
          />

          <Modal showModal={openConfirmDeleteModal} setShowModal={() => setOpenConfirmDeleteModal(false)}>
            <ConfirmDeleteItem label='Shipment' cancel={() => setOpenConfirmDeleteModal(false)} onConfirmDelete={onDelete} />
          </Modal>

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

        <div className='border mb-2 mt-3 pb-2 px-2 rounded-xl'>
          <label htmlFor="assigned_vehicle" className='text-sm font-medium text-gray-600 block mt-2 editable-input_label'>{shipment.driverId ? 'Assigned' : 'Assign'} Driver </label>
          {assignDriverError && <p className='text-red-500'>{assignDriverError}</p>}
          {drivers.length > 0 &&
            <MultiSelect
              label='label'
              multiple={false}
              trackBy="value"
              closeOnSelect={true}
              input={(props: any) => {
                props[0] && assign_shipment(props[0].value)

              }}

              id='assigned_vehicle'
              options={driverToAssign}
              placeholder={'Assigned Vehicle'}
              disabled={loading}
              preSelected={selectedDrivers}
            />
          }
        </div>

        <ToggleBtn value={shipment.receiver.is_villa} onChange={(value: any) => update_partial_shipment({ 'receiver.is_villa': value })} />

      </div>



    </>
  )
}

export default ShipmentFrom