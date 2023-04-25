import EditableInput from '@/components/shared/EditableInput'
import ToggleBtn from '@/components/shared/ToggleBtn'
import DocumentsContainer from '@/components/admin/driver/DocumentsContainer'
import Button from '@/components/shared/Button'
import ConfirmDeleteItem from '@/components/shared/ConfirmDelete'
import Modal from '@/components/shared/modal'
import { useState } from 'react'
interface Props {
  driver: any,
  onUpdate: (data: any) => void,
  loading: boolean
  onDelete: () => void
}

const DriverFrom: React.FC<Props> = ({ driver, onUpdate, loading, onDelete }) => {
  const [openConfirmDeleteModal, setOpenConfirmDeleteModal] = useState<boolean>(false)

  const update_partial_driver = async (data: any) => onUpdate({ values: [data] })

  return (
    <>
      <div className='flex gap-5 items-center justify-between lg:col-span-3'>
        <EditableInput
          label='Name'
          inputType="text"
          onSave={(value: string | number) => { update_partial_driver({ name: value }) }}
          defaultVal={driver.name}
          loading={loading}
          required={true}
          validationMessage={'Name is required'}

        />
        <div className='flex items-center justify-between gap-5'>

          <ToggleBtn value={driver.active} onChange={(value: any) => update_partial_driver({ active: value })} />
          <Button
            onClick={()=>setOpenConfirmDeleteModal(true)}
            title='Delete'
            style='bg-red-500 text-white'
            loading={loading}
            disabled={loading}
          />

          <Modal showModal={openConfirmDeleteModal} setShowModal={() => setOpenConfirmDeleteModal(false)}>
            <ConfirmDeleteItem label='Driver' cancel={() => setOpenConfirmDeleteModal(false)} onConfirmDelete={onDelete} />
          </Modal>
        </div>


      </div>

      <div className="col-span-3">
        <EditableInput
          label='Mobile'
          inputType="number"
          onSave={(value: string | number) => { update_partial_driver({ mobile: value }) }}
          defaultVal={driver.mobile}
          loading={loading}
          required={true}
          validationMessage={'Mobile is required'}

        />

      </div>

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
      <DocumentsContainer
        item={driver}
        context='drivers'
      />


    </>
  )
}

export default DriverFrom