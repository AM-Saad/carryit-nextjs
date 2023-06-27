import React, { useEffect, useState } from "react";

function isEmptyOrSpaces(str: string | number) {
  return (
    str === null ||
    str === undefined ||
    (typeof str === "string" && str.match(/^ *$/) !== null)
  );
}

const EditIcon: React.FC<{
  startEdit: () => void;
  isEdit: boolean;
}> = ({ isEdit, startEdit }) => {
  return (
    <>
      {!isEdit && (
        <div
          onClick={() => {
            startEdit();
          }}
          className="flex h-4 w-4 cursor-pointer items-center justify-center rounded-full border text-xs  hover:bg-gray-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            width="9"
            height="9"
            viewBox="0 0 24 24"
            style={{ fill: "#444444" }}
          >
            {" "}
            <path d="M 18 2 L 15.585938 4.4140625 L 19.585938 8.4140625 L 22 6 L 18 2 z M 14.076172 5.9238281 L 3 17 L 3 21 L 7 21 L 18.076172 9.9238281 L 14.076172 5.9238281 z"></path>
          </svg>
        </div>
      )}
    </>
  );
};

const CancelIcon = () => {
  return (
    <>
      <svg
        width="11"
        height="11"
        viewBox="0 0 15 15"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12.8536 2.85355C13.0488 2.65829 13.0488 2.34171 12.8536 2.14645C12.6583 1.95118 12.3417 1.95118 12.1464 2.14645L7.5 6.79289L2.85355 2.14645C2.65829 1.95118 2.34171 1.95118 2.14645 2.14645C1.95118 2.34171 1.95118 2.65829 2.14645 2.85355L6.79289 7.5L2.14645 12.1464C1.95118 12.3417 1.95118 12.6583 2.14645 12.8536C2.34171 13.0488 2.65829 13.0488 2.85355 12.8536L7.5 8.20711L12.1464 12.8536C12.3417 13.0488 12.6583 13.0488 12.8536 12.8536C13.0488 12.6583 13.0488 12.3417 12.8536 12.1464L8.20711 7.5L12.8536 2.85355Z"
          fill="black"
          fill-rule="evenodd"
          clip-rule="evenodd"
        ></path>
      </svg>
    </>
  );
};

const ConfirmIcon = () => {
  return (
    <>
      <svg
        width="15"
        height="15"
        viewBox="0 0 15 15"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M11.4669 3.72684C11.7558 3.91574 11.8369 4.30308 11.648 4.59198L7.39799 11.092C7.29783 11.2452 7.13556 11.3467 6.95402 11.3699C6.77247 11.3931 6.58989 11.3355 6.45446 11.2124L3.70446 8.71241C3.44905 8.48022 3.43023 8.08494 3.66242 7.82953C3.89461 7.57412 4.28989 7.55529 4.5453 7.78749L6.75292 9.79441L10.6018 3.90792C10.7907 3.61902 11.178 3.53795 11.4669 3.72684Z"
          fill="green"
          fill-rule="evenodd"
          clip-rule="evenodd"
        ></path>
      </svg>
    </>
  );
};

// Path: components/shared/EditableInput.tsx
interface Props {
  label: string;
  inputType: string;
  defaultVal: string | number;
  loading?: boolean;
  onSave: (value: string | number) => void;
  required?: boolean;
  validationMessage?: string;
  updateBtnText?: string;
  cancelBtnText?: string;
  id?: string;
  error?: boolean;
}
const EditableInput: React.FC<Props> = (props, ref) => {
  const {
    loading,
    inputType,
    label,
    required,
    validationMessage,
    onSave,
    defaultVal,
    id,
    error = false,
  } = props;
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isTouched, setIsTouched] = useState<boolean>(false);
  const [newVal, setNewVal] = useState<string | number>(defaultVal);
  const [validationError, setValidationError] = useState<string | null>(null);

  // By Default the Loading is false
  // we need to track when the Loading became false Only after being true
  const [Finished, setFinished] = useState(0);

  const checkKeyboardEvent = (e: KeyboardEvent) => {
    if (e.key === "Escape") if (isTouched) return cancel();
    if (e.key === "Enter") {
      if (isTouched) return submit();
    }
  };

  const handleChange = (e: any) => {
    setValidationError(null);
    if (isEditing && isTouched) {
      if (required && isEmptyOrSpaces(e.target.value)) {
        setValidationError(validationMessage || "This field is required!");
      }
    }
    setNewVal(e.target.value);
  };

  const cancel = (): void => {
    setIsEditing(false);
    setValidationError(null);
    setNewVal(defaultVal);
  };
  const submit = (): void => {
    setValidationError(null);
    setIsTouched(true);
    if (required && isEmptyOrSpaces(newVal)) {
      return setValidationError(validationMessage || "This field is required!");
    }
    if (loading === undefined || loading === null) {
      setIsEditing(false);
    }
    return onSave(newVal);
  };

  useEffect(() => {
    document.addEventListener("keydown", checkKeyboardEvent);

    // Finished will be (1) only if the Loading became true
    // If the Loading became false Again after Finished became (1) then finish the editing
    if (loading !== undefined || loading !== null) {
      if (loading) setFinished(1);
      if (!loading && Finished === 1 && isTouched) {
        setIsEditing(false);
        setIsTouched(false);
      }
    }
    return () => {
      setFinished(0);
      document.removeEventListener("keydown", checkKeyboardEvent);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTouched, loading, newVal]);

  useEffect(() => {
    setNewVal(defaultVal);
  }, [defaultVal, error]);

  return (
    <>
      <div className="editable-input my-2 pb-2 text-left" key={id} id={id}>
        <div className="mb-1 flex items-center">
          <label
            htmlFor={`update_${label}`}
            className="editable-input_label mr-1 block text-xs font-medium text-gray-700"
          >
            {label}
          </label>
          <EditIcon isEdit={isEditing} startEdit={() => setIsEditing(true)} />
        </div>

        {!isEditing && (
          <p
            className={`editable-input_value ml-1 text-xs font-medium text-gray-700`}
          >
            {inputType === "password" ? "......." : newVal || "n.c."}
          </p>
        )}

        {isEditing && (
          <div className="relative">
            <input
              onFocus={() => setIsTouched(true)}
              onBlur={() => setIsTouched(false)}
              disabled={loading}
              autoFocus
              className=" editable-input_input  w-full rounded-md border border-gray-300 pl-1 pr-24 text-xs focus:outline-0 focus:ring-0"
              onChange={handleChange}
              id={`update_${label}`}
              type={inputType}
              placeholder={`Add ${label}`}
              defaultValue={newVal}
            />
            <p className="editable-input_error mt-2 text-sm text-red-400">
              {validationError}
            </p>

            <div className="absolute bottom-[6px] right-1 mt-1 flex justify-end gap-2">
              <button
                type="button"
                className="editable-input_cancel rounded-full px-3 py-1 text-xs text-white shadow hover:bg-gray-100"
                onClick={cancel}
                disabled={loading}
              >
                <CancelIcon />
              </button>
              <button
                type="button"
                className={`editable-input_update rounded-full px-3 py-1 text-xs text-white shadow hover:bg-gray-100 ${
                  isEditing && error ? "opacity-70" : ""
                }`}
                onClick={submit}
                disabled={loading}
              >
                {!loading ? <ConfirmIcon /> : <img className="h-4" src="/icons/edit2.webp"/>}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default EditableInput;
