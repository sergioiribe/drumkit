import React, { useEffect, useState } from 'react'
import './App.css'
import { DrumPad } from './DrumPad'
import clapSound from './assets/sounds/clap.wav'
import hihatSound from './assets/sounds/hihat.wav'
import kickSound from './assets/sounds/kick.wav'
import openhatSound from './assets/sounds/openhat.wav'
import boomSound from './assets/sounds/boom.wav'
import rideSound from './assets/sounds/ride.wav'
import snareSound from './assets/sounds/snare.wav'
import tomSound from './assets/sounds/tom.wav'
import tinkSound from './assets/sounds/tink.wav'
import { FaCirclePlay } from 'react-icons/fa6'
import { Modal } from './Modal'
import { db } from './firebase-config';
import { collection, addDoc, query, orderBy, limit, getDocs } from "firebase/firestore"


function App() {
  const [isPlaying, setIsPlaying] = React.useState(false)
  const [currentLetter, setCurrentLetter] = React.useState('')
  const [gameOver, setGameOver] = useState(false)
  const [score, setScore] = useState(0)
  const [timer, setTimer] = useState(null)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [playerName, setPlayerName] = useState('')
  const [topScores, setTopScores] = useState([])
  


  useEffect(() => {
    const handleKeydown = (e) => {
      if (!isPlaying || gameOver) return
      const keyCode = e.keyCode
      const keyPressed = String.fromCharCode(keyCode)
      const audio = document.querySelector(`audio[data-key="${keyCode}"]`)
      const keyDiv = document.querySelector(`div[data-key="${keyCode}"]`)

      if (!audio) return

      keyDiv.classList.add('playing')
      audio.currentTime = 0
      audio.play()

      if (keyPressed === currentLetter) {
        setScore(score + 1)
        generateRandomLetter()
      } else {
        endGame()
      }

      setTimeout(() => keyDiv.classList.remove('playing'), 100)
    }

    window.addEventListener('keydown', handleKeydown)

    return () => {
      window.removeEventListener('keydown', handleKeydown)
    }
  }, [isPlaying, currentLetter, gameOver, score])

  const saveScore = async (name, score) => {
    try {
      await addDoc(collection(db, "drumkit"), {
        name: name,
        score: score,
        timestamp: new Date() // Agrega un timestamp para saber cuándo se guardó el puntaje
      });
      console.log("Score saved successfully");
      fetchTopScores(); 
    } catch (e) {
      console.error("Error saving score: ", e);
    }
  }

  const fetchTopScores = async () => {
    const q = query(collection(db, 'drumkit'), orderBy('score', 'desc'), limit(5));
    const querySnapshot = await getDocs(q);
    const scores = querySnapshot.docs.map(doc => doc.data());
    setTopScores(scores);
  };

  useEffect(() => {
    fetchTopScores(); // Obtiene los mejores puntajes al cargar el componente
  }, []);


  const generateRandomLetter = () => {
    const letters = 'ASDFGHJKL'
    const randomIndex = Math.floor(Math.random() * letters.length)
    setCurrentLetter(letters[randomIndex])

     if (timer) clearTimeout(timer)

     const newTimer = setTimeout(() => {
       endGame()
     }, 2000)
 
     setTimer(newTimer)

  }

  const startGame = (name) => {
    setPlayerName(name)
    setIsPlaying(true)
    setGameOver(false)
    setScore(0)
    generateRandomLetter()
  }
  
  const endGame = () => {
    saveScore(playerName, score); // Guarda el puntaje antes de finalizar el juego
    setGameOver(true);
    setIsPlaying(false);
    if (timer) clearTimeout(timer);
  }
  

  return (
    <div className="w-[100vw] h-[100vh] flex flex-col justify-center items-center keys bg-custom-image">
      <div className=" h-[75%] w-[100%] flex justify-center">
        {isPlaying && !gameOver && (
          <div className="text-xl font-bold text-white absolute left-0 top-0 w-full">
            Score: {score}
          </div>
        )}
       <div className="flex justify-center cursor w-full m-auto">
  {!isPlaying && !gameOver ? (
    <div className='gap-4 flex flex-col'>
       <p className='font-bold text-2xl text-white text-center'>Presiona para jugar</p>
      <button className='m-auto flex justify-center' onClick={() => setIsModalVisible(true)}>
    <FaCirclePlay size="125px" color="white" />
  </button>
 
    </div>
  ) : gameOver ? (
    <div className="w-[30%] h-[200px] border-2 border-white rounded justify-center items-center flex flex-col z-10 bg-white opacity-90 m-auto">
      <p className="text-xl font-bold text-black">
        Fallaste {playerName}, tu score es:
      </p>
      <p className="text-3xl font-bold text-black opacity-100">{score}</p>
     <div className='flex gap-3'>
     <button 
        onClick={() => startGame(playerName)} 
        className="mt-4 bg-green-600 opacity-100 hover:bg-green-700 text-white p-3 rounded-lg transition-all duration-200"
      >
        Jugar de nuevo
      </button>
      <button 
        onClick={() => setIsModalVisible(true)}
        className="mt-4 bg-blue-600 opacity-100 hover:bg-blue-700 text-white p-3 rounded-lg transition-all duration-200"
      >
        Nuevo usuario
      </button>
      
     </div>
     <div>
     <h2 className="text-xl font-bold text-white mb-4">Top 5 Puntajes</h2>
          <ul>
            {topScores.map((score, index) => (
              <li key={index} className="text-white text-lg">
                {index + 1}. {score.name}: {score.score}
              </li>
            ))}
          </ul>
     </div>
    </div>
  ) : (
    <div className="w-[100px] h-[100px] border-2 border-white rounded justify-center items-center flex flex-col z-10 bg-white opacity-90 m-auto">
      <kbd className="text-4xl font-bold text-black">
        {currentLetter}
      </kbd>
    </div>
  )}
</div>
      </div>
      <div className=" h-[35%] w-[100%] flex gap-3 justify-center items-center">
        <DrumPad letter={'A'} sound={'clap'} keyCode={65} />
        <DrumPad letter={'S'} sound={'hihat'} keyCode={83} />
        <DrumPad letter={'D'} sound={'kick'} keyCode={68} />
        <DrumPad letter={'F'} sound={'openhat'} keyCode={70} />
        <DrumPad letter={'G'} sound={'boom'} keyCode={71} />
        <DrumPad letter={'H'} sound={'ride'} keyCode={72} />
        <DrumPad letter={'J'} sound={'snare'} keyCode={74} />
        <DrumPad letter={'K'} sound={'tom'} keyCode={75} />
        <DrumPad letter={'L'} sound={'tink'} keyCode={76} />

        <audio data-key="65" src={clapSound}></audio>
        <audio data-key="83" src={hihatSound}></audio>
        <audio data-key="68" src={kickSound}></audio>
        <audio data-key="70" src={openhatSound}></audio>
        <audio data-key="71" src={boomSound}></audio>
        <audio data-key="72" src={rideSound}></audio>
        <audio data-key="74" src={snareSound}></audio>
        <audio data-key="75" src={tomSound}></audio>
        <audio data-key="76" src={tinkSound}></audio>
      </div>

      <Modal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSubmit={startGame}  
      />
    </div>
  )
}

export default App
