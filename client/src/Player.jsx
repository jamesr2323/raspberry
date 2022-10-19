import { useState, useEffect, useRef } from 'react'
import { startOfDay, add, isWithinInterval } from 'date-fns'
import { useHotkeys } from 'react-hotkeys-hook'
import { Video } from './FrameStyled'
import axios from 'axios'

function say(message) {
  serverSpeak(message)
  let utterance = new SpeechSynthesisUtterance(message);
  speechSynthesis.speak(utterance);
}

function getScript(source, callback) {
    var script = document.createElement('script');
    var prior = document.getElementsByTagName('script')[0];
    script.async = 1;

    script.onload = script.onreadystatechange = function( _, isAbort ) {
        if(isAbort || !script.readyState || /loaded|complete/.test(script.readyState) ) {
            script.onload = script.onreadystatechange = null;
            script = undefined;

            if(!isAbort && callback) setTimeout(callback, 0);
        }
    };

    script.src = source;
    prior.parentNode.insertBefore(script, prior);
}

function volumeUp() {
  axios.post('/volume_up')
}

function volumeDown() {
  axios.post('/volume_down')
}

function serverSpeak(text) {
  axios.post('/speak' , { text })
}

export default function Player() {
  const [auto, setAuto] = useState(false)
  const [mode, setMode] = useState('birds')
  const audioRef = useRef(null)
  const spotifyRef = useRef(null)
  const inputRef = useRef(null)
  const [startHour, setStartHour] = useState(7)
  const [startMinute, setStartMinute] = useState(0)

  const [fullHour, setFullHour] = useState(7)
  const [fullMinute, setFullMinute] = useState(30)

  const [settingState, setSettingState] = useState('none')
  const [value, setValue] = useState('')

  function handleZ() {
    if (settingState === 'none') {
      setSettingState('startHour')
    }
    setValue('')
  }

  function handleKey(e) {
    if (e.key === 'Enter') {
      if (settingState === 'startHour') {
        setStartHour(Number(value))
        setSettingState('startMinute')
      } else if (settingState === 'startMinute') {
        setStartMinute(Number(value))
        setSettingState('fullHour')
      } else if (settingState === 'fullHour') {
        setFullHour(Number(value))
        setSettingState('fullMinute')
      } else if (settingState === 'fullMinute') {
        setFullMinute(Number(value))
        setSettingState('none')
        say(`Birds ${startHour} ${startMinute}. Radio ${fullHour} ${Number(value)}.`)
      }
      setValue('')
    }
  }

  useHotkeys('q', () => changeTo('bbc6', "BBC 6 Music"))
  useHotkeys('w', () => changeTo('nts', "NTS Radio"))
  useHotkeys('e', () => changeTo('birds', "Birds"))

  useHotkeys('o', volumeUp)
  useHotkeys('l', volumeDown)
  useHotkeys('z', handleZ)

  useHotkeys('a', toggleAuto)


  console.log({ startHour, startMinute, fullHour, fullMinute })


  useEffect(() => {
    serverSpeak('hello')
    getScript("https://sdk.scdn.co/spotify-player.js")

    window.onSpotifyWebPlaybackSDKReady = () => {
      /*global Spotify */
      spotifyRef.current = new Spotify.Player({
        name: 'Carly Rae Jepsen Player',
        getOAuthToken: callback => {
          callback('access token here');
        },
        volume: 0.5
      });
      spotifyRef.current.connect()
    }
  }, [])

  useEffect(() => {
    if (inputRef.current) {
      say(settingState)
      setTimeout(() => inputRef.current.focus(), 100)
    }
  }, [settingState])

  useEffect(() => {
    if (!auto) return

    const interval = setInterval(() => {
      const sevenAm = add(startOfDay(new Date()), { hours: startHour, minutes: startMinute })
      const sevenThirtyAm = add(startOfDay(new Date()), { hours: fullHour, minutes: fullMinute })
      const midnight = add(startOfDay(new Date()), { hours: fullHour + 3, minutes: fullMinute })

      if (isWithinInterval(new Date(), { start: sevenAm, end: sevenThirtyAm })) {
        setMode('birds')
      } else if (isWithinInterval(new Date(), { start: sevenThirtyAm, end: midnight })) {
        setMode('nts')
      } else {
        setMode('none')
      }

    }, 1000)

    return () => clearInterval(interval)
  }, [auto])

  useEffect(() => {
    if (mode === 'nts' || mode === 'birds') {
      audioRef.current.play()
    }
  }, [mode])

  function changeTo(mode, message) {
    say(message)
    setMode(mode)
  }

  function toggleAuto() {
    setAuto(v => {
      return !v
    })
  }

  useEffect(() => {
    say(`Auto, ${auto ? 'on' : 'off'}`)
  }, [auto])

  return <div>
    { settingState === 'none' && <Video width="100%" height="100%" controls autoPlay muted loop>
      <source src="/video/stormy_short.mp4" type="video/mp4" />
    </Video> }

    { settingState !== 'none' && <input type="text" ref={inputRef} value={value} onChange={e => setValue(e.target.value)} onKeyDown={handleKey} /> }

    { mode === 'birds' && <audio autoPlay ref={audioRef}>
      <source src="http://edge-audio-06-thn.sharp-stream.com/rspb.mp3" />
    </audio> }
    { mode === 'nts' && <audio autoPlay ref={audioRef}>
      <source src="https://stream-relay-geo.ntslive.net/stream" />
    </audio> }
    { mode === 'bbc6' && <audio autoPlay ref={audioRef}>
      <source src="https://stream.live.vc.bbcmedia.co.uk/bbc_6music" />
    </audio> }

    <button disabled={auto} onClick={() => changeTo('bbc6', 'BBC 6 Music')}>BBC 6</button>
    <button disabled={auto} onClick={() => changeTo('nts', 'NTS Radio')}>NTS</button>
    <button disabled={auto} onClick={() => changeTo('birds', 'Birds')}>Birds</button>
    <button onClick={toggleAuto}>Auto</button>
  </div>
}