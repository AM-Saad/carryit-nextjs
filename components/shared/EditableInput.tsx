import React, { useEffect, useState } from 'react'


function isEmptyOrSpaces(str: string | number) {
  return str === null || str === undefined || (typeof str === 'string' && str.match(/^ *$/) !== null);
}
const EditIcon: React.FC<{
  startEdit: () => void;
  isEdit: boolean;
}> = ({ isEdit, startEdit }) => {
  return (
    <>
      {!isEdit &&
        <div onClick={() => { startEdit() }} className='border flex h-4 w-4 text-xs hover:bg-blue-200 items-center justify-center rounded-full  cursor-pointer'>
          <svg

            xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
            width="9" height="9"
            viewBox="0 0 24 24"
            style={{ fill: "#444444" }}>    <path d="M 18 2 L 15.585938 4.4140625 L 19.585938 8.4140625 L 22 6 L 18 2 z M 14.076172 5.9238281 L 3 17 L 3 21 L 7 21 L 18.076172 9.9238281 L 14.076172 5.9238281 z"></path></svg>
        </div>

      }
    </>
  )
}


interface Props {
  label: string,
  inputType: string;
  defaultVal: string | number,
  loading?: boolean;
  onSave: (value: string | number) => void
  required?: boolean
  validationMessage?: string
  updateBtnText?: string
  cancelBtnText?: string
  id?: string;
  error?: boolean;
}
const EditableInput: React.FC<Props> = ((props, ref) => {

  const { loading, inputType, label, required, validationMessage, onSave, defaultVal, updateBtnText, cancelBtnText, id, error = false } = props
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [isTouched, setIsTouched] = useState<boolean>(false)
  const [newVal, setNewVal] = useState<string | number>(defaultVal)
  const [validationError, setValidationError] = useState<string | null>(null)

  // By Default the Loading is false 
  // we need to track when the Loading became false Only after being true
  const [Finished, setFinished] = useState(0)

  const checkKeyboardEvent = (e: KeyboardEvent) => {
    if (e.key === "Escape") if (isTouched) return cancel()
    if (e.key === "Enter") {
      if (isTouched) return submit()
    }
  }

  const handleChange = (e: any) => {
    setValidationError(null)
    if (isEditing && isTouched) {
      if (required && isEmptyOrSpaces(e.target.value)) {
        setValidationError(validationMessage || 'This field is required!')
      }
    }
    setNewVal(e.target.value)
  }

  const cancel = (): void => {
    setIsEditing(false)
    setValidationError(null)
    setNewVal(defaultVal)
  }
  const submit = (): void => {
    setValidationError(null)
    setIsTouched(true)
    if (required && isEmptyOrSpaces(newVal)) {
      return setValidationError(validationMessage || 'This field is required!')
    }
    if (loading === undefined || loading === null) {
      setIsEditing(false)
    }
    return onSave(newVal)
  }

  useEffect(() => {

    document.addEventListener('keydown', checkKeyboardEvent)

    // Finished will be (1) only if the Loading became true
    // If the Loading became false Again after Finished became (1) then finish the editing
    if (loading !== undefined || loading !== null) {
      if (loading) setFinished(1)
      if (!loading && Finished === 1 && isTouched) {
        setIsEditing(false)
        setIsTouched(false)
      }
    }
    return () => {
      setFinished(0)
      document.removeEventListener('keydown', checkKeyboardEvent)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTouched, loading, newVal])


  useEffect(() => {
    setNewVal(defaultVal)
  }, [defaultVal, error])


  return (
    <>
      <div className="editable-input text-left pb-2" key={id} id={id}>
        <div className="flex items-center mb-2">
          <label htmlFor={`update_${label}`} className="text-xs font-medium text-gray-600 mr-3 editable-input_label">{label}</label>
          <EditIcon isEdit={isEditing} startEdit={() => setIsEditing(true)} />
        </div>

        {!isEditing && <p className={` mr-5  font-medium text-xs editable-input_value`}>{newVal || 'n.c.'}</p>}
        {isEditing &&
          <div>
            <input
              onFocus={() => setIsTouched(true)}
              onBlur={() => setIsTouched(false)}
              disabled={loading}
              autoFocus
              className=" editable-input_input my-1 focus:outline-0 focus:ring-0 w-full pl-1 text-xs border border-gray-300 rounded-md"
              onChange={handleChange}
              id={`update_${label}`}
              type={inputType}
              placeholder={`Add ${label}`}
              defaultValue={newVal} />
            <p className='text-red-400 mt-2 editable-input_error text-sm'>{validationError}</p>
            <div className="flex justify-end gap-2 mt-1">
              <button
                type="button"
                className="shadow py-1 px-3 text-xs bg-gray-800 rounded-full hover:opacity-70 text-white editable-input_cancel"
                onClick={cancel}>
                {loading ? `${cancelBtnText ? cancelBtnText : 'Cancel'}...` : `${cancelBtnText ? cancelBtnText : 'Cancel'}`}
              </button>
              <button
                type="button"
                className={`shadow py-1 px-3 text-xs bg-green-500 rounded-full hover:opacity-70 text-white editable-input_update ${(isEditing && error) ? 'opacity-70' : ''}`}
                onClick={submit}>{loading ? `${updateBtnText ? updateBtnText : 'Update'}...` : `${updateBtnText ? updateBtnText : 'Update'}`}</button>
            </div>
          </div>}
      </div>
    </>

  )
})

export default EditableInput