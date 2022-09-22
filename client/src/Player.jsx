import { useState, useEffect, useRef } from 'react'
import { startOfDay, add, isWithinInterval } from 'date-fns'

export default function Player() {
  const [mode, setMode] = useState('birds')
  const audioRef = useRef(null)

  useEffect(() => {
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
  }, [])

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
  </div>
}