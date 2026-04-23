import { useEffect, useMemo, useState } from 'react'

function createBalloon(id) {
  const variants = [
    { color: 'linear-gradient(180deg, #ff7ac6, #ff3ea5)', emoji: '🎈', points: 1 },
    { color: 'linear-gradient(180deg, #8be9ff, #3fb8ff)', emoji: '💎', points: 3 },
    { color: 'linear-gradient(180deg, #d58bff, #8f5dff)', emoji: '✨', points: 2 },
    { color: 'linear-gradient(180deg, #ffd36f, #ff9e3d)', emoji: '💖', points: 2 },
    { color: 'linear-gradient(180deg, #7dffce, #2dd4bf)', emoji: '🌟', points: 2 },
  ]
  const choice = variants[Math.floor(Math.random() * variants.length)]
  return {
    id,
    left: `${8 + Math.random() * 74}%`,
    top: `${16 + Math.random() * 56}%`,
    drift: `${-10 + Math.random() * 20}px`,
    size: 70 + Math.random() * 20,
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
  const [lastPop, setLastPop] = useState(null)
  const [message, setMessage] = useState('')

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
      setBalloons((current) => [...current.slice(-5), createBalloon(`${Date.now()}-${Math.random()}`)])
    }, 620)
    return () => window.clearInterval(spawn)
  }, [running])

  useEffect(() => {
    if (!running && started) setBest((value) => Math.max(value, score))
  }, [running, started, score])

  useEffect(() => {
    if (!lastPop) return
    const timer = window.setTimeout(() => setLastPop(null), 550)
    return () => window.clearTimeout(timer)
  }, [lastPop])

  useEffect(() => {
    if (!message) return
    const timer = window.setTimeout(() => setMessage(''), 700)
    return () => window.clearTimeout(timer)
  }, [message])

  const startGame = () => {
    setStarted(true)
    setRunning(true)
    setTimeLeft(25)
    setScore(0)
    setMessage('')
    setLastPop(null)
    setBalloons([createBalloon('start-1'), createBalloon('start-2'), createBalloon('start-3')])
  }

  const popBalloon = (balloon) => {
    if (!running) return
    setBalloons((current) => current.filter((entry) => entry.id !== balloon.id))
    setScore((value) => value + balloon.points)
    setLastPop({ left: balloon.left, top: balloon.top, emoji: balloon.emoji })
    setMessage(balloon.points >= 3 ? 'Neon bonus!' : 'Pop!')
  }

  const status = useMemo(() => {
    if (!started) return 'Tap start and fill the sky with color.'
    if (running) return 'Pop everything bright and shiny.'
    return score >= best && score > 0 ? 'New best glow round.' : 'Round finished. Go again.'
  }, [started, running, score, best])

  return (
    <div className="game-card-shell game-card-shell--balloons">
      <div className="game-card-shell__head">
        <div>
          <p className="game-kicker">Neon arcade game</p>
          <h3>Balloon Pop</h3>
          <p className="muted">Brighter colors, faster motion, cleaner pop feedback.</p>
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

      <div className="game-ribbon">Pop the neon balloons before they drift away</div>

      {!started ? (
        <div className="game-start-panel">
          <div className="game-start-panel__icon">🌈</div>
          <strong>Ready for Balloon Pop?</strong>
          <p>Start the round and tap the brightest targets for more points.</p>
          <button className="primary-button" onClick={startGame}>Start game</button>
        </div>
      ) : null}

      {message ? <div className={`game-feedback ${message === 'Neon bonus!' ? 'is-success' : 'is-soft'}`}>{message}</div> : null}

      <div className={`balloon-area balloon-area--neon ${!started ? 'is-dimmed' : ''}`}>
        {balloons.map((balloon) => (
          <button
            key={balloon.id}
            className="balloon balloon--neon"
            style={{
              left: balloon.left,
              top: balloon.top,
              background: balloon.color,
              '--drift': balloon.drift,
              width: balloon.size,
              height: balloon.size * 1.18,
            }}
            onClick={() => popBalloon(balloon)}
          >
            {balloon.emoji}
          </button>
        ))}

        {lastPop ? (
          <div className="pop-burst pop-burst--neon" style={{ left: lastPop.left, top: lastPop.top }} aria-hidden="true">
            <span>{lastPop.emoji}</span>
            <span>✦</span>
            <span>✦</span>
          </div>
        ) : null}

        <div className="balloon-help">{status}</div>
      </div>
    </div>
  )
}
