import { useEffect, useMemo, useRef, useState } from 'react'
import { cartoons } from '../data/cartoons'

export default function CartoonPlayer() {
  const [selectedId, setSelectedId] = useState(cartoons[0].id)
  const [brokenVideos, setBrokenVideos] = useState({})
  const videoRef = useRef(null)

  const selected = useMemo(
    () => cartoons.find((cartoon) => cartoon.id === selectedId) ?? cartoons[0],
    [selectedId],
  )

  useEffect(() => {
    const last = localStorage.getItem('nika-last-cartoon')
    if (last && cartoons.some((cartoon) => cartoon.id === last)) {
      setSelectedId(last)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('nika-last-cartoon', selectedId)
  }, [selectedId])

  useEffect(() => {
    const video = videoRef.current
    if (!video || brokenVideos[selected.id]) return
    video.currentTime = 0
    const tryPlay = async () => {
      try {
        await video.play()
      } catch {
        // autoplay can be blocked on some browsers, controls stay available
      }
    }
    tryPlay()
  }, [selectedId, brokenVideos, selected.id])

  return (
    <section className="panel cartoon-panel">
      <div className="cartoon-topbar">
        <p className="eyebrow">Offline movies</p>
        <span className="now-watching">{selected.title}</span>
      </div>

      <div className="video-frame video-frame--instant">
        {brokenVideos[selected.id] ? (
          <div className="video-fallback">
            <div className="video-fallback__emoji">🎞️</div>
            <strong>Video file not added yet</strong>
            <p>{selected.fileName} is missing from the app bundle.</p>
          </div>
        ) : (
          <video
            ref={videoRef}
            key={selected.src}
            controls
            playsInline
            preload="auto"
            className="video-player"
            onError={() => setBrokenVideos((current) => ({ ...current, [selected.id]: true }))}
          >
            <source src={selected.src} type="video/mp4" />
          </video>
        )}
      </div>

      <div className="instant-cartoon-grid">
        {cartoons.map((cartoon) => (
          <button
            key={cartoon.id}
            className={`instant-cartoon-button ${selectedId === cartoon.id ? 'is-active' : ''}`}
            onClick={() => setSelectedId(cartoon.id)}
          >
            <span className="instant-cartoon-button__emoji">{cartoon.emoji}</span>
            <span className="instant-cartoon-button__title">{cartoon.title}</span>
            <span className="instant-cartoon-button__meta">{cartoon.duration}</span>
          </button>
        ))}
      </div>
    </section>
  )
}
