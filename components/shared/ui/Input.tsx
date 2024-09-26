import { useMemo, useState } from "react"
import { EyeClosedIcon, EyeOpenIcon } from "@radix-ui/react-icons"
interface Props {
    label: string,
    id: string,
    placeholder: string,
    onChange?: (data: any) => void,
    onKeydown?: (data: any) => void,
    type?: string,
    defaultVal?: string,
    value?: any
    handleBlur?: any,
    hasError?: boolean | undefined | any,
    error?: string
    defaultValue?: string
}

const Input: React.FC<Props> = ({ label, id, onChange, type, placeholder, value, handleBlur, hasError, error, onKeydown,defaultValue }) => {

    const [showPassword, setShowPassword] = useState(false)
    const inputType = useMemo(() => {
        if (type === 'password') {
            return showPassword ? 'text' : 'password'
        }
        return type ? type : 'text'
    }, [showPassword, type])
    return (
        <div className="my-2 w-full relative">
            <label className="block font-medium text-xs text-gray-700 dark:text-gray-300" htmlFor={id}>{label}</label>
            <input
                id={id}
                className="p-2 rounded-lg border mt-1 outline-none w-full text-xs"
                onChange={onChange}
                onKeyDown={onKeydown}
                placeholder={placeholder}
                value={value}
                onBlur={handleBlur}
                type={inputType}
                defaultValue={defaultValue}

            />
            {type === 'password' &&
                <button
                    className="absolute right-5 top-7"
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                >
                    {showPassword ? <EyeClosedIcon /> : <EyeOpenIcon />}
                </button>
            }
            {hasError &&
                <p className="text-red-500 text-xs mt-px text-left">{error}</p>
            }
        </div>
    )
}

export default Input
