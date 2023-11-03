
interface Props {
    children?: any
    title: string;
    onClick: (e: any) => void;
    style?: any,
    loading?: boolean
    disabled?: boolean
    type?: 'button' | 'submit'
}
const Button: React.FC<Props> = ({ children, title, onClick, style, loading, disabled = false, type = 'button' }) => {
    return (
        <div>

            <button
                disabled={loading || disabled}
                onClick={onClick}
                type={type}
                className={`shadow disabled:opacity-50 py-1 px-4 text-sm bg-gray-800 rounded-full hover:opacity-70 text-white focus:outline-none  ${style} `}
            >
                {loading ? title + '...' : title}
                {children}
            </button>
        </div>

    )
}


export default Button