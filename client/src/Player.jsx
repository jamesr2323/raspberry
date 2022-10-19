import { useState, useEffect, useRef } from 'react'
import { startOfDay, add, isWithinInterval } from 'date-fns'
import { useHotkeys } from 'react-hotkeys-hook'
import { Video } from './FrameStyled'
import axios from 'axios'

function say(message) {
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

export default function Player() {
  const [auto, setAuto] = useState(false)
  const [mode, setMode] = useState('birds')
  const audioRef = useRef(null)
  const spotifyRef = useRef(null)

  useHotkeys('q', () => changeTo('bbc6', "BBC 6 Music"))
  useHotkeys('w', () => changeTo('nts', "NTS Radio"))
  useHotkeys('e', () => changeTo('birds', "Birds"))

  useHotkeys('o', volumeUp)
  useHotkeys('l', volumeDown)

  useHotkeys('a', toggleAuto)

  useEffect(() => {
    getScript("https://sdk.scdn.co/spotify-player.js")

    window.onSpotifyWebPlaybackSDKReady = () => {
      /*global Spotify, a*/
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
    if (!auto) return

    const interval = setInterval(() => {
      const sevenAm = add(startOfDay(new Date()), { hours: 7, minutes: 0 })
      const sevenThirtyAm = add(startOfDay(new Date()), { hours: 7, minutes: 30 })
      const tenAm = add(startOfDay(new Date()), { hours: 10, minutes: 0 })

      if (isWithinInterval(new Date(), { start: sevenAm, end: sevenThirtyAm })) {
        setMode('birds')
      } else if (isWithinInterval(new Date(), { start: sevenThirtyAm, end: tenAm })) {
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
      say(`Auto, ${v ? 'off' : 'on'}`)
      return !v
    })
  }

  return <div>
    <Video width="100%" height="100%" controls autoPlay muted loop>
      <source src="/video/stormy_short.mp4" type="video/mp4" />
    </Video>

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