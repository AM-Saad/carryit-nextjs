import EditableInput from '@/components/shared/EditableInput'
import ToggleBtn from '@/components/shared/ToggleBtn'
import DocumentsContainer from '@/components/admin/driver/DocumentsContainer'
import Button from '@/components/shared/Button'
import ConfirmDeleteItem from '@/components/shared/ConfirmDelete'
import Modal from '@/components/shared/modal'
import { useEffect, useState, useContext } from 'react'
import MultiSelect from '@/components/shared/MultiSelect'
import { driverRepository } from '@/lib/repositries/admin'
import AdminContext from '@/stores/admin'
import { BRANCHES_ROUTE, VEHICLES_ROUTE } from '@/lib/constants'
import Response from '@/shared/modals/Response'
import Branch from '@/modals/Branch'
import { getHeaders } from '@/lib/utils'
import Home from '@/components/shared/icons/home'
interface Props {
  driver: any,
  onUpdate: (data: any) => void,
  loading: boolean
  onDelete: () => void
}

const DriverFrom: React.FC<Props> = ({ driver, onUpdate, loading, onDelete }) => {
  const [openConfirmDeleteModal, setOpenConfirmDeleteModal] = useState<boolean>(false)
  const [vehicles, setVehicles] = useState<any[]>([])
  const [vehiclesToAssign, setVehicleToAssign] = useState<any[]>([])
  const [selectedVehicles, setSelectedVehicles] = useState<any[]>([])
  const [assignVehicleError, setAssignVehicleError] = useState<string | null>(null)
  const [branchName , setBranchName] = useState<string | null>(null)
  const { updater, updateMeta } = useContext(AdminContext)


  const update_partial_driver = async (data: any) => onUpdate({ values: [data] })


  const assign_vehicle = async (vehicleId: string | null) => {
    await updater(driverRepository.assign_vehicle(driver.id, vehicleId), false)
  }


  const fetch_vehicles = async () => {
    const token = localStorage.getItem('uidjwt')

    const res = await fetch(`${VEHICLES_ROUTE}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
    const data = await res.json()
 
    const vehicles = data.items.filter((item: any) => item.branchId === driver.branchId).map((item: any) => ({ label: item.name, value: item.id }))

    const currentVehicle = vehicles.find((item: any) => item.value === driver.vehicleId)


    if (currentVehicle) {
      setSelectedVehicles([{ label: currentVehicle.label, value: currentVehicle.value }])
    }
    setVehicleToAssign(vehicles)
    setVehicles(data.items)
  }

  const fetch_driver_branch = async () => {
    if(!driver.branchId) return setBranchName('Not assosiated to branch')
    const token = localStorage.getItem('uidjwt')!

    const res:any= await fetch(`${BRANCHES_ROUTE}/${driver.branchId}`, {  headers: getHeaders(token) })
    const data:Response<Branch>  = await res.json().then((data:Response<Branch>) => data)

    const branch = data.items as Branch
    setBranchName(branch ? branch.name : 'Not assosiated to branch')
  }

  useEffect(() => {

    fetch_vehicles()
    fetch_driver_branch()

  }, [])


  return (
    <>
      <div className='items-header'>
        <div>

        <h1 className='title'>{driver.name || 'n.c.'}</h1>
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
            loading={loading || updateMeta.loading}
            disabled={loading || updateMeta.loading}
          />

          <Modal showModal={openConfirmDeleteModal} setShowModal={() => setOpenConfirmDeleteModal(false)}>
            <ConfirmDeleteItem label='driver' cancel={() => setOpenConfirmDeleteModal(false)} onConfirmDelete={onDelete} loading={updateMeta.loading} />
          </Modal>
        </div>


      </div>

      <div className="form-body">
        {/* <ToggleBtn value={driver.active} onChange={(value: any) => update_partial_driver({ active: value })} /> */}

        <EditableInput
          label='Name'
          inputType="text"
          onSave={(value: string | number) => { update_partial_driver({ name: value }) }}
          defaultVal={driver.name}
          loading={loading}
          required={true}
          validationMessage={'Name is required'}

        />
        <EditableInput
          label='Mobile'
          inputType="number"
          onSave={(value: string | number) => { update_partial_driver({ mobile: value }) }}
          defaultVal={driver.mobile}
          loading={loading}
          required={true}
          validationMessage={'Mobile is required'}

        />


        <EditableInput
          label='Base Salary'
          inputType="number"
          onSave={(value: string | number) => {
            console.log(value)
            update_partial_driver({
              salary: {
                ...driver.salary,
                base_salary: Number(value),
              }
            })
          }}
          defaultVal={driver.salary.base_salary || 0}
          loading={loading}
          required={false}
        />
        <EditableInput
          label='Commission'
          inputType="number"
          onSave={(value: string | number) => {
            update_partial_driver(
              {
                salary: {
                  ...driver.salary,
                  commission: Number(value),
                }
              }
            )
          }}
          defaultVal={driver.salary.commission}
          loading={loading}
          required={false}
        />

        <div className='border mb-2 mt-3 pb-2 px-2 rounded-lg'>
          <label htmlFor="assigned_vehicle" className='text-sm font-medium text-gray-600 block mt-2 editable-input_label'>Assigned Vehicle </label>
          {assignVehicleError && <p className='text-red-500'>{assignVehicleError}</p>}
          {vehicles.length > 0 &&
            <MultiSelect
              label='label'
              multiple={false}
              trackBy="value"
              closeOnSelect={true}
              input={(props: any) => {
                props[0] && assign_vehicle(props[0].value)

              }}

              id='assigned_vehicle'
              options={vehiclesToAssign}
              placeholder={'Assigned Vehicle'}
              disabled={loading}
              preSelected={selectedVehicles}
            />
          }
        </div>

        <DocumentsContainer
          item={driver}
          context='drivers'
          
        />
      </div>



    </>
  )
}

export default DriverFrom