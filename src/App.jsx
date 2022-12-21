import { useState } from 'react'
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import './App.css'

import { Button } from 'react-bootstrap';
import { useEffect } from 'react';


const minusIcon = <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" class="bi bi-dash-circle" viewBox="0 0 16 16">
<path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
<path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8z"/>
</svg>

const plusIcon = <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" class="bi bi-plus-circle" viewBox="0 0 16 16">
<path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
<path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
</svg>


const Clock = (props) => {


  return (
    <div className="clock">
      
      <div id="timer-label" className='time label'>
        {props.title}
      </div>
      <div id="time-left" className="time">
        {("" + Math.floor(props.remaining / 60)).padStart(2, "0") + ":" + ("" + (props.remaining - (Math.floor(props.remaining / 60)*60))).padStart(2, "0")}
      </div>
    </div>
  )
}


function App() {
  const [breakLength, setBreakLength] = useState(5);
  const [sessionLength, setSessionLength] = useState(25);
  const [active, setActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);

  const [remaining, setRemaining] = useState(isBreak ? breakLength * 60 : sessionLength * 60);
  
  useEffect(() => {
    setRemaining(isBreak ? breakLength * 60 : sessionLength * 60)
  }, [isBreak, sessionLength, breakLength])


  useEffect(() => {
    if(!active) {return;}

    const t = setInterval(() => {
      setRemaining((time_left) => {
        if(time_left == 0) {
          document.getElementById("beep").play();
          let broke = isBreak;
          setIsBreak((v) => {
            broke = !v;
            return !v;
          })
          return broke ? breakLength*60 : sessionLength*60;
        }
        return time_left - 1;
      });
    }, 1000)
    return () => clearInterval(t);

  }, [active, isBreak, sessionLength, breakLength])

  const handleReset = () => {
    setActive(false)
    setSessionLength(25);
    setBreakLength(5);
    setIsBreak(false);
    setRemaining(25*60);
    const beep = document.getElementById("beep");
    beep.pause();
    beep.currentTime = 0;
  }

  const handleStop = () => {
    setActive((a) => !a);
  }




  return (
    <div className="App">
      <h1 style={{fontSize: "3rem", marginBottom: "40px", color:"brown"}}>Pomodoro / 25 + 5</h1>
      <div className="time_controls">
        <div className="break">
          <div id='break-label'> Break Length </div>
          <div className="plusminus">
            <div id="break-decrement" onClick={() => {if(breakLength > 1) {setBreakLength(breakLength-1)}}}> {minusIcon}</div>
            <div id="break-length">{breakLength}</div>
            <div id="break-increment" onClick={() => {if(breakLength < 60) {setBreakLength(breakLength+1)}}}>{plusIcon}</div>
          </div>
        </div>
        <div className="length">
          <div id="session-label">Session Length</div>
          <div className="plusminus">
            <div id="session-decrement" onClick={() => {if(sessionLength > 1) {setSessionLength(sessionLength-1)}}}> {minusIcon}</div>
            <div id="session-length">{sessionLength}</div>
            <div id="session-increment" onClick={() => {if(sessionLength < 60) {setSessionLength(sessionLength+1)}}}>{plusIcon}</div>
          </div>
        </div>
      </div>
      <Clock remaining={remaining} active={active} title={isBreak ? "Break" : "Session"}/>

      <div className='start-stop'>
        {!active 
        ? <Button id="start_stop" variant="outlined" style={{fontSize: "3em", color: "white"}} className="bi bi-play-fill" onClick={handleStop}></Button>
        : <Button id="start_stop" variant="outlined" style={{fontSize: "3em", color: "white"}} className="bi bi-pause" onClick={handleStop}></Button>
        }
        <Button id="reset" variant="outlined" style={{fontSize: "3em", color: "white"}} className="bi bi-arrow-clockwise" onClick={() => {handleReset()}}></Button>
        <audio id="beep" preload="auto" src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"></audio>
      </div>
    </div>
  )
}

export default App
