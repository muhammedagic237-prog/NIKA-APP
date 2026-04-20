import { useEffect, useState } from 'react'

function randomBalloon(id) {
  const colors = ['#fb7185', '#f472b6', '#c084fc', '#f59e0b']
  const emojis = ['🎈', '⭐', '🫧', '💖']
  return {
    id,
    left: `${10 + Math.random() * 80}%`,
    top: `${20 + Math.random() * 55}%`,
    color: colors[Math.floor(Math.random() * colors.length)],
    emoji: emojis[Math.floor(Math.random() * emojis.length)],
  }
}

export default function BalloonPop() {
  const [running, setRunning] = useState(false)
  const [timeLeft, setTimeLeft] = useState(20)
  const [score, setScore] = useState(0)
  const [balloons, setBalloons] = useState([])

  useEffect(() => {
    if (!running) return

    const timer = setInterval(() => {
      setTimeLeft((value) => {
        if (value <= 1) {
          setRunning(false)
          return 0
        }
        return value - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [running])

  useEffect(() => {
    if (!running) return

    const spawn = setInterval(() => {
      setBalloons((current) => {
        const next = [...current, randomBalloon(Date.now() + Math.random())]
        return next.slice(-8)
      })
    }, 700)

    return () => clearInterval(spawn)
  }, [running])

  const startGame = () => {
    setRunning(true)
    setTimeLeft(20)
    setScore(0)
    setBalloons([randomBalloon(1), randomBalloon(2), randomBalloon(3)])
  }

  const popBalloon = (id) => {
    if (!running) return
    setBalloons((current) => current.filter((balloon) => balloon.id !== id))
    setScore((value) => value + 1)
  }

  return (
    <div className="game-card-shell">
      <div className="game-card-shell__head">
        <div>
          <p className="game-kicker">Princess game</p>
          <h3>Balloon Pop</h3>
          <p className="muted">Tap the floating balloons before the timer ends.</p>
        </div>
        <button className="primary-button" onClick={startGame}>
          {running ? 'Restart round' : 'Start game'}
        </button>
      </div>

      <div className="stats-row">
        <span>Time: {timeLeft}s</span>
        <span>Score: {score}</span>
      </div>

      <div className="game-ribbon">Pop sparkly balloons before the timer runs out</div>

      <div className="balloon-area">
        {balloons.map((balloon) => (
          <button
            key={balloon.id}
            className="balloon"
            style={{ left: balloon.left, top: balloon.top, background: balloon.color }}
            onClick={() => popBalloon(balloon.id)}
          >
            {balloon.emoji}
          </button>
        ))}
        {!running && <div className="balloon-help">Tap start and pop as many balloons as you can.</div>}
      </div>
    </div>
  )
}
