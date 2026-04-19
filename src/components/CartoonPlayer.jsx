import { useEffect, useMemo, useState } from 'react'
import { cartoons } from '../data/cartoons'

export default function CartoonPlayer() {
  const [selectedId, setSelectedId] = useState(cartoons[0].id)
  const [brokenVideos, setBrokenVideos] = useState({})

  const selected = useMemo(
    () => cartoons.find((cartoon) => cartoon.id === selectedId) ?? cartoons[0],
    [selectedId],
  )

  useEffect(() => {
    localStorage.setItem('nika-last-cartoon', selectedId)
  }, [selectedId])

  useEffect(() => {
    const last = localStorage.getItem('nika-last-cartoon')
    if (last && cartoons.some((cartoon) => cartoon.id === last)) {
      setSelectedId(last)
    }
  }, [])

  return (
    <section className="panel panel--soft">
      <div className="section-copy">
        <p className="eyebrow">Offline cartoons</p>
        <h2>Travel-ready cartoon shelf</h2>
        <p>
          Drop MP4 files into <code>public/videos</code> with the exact names shown below, then
          rebuild the app. That keeps everything local and internet-free on the tablet.
        </p>
      </div>

      <div className="cartoons-grid">
        {cartoons.map((cartoon) => (
          <button
            key={cartoon.id}
            className={`cartoon-card cartoon-card--${cartoon.color} ${selectedId === cartoon.id ? 'is-active' : ''}`}
            onClick={() => setSelectedId(cartoon.id)}
          >
            <div className="cartoon-card__emoji">{cartoon.emoji}</div>
            <div>
              <strong>{cartoon.title}</strong>
              <div className="cartoon-card__meta">{cartoon.duration}</div>
              <div className="cartoon-card__file">{cartoon.fileName}</div>
            </div>
          </button>
        ))}
      </div>

      <div className="player-shell">
        <div>
          <h3>{selected.title}</h3>
          <p className="muted">{selected.description}</p>
        </div>

        <div className="video-frame">
          {brokenVideos[selected.id] ? (
            <div className="video-fallback">
              <div className="video-fallback__emoji">🎞️</div>
              <strong>Video file not added yet</strong>
              <p>
                Put <code>{selected.fileName}</code> into <code>public/videos</code>, then run a new
                build and copy the updated app to the tablet.
              </p>
            </div>
          ) : (
            <video
              key={selected.src}
              controls
              playsInline
              preload="metadata"
              className="video-player"
              onError={() =>
                setBrokenVideos((current) => ({
                  ...current,
                  [selected.id]: true,
                }))
              }
            >
              <source src={selected.src} type="video/mp4" />
            </video>
          )}
        </div>
      </div>
    </section>
  )
}
