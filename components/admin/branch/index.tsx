import EditableInput from '@/components/shared/EditableInput'
import Button from '@/components/shared/Button'
import ConfirmDeleteItem from '@/components/shared/ConfirmDelete'
import Modal from '@/components/shared/modal'
import { useEffect, useState, useContext } from 'react'
import MultiSelect from '@/components/shared/MultiSelect'
import { branchRepository } from '@/lib/repositries/admin'
import AdminContext from '@/stores/admin'
import Branch from '@/modals/Branch'


interface Props {
  branch: Branch,
  onUpdate: (data: any) => void,
  loading: boolean
  onDelete: () => void
}

const BranchFrom: React.FC<Props> = ({ branch, onUpdate, loading, onDelete }) => {
  const [openConfirmDeleteModal, setOpenConfirmDeleteModal] = useState<boolean>(false)
  const [vehicles, setDrivers] = useState<any[]>([])
  const [driversToAssign, setDriversToAssign] = useState<any[]>([])
  const [selectedDrivers, setSelectedDrivers] = useState<any[]>([])
  const [assignDriversError, setAssignVehicleError] = useState<string | null>(null)


  const update_partial_branch = async (data: any) => onUpdate({ values: [data] })
  const { updater, updateMeta } = useContext(AdminContext)


  const update_drivers = async (drivers: any[]) => {

    const driverIds = drivers.map((item: any) => item.value)
    console.log(driverIds)
    update_partial_branch({ drivers: driverIds })

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

    const options = data.items.map((item: any) => ({ value: item.id, label: item.name }))


    const currentDrivers = options.filter((item: any) => branch.drivers?.includes(item.value))

    console.log(currentDrivers)
    if (currentDrivers) {
      setSelectedDrivers(currentDrivers)
    }
    setDriversToAssign(options)
    setDrivers(data.items)
  }


  useEffect(() => {

    fetch_drivers()

  }, [])


  return (
    <>
      <div className='flex gap-5 items-center justify-between lg:col-span-3'>
        <EditableInput
          label='Name'
          inputType="text"
          onSave={(value: string | number) => { update_partial_branch({ name: value }) }}
          defaultVal={branch.name}
          loading={loading}
          required={true}
          validationMessage={'Name is required'}

        />
        <div className='flex items-center justify-between gap-5'>

          <Button
            onClick={() => setOpenConfirmDeleteModal(true)}
            title='Delete'
            style='bg-red-500 text-white'
            loading={loading}
            disabled={loading}
          />

          <Modal showModal={openConfirmDeleteModal} setShowModal={() => setOpenConfirmDeleteModal(false)}>
            <ConfirmDeleteItem label='Branch' cancel={() => setOpenConfirmDeleteModal(false)} onConfirmDelete={onDelete} />
          </Modal>
        </div>


      </div>

      <div className="col-span-3">
        <EditableInput
          label='Phone'
          inputType="number"
          onSave={(value: string | number) => { update_partial_branch({ phone: value }) }}
          defaultVal={branch.phone || ''}
          loading={loading}
          required={true}
          validationMessage={'Phone is required'}

        />
        <EditableInput
          label='Address'
          inputType="number"
          onSave={(value: string | number) => { update_partial_branch({ address: value }) }}
          defaultVal={branch.address || ''}
          loading={loading}
          required={true}
          validationMessage={'Address is required'}

        />
        <EditableInput
          label='State'
          inputType="text"
          onSave={(value: string | number) => { update_partial_branch({ state: value }) }}
          defaultVal={branch.state || ''}
          loading={loading}
          required={true}
          validationMessage={'State is required'}

        />

        <EditableInput

          label='City'
          inputType="text"
          onSave={(value: string | number) => { update_partial_branch({ city: value }) }}
          defaultVal={branch.city || ''}
          loading={loading}
          required={true}
          validationMessage={'City is required'}

        />

        <EditableInput
          label='Governorate'
          inputType="text"
          onSave={(value: string | number) => { update_partial_branch({ governorate: value }) }}
          defaultVal={branch.governorate || ''}
          loading={loading}
          required={true}
          validationMessage={'Governorate is required'}

        />

      </div>



      <div className='border mb-2 mt-3 pb-2 px-2 rounded-xl'>
        <label htmlFor="drivers" className='text-sm font-medium text-gray-600 block mt-2 editable-input_label'>Drivers </label>
        {assignDriversError && <p className='text-red-500'>{assignDriversError}</p>}
        {vehicles.length > 0 &&
          <MultiSelect
            label='label'
            multiple={true}
            trackBy="value"
            closeOnSelect={false}
            input={(props: any) => {
              update_drivers(props)
            }}
            id='drivers'
            options={driversToAssign}
            placeholder={'Branch Drivers'}
            disabled={loading}
            preSelected={selectedDrivers}
          />
        }
      </div>



    </>
  )
}

export default BranchFrom