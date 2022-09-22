import { useState, useEffect, useRef } from 'react'
import { startOfDay, add, isWithinInterval } from 'date-fns'

export default function Player() {
  const [auto, setAuto] = useState(true)
  const [mode, setMode] = useState('none')
  const audioRef = useRef(null)

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

  return <div>
    <img src="https://picsum.photos/1200/800" />
    { mode === 'birds' && <audio autoPlay ref={audioRef}>
      <source src="http://edge-audio-06-thn.sharp-stream.com/rspb.mp3" />
    </audio> }
    { mode === 'nts' && <audio autoPlay ref={audioRef}>
      <source src="https://stream-relay-geo.ntslive.net/stream" />
    </audio> }
    <button disabled={auto} onClick={() => setMode('nts')}>Radio</button>
    <button disabled={auto} onClick={() => setMode('birds')}>Birds</button>
    <button onClick={() => setAuto(!auto)}>Auto</button>
  </div>
}