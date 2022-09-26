import { useState, useEffect, useRef } from 'react'
import { startOfDay, add, isWithinInterval } from 'date-fns'
import { useHotkeys } from 'react-hotkeys-hook'

function say(message) {
  let utterance = new SpeechSynthesisUtterance(message);
  speechSynthesis.speak(utterance);
}

export default function Player() {
  const [auto, setAuto] = useState(false)
  const [mode, setMode] = useState('birds')
  const audioRef = useRef(null)

  useHotkeys('q', () => changeTo('bbc6', "BBC 6 Music"))
  useHotkeys('w', () => changeTo('nts', "NTS Radio"))
  useHotkeys('e', () => changeTo('birds', "Birds"))
  useHotkeys('a', toggleAuto)

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
    <img src="https://picsum.photos/1200/800" />

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