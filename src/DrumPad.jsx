import React from 'react'
import './App.css'

export const DrumPad = ({letter,sound, keyCode}) => {


  const playSound = (keyCode) => {
    const audio = document.querySelector(`audio[data-key="${keyCode}"]`)
    const keyDiv = document.querySelector(`div[data-key="${keyCode}"]`)    

    if(!audio) return;

    keyDiv.classList.add('playing')
    audio.currentTime = 0;
    audio.play();

    setTimeout(() => keyDiv.classList.remove('playing'), 100)

  }

  return (
    <div data-key={keyCode}  className='key p-3 w-[100px] h-[100px] border-2 border-blue-600 rounded justify-center items-center flex flex-col z-10 bg-yellow-300 opacity-2 transfrom cursor-pointer transition-transform duration-100' onClick={() => playSound(keyCode)}>
      <kbd className='text-red-400 flex justify-center font-bold text-4xl'>{letter}</kbd>
      <p className='text-blue-400 flex justify-center font-semibold'>{sound}</p>
    </div>
  )
}
