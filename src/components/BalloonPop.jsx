import { useEffect, useMemo, useState } from 'react'

function createBalloon(id) {
  const variants = [
    { color: '#fb7185', emoji: '🎈', points: 1 },
    { color: '#f472b6', emoji: '💖', points: 2 },
    { color: '#c084fc', emoji: '✨', points: 2 },
    { color: '#f9a8d4', emoji: '🫧', points: 1 },
  ]
  const choice = variants[Math.floor(Math.random() * variants.length)]
  return {
    id,
    left: `${8 + Math.random() * 74}%`,
    top: `${18 + Math.random() * 58}%`,
    drift: `${-8 + Math.random() * 16}px`,
    ...choice,
  }
}

export default function BalloonPop() {
  const [running, setRunning] = useState(false)
  const [timeLeft, setTimeLeft] = useState(25)
  const [score, setScore] = useState(0)
  const [best, setBest] = useState(0)
  const [balloons, setBalloons] = useState([])
  const [started, setStarted] = useState(false)

  useEffect(() => {
    if (!running) return

    const timer = window.setInterval(() => {
      setTimeLeft((value) => {
        if (value <= 1) {
          setRunning(false)
          return 0
        }
        return value - 1
      })
    }, 1000)

    return () => window.clearInterval(timer)
  }, [running])

  useEffect(() => {
    if (!running) return

    const spawn = window.setInterval(() => {
      setBalloons((current) => {
        const trimmed = current.slice(-4)
        return [...trimmed, createBalloon(`${Date.now()}-${Math.random()}`)]
      })
    }, 900)

    return () => window.clearInterval(spawn)
  }, [running])

  useEffect(() => {
    if (!running && started && score > best) {
      setBest(score)
    }
  }, [running, score, best, started])

  const startGame = () => {
    setStarted(true)
    setRunning(true)
    setTimeLeft(25)
    setScore(0)
    setBalloons([
      createBalloon('start-1'),
      createBalloon('start-2'),
      createBalloon('start-3'),
    ])
  }

  const popBalloon = (id, points) => {
    if (!running) return
    setBalloons((current) => current.filter((balloon) => balloon.id !== id))
    setScore((value) => value + points)
  }

  const status = useMemo(() => {
    if (!started) return 'Tap start when you want to begin.'
    if (running) return 'Pop the floating balloons and catch the hearts.'
    return 'Round finished. You can play again.'
  }, [started, running])

  return (
    <div className="game-card-shell game-card-shell--balloons">
      <div className="game-card-shell__head">
        <div>
          <p className="game-kicker">Princess game</p>
          <h3>Balloon Pop</h3>
          <p className="muted">A cleaner, softer round-based version with fewer laggy targets.</p>
        </div>
        <button className="primary-button" onClick={startGame}>
          {running ? 'Restart round' : started ? 'Play again' : 'Start game'}
        </button>
      </div>

      <div className="stats-row">
        <span>Time: {timeLeft}s</span>
        <span>Score: {score}</span>
        <span>Best: {best}</span>
      </div>

      <div className="game-ribbon">Tap the balloons and hearts before they drift away</div>

      {!started ? (
        <div className="game-start-panel">
          <div className="game-start-panel__icon">☁️</div>
          <strong>Ready for Balloon Pop?</strong>
          <p>Start the round, then tap the floating shapes as fast as you can.</p>
          <button className="primary-button" onClick={startGame}>Start game</button>
        </div>
      ) : null}

      <div className={`balloon-area ${!started ? 'is-dimmed' : ''}`}>
        {balloons.map((balloon) => (
          <button
            key={balloon.id}
            className="balloon"
            style={{ left: balloon.left, top: balloon.top, background: balloon.color, '--drift': balloon.drift }}
            onClick={() => popBalloon(balloon.id, balloon.points)}
          >
            {balloon.emoji}
          </button>
        ))}
        <div className="balloon-help">{status}</div>
      </div>
    </div>
  )
}
