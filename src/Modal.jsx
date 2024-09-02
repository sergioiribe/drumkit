import React from 'react'
import { useState } from 'react'
import { IoMdCloseCircle } from "react-icons/io";


export const Modal = ({ isVisible, onClose, onSubmit }) => {
    const [name, setName] = useState('')

    const handleSubmit = (e) => {    
        e.preventDefault()
        const trimmedName = name.trim()
        if(trimmedName){
            onSubmit(name)
            onClose()
        }
    }

    if (!isVisible) return null;

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50'>
        <div className=' bg-white rounded-lg shadow-lg flex flex-col'>
        <div className='relative top-1 left-1 flex gap-3'>
            <button onClick={onClose}>
            <IoMdCloseCircle color='red'/>
            </button>
            <p  className='font-bold text-md text-blue-600 text-center'>Introduzca su nombre</p>
            </div>
            <form onSubmit={handleSubmit} className='flex flex-col items-center p-3 w-[250px]'>
                <input className='p-2 border border-blue-600 rounded text-center h-[35px] text-black w-[200px]' type="text" value={name} onChange={(e) => setName(e.target.value)} />
                <button  type='submit' className='mt-3 bg-blue-600 text-white p-2 rounded h-[50px] transition-all w-[200px] duration-200'>Confirmar nombre</button>
                <p className='text-xs text-wrap p-1 w-[200px] text-center'>Recuerda si te equivocas o fallas perderas, ¡Buena suerte!</p>
               
            </form>
        </div>
    </div>
  )
}
