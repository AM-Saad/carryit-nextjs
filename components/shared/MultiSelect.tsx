/*
    options: any[] - array of objects to be displayed in the list
    multiple: boolean - if true, multiple items can be selected
    closeOnSelect: boolean - if true, the list will close after selecting an item
    placeholder: string - placeholder for the input
    id: string - id for the component
    label: string - label for the object in the options array
    trackBy: string - key for the object in the options array
    disabled: boolean - if true, the component will be disabled
    input: (items: any) => void - callback function to get the selected items
    preSelected?: any[] - array of objects to be preselected
    refresh?: any - if this prop changes, the component will reset the selected items
*/

import React, { useState, useEffect, useRef, use } from 'react'
import BadgeWithDelete from './BadgeWithDelete';

function compareStr(name: string, str: string) {
    const pattern = str.split("").map((x) => `(?=.*${x})`).join("");
    return name.match(new RegExp(`${pattern}`, "i"));
}


interface Props {
    options: any[];
    multiple: boolean;
    closeOnSelect?: boolean;
    placeholder: string;
    id: string,
    label: string
    trackBy: string
    disabled: boolean
    input: (items: any) => void,
    preSelected?: any[]
    refresh?: any
}


const MultiSelect: React.FC<Props> = ({ options, multiple, closeOnSelect, placeholder, id, label, trackBy, disabled, input, preSelected = [], refresh }) => {
    const [selected, setSelected] = useState<any[]>(preSelected)
    const [filtered, setFiltered] = useState<any[]>(options)
    const [listIsOpen, setListIsOpen] = useState<boolean>(false)
    const [isFirstRender, setIsFirstRender] = useState<boolean>(true)

    const itemsMenu: any = useRef<HTMLDivElement>(null)
    const searchInput = useRef<HTMLInputElement>(null)

    const search = (e: any) => {
        const val = e.target.value
        if (val === '' || !val) return setFiltered(options)
        const matchedItems = options.filter((opt) => compareStr(opt[label], val));
        setFiltered(matchedItems)
    }

    const selectItem = (val: string) => {

        const exist = selected.find((i: any) => i[trackBy] === val)

        if (exist) {
            const items = selected.filter((opt: any) => opt[trackBy] !== val)
            return setSelected(items)
        }

        const item = options.find(i => i[trackBy] === val)

        if (item) {
            if (multiple) {
                setSelected((prev: any) => { return [...prev, item] });
            } else {
                setSelected([item])
            }

            if (closeOnSelect) setListIsOpen(false)
        }
    }

    const remove = (val: string) => {
        const items = selected.filter((opt: any) => opt[trackBy] !== val)
        setSelected(items)
        setListIsOpen(true)
    }


    const checkIfSelected = (val: string) => selected.findIndex((opt: any) => opt[trackBy] === val) !== -1


    const closeList = (e: any) => {

        if (itemsMenu.current && !itemsMenu.current.contains(e.target)) {
            setListIsOpen(false)
        }
    }

    useEffect(() => {
        if (!isFirstRender) {
            input(selected)

        }

        setIsFirstRender(false)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selected])


    useEffect(() => {
        setSelected(preSelected)
        document.addEventListener('mousedown', closeList)

        return () => document.removeEventListener('mousedown', closeList)
    }, [preSelected]);


    return (
        <>
            <div id={id} className="multiple-select bg-white py -1 rounded-md w-full">

                <div className='relative' ref={itemsMenu} onClick={() => setListIsOpen(true)}>

                    <div className={`selected-list flex items-center flex-wrap gap-1 w-full ${(!multiple && selected.length === 1) && 'p-1'}`}>

                        {(selected !== null && selected.length > 0) &&
                            selected.map((option: any, idx: number) => {
                                return <>
                                    {multiple && <BadgeWithDelete key={idx - 1} id={option[trackBy]} onDelete={remove} label={option[label]} />}
                                    {!multiple && !listIsOpen && <p key={option[trackBy]} className='text-xs p-1 cursor-pointer block w-full'>{option[label]}</p>}
                                </>
                            })}

                    </div>

                    {(listIsOpen || (!listIsOpen && multiple) || (!multiple && selected.length === 0)) &&
                        <input
                            className='multiple-select_input my-1 focus:outline-none w-full pl-1 text-xs border-none rounded-md'
                            type="text"
                            ref={searchInput}
                            onChange={search}
                            autoFocus
                            onFocus={() => setListIsOpen(true)}
                        />
                    }


                    {listIsOpen &&
                        <ul className='absolute bg-white border multiple-select_list mt-3 my-2 p-1 rounded-lg shadow-md w-full z-20'>
                            {filtered.length > 0 && filtered.map((option, idx) =>
                                <li
                                    className={`p-2 text-xs my-1 rounded-md cursor-pointer hover:bg-gray-200 ${checkIfSelected(option[trackBy]) ? 'font-medium bg-gray-50' : ''}`}
                                    key={option[label] + idx}
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        selectItem(option[trackBy])
                                    }}
                                >
                                    {option[label]}
                                </li>
                            )}

                            {filtered.length === 0 && <p className='text-xs text-gray-600 my-2'>Nothing here</p>}
                        </ul>
                    }
                </div>

            </div>
        </>
    )
}

export default MultiSelect

