import { useEffect, useMemo, useRef, useState } from 'react'

const COLS = 6
const ROWS = 4
const BRICK_W = 44
const BRICK_H = 18
const BRICK_GAP = 8
const FIELD_W = 360
const FIELD_H = 430
const PADDLE_W = 84
const PADDLE_H = 14
const BALL = 12

function createBricks() {
  const colors = ['#61dafb', '#a855f7', '#fb7185', '#f59e0b']
  const bricks = []
  for (let row = 0; row < ROWS; row += 1) {
    for (let col = 0; col < COLS; col += 1) {
      bricks.push({
        id: `${row}-${col}`,
        x: 18 + col * (BRICK_W + BRICK_GAP),
        y: 26 + row * (BRICK_H + BRICK_GAP),
        color: colors[row % colors.length],
        alive: true,
      })
    }
  }
  return bricks
}

export default function BlockBreaker() {
  const areaRef = useRef(null)
  const frameRef = useRef(null)
  const ballRef = useRef({ x: 178, y: 260, dx: 3.1, dy: -3.2 })
  const paddleRef = useRef({ x: (FIELD_W - PADDLE_W) / 2 })
  const [started, setStarted] = useState(false)
  const [running, setRunning] = useState(false)
  const [won, setWon] = useState(false)
  const [lost, setLost] = useState(false)
  const [score, setScore] = useState(0)
  const [best, setBest] = useState(0)
  const [bricks, setBricks] = useState(createBricks())
  const [ball, setBall] = useState(ballRef.current)
  const [paddleX, setPaddleX] = useState(paddleRef.current.x)
  const [burst, setBurst] = useState(null)

  const aliveCount = useMemo(() => bricks.filter((brick) => brick.alive).length, [bricks])

  const resetGame = () => {
    const nextBricks = createBricks()
    setBricks(nextBricks)
    setScore(0)
    setWon(false)
    setLost(false)
    setStarted(false)
    setRunning(false)
    setBurst(null)
    const nextBall = { x: 178, y: 260, dx: 3.1, dy: -3.2 }
    const nextPaddleX = (FIELD_W - PADDLE_W) / 2
    ballRef.current = nextBall
    paddleRef.current = { x: nextPaddleX }
    setBall(nextBall)
    setPaddleX(nextPaddleX)
  }

  useEffect(() => {
    resetGame()
  }, [])

  useEffect(() => {
    if (!burst) return
    const timer = window.setTimeout(() => setBurst(null), 280)
    return () => window.clearTimeout(timer)
  }, [burst])

  useEffect(() => {
    if (!running) {
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
      return undefined
    }

    const loop = () => {
      const currentBall = { ...ballRef.current }
      const paddle = paddleRef.current
      currentBall.x += currentBall.dx
      currentBall.y += currentBall.dy

      if (currentBall.x <= 0 || currentBall.x >= FIELD_W - BALL) {
        currentBall.dx *= -1
      }

      if (currentBall.y <= 0) {
        currentBall.dy *= -1
      }

      if (
        currentBall.y + BALL >= FIELD_H - 42 &&
        currentBall.y + BALL <= FIELD_H - 42 + PADDLE_H &&
        currentBall.x + BALL >= paddle.x &&
        currentBall.x <= paddle.x + PADDLE_W
      ) {
        const hit = (currentBall.x + BALL / 2 - (paddle.x + PADDLE_W / 2)) / (PADDLE_W / 2)
        currentBall.dy = -Math.abs(currentBall.dy)
        currentBall.dx = 4.6 * hit
        currentBall.y = FIELD_H - 42 - BALL
      }

      let brickHit = false
      const nextBricks = bricks.map((brick) => {
        if (
          brick.alive &&
          currentBall.x + BALL >= brick.x &&
          currentBall.x <= brick.x + BRICK_W &&
          currentBall.y + BALL >= brick.y &&
          currentBall.y <= brick.y + BRICK_H
        ) {
          brickHit = true
          setScore((value) => value + 10)
          setBurst({ x: brick.x + BRICK_W / 2, y: brick.y + BRICK_H / 2, color: brick.color })
          return { ...brick, alive: false }
        }
        return brick
      })

      if (brickHit) {
        currentBall.dy *= -1
        setBricks(nextBricks)
        if (nextBricks.every((brick) => !brick.alive)) {
          setRunning(false)
          setWon(true)
          setBest((value) => Math.max(value, score + 10))
        }
      }

      if (currentBall.y >= FIELD_H - BALL) {
        setRunning(false)
        setLost(true)
        setBest((value) => Math.max(value, score))
      }

      ballRef.current = currentBall
      setBall(currentBall)
      frameRef.current = requestAnimationFrame(loop)
    }

    frameRef.current = requestAnimationFrame(loop)
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
    }
  }, [running, bricks, score])

  const movePaddle = (clientX) => {
    const rect = areaRef.current?.getBoundingClientRect()
    if (!rect) return
    const relative = clientX - rect.left
    const nextX = Math.max(0, Math.min(FIELD_W - PADDLE_W, relative - PADDLE_W / 2))
    paddleRef.current = { x: nextX }
    setPaddleX(nextX)
  }

  const startGame = () => {
    setStarted(true)
    setWon(false)
    setLost(false)
    setRunning(true)
  }

  return (
    <div className="game-card-shell game-card-shell--breaker">
      <div className="game-card-shell__head">
        <div>
          <p className="game-kicker">Retro neon game</p>
          <h3>Block Breaker</h3>
          <p className="muted">Bounce the glowing ball, smash the blocks, keep it alive.</p>
        </div>
        <button className="secondary-button" onClick={resetGame}>Reset</button>
      </div>

      <div className="stats-row">
        <span>Score: {score}</span>
        <span>Best: {best}</span>
        <span>Blocks left: {aliveCount}</span>
      </div>

      <div className="game-ribbon">Move the paddle with your finger and clear the wall</div>

      {!started ? (
        <div className="game-start-panel">
          <div className="game-start-panel__icon">🟦</div>
          <strong>Ready for Block Breaker?</strong>
          <p>Tap start, drag the paddle, and destroy every glowing block.</p>
          <button className="primary-button" onClick={startGame}>Start game</button>
        </div>
      ) : null}

      <div
        ref={areaRef}
        className={`breaker-area ${!started ? 'is-dimmed' : ''}`}
        onMouseMove={(event) => movePaddle(event.clientX)}
        onTouchMove={(event) => movePaddle(event.touches[0].clientX)}
      >
        <div className="breaker-wall">
          {bricks.map((brick) => (
            <div
              key={brick.id}
              className={`breaker-brick ${brick.alive ? '' : 'is-broken'}`}
              style={{ left: brick.x, top: brick.y, background: brick.color }}
            />
          ))}
        </div>

        <div className="breaker-paddle" style={{ left: paddleX }} />
        <div className="breaker-ball" style={{ left: ball.x, top: ball.y }} />

        {burst ? (
          <div className="breaker-burst" style={{ left: burst.x, top: burst.y, color: burst.color }}>
            ✦ ✦
          </div>
        ) : null}

        {won ? <div className="breaker-overlay success">You cleared every block ✨</div> : null}
        {lost ? <div className="breaker-overlay fail">Oops, try again 💫</div> : null}
      </div>
    </div>
  )
}
