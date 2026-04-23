import { useEffect, useMemo, useState } from 'react'

const icons = ['👑', '🦄', '🌈', '🍓', '💖', '🦋']

function shuffle(items) {
  const clone = [...items]
  for (let index = clone.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1))
    ;[clone[index], clone[swapIndex]] = [clone[swapIndex], clone[index]]
  }
  return clone
}

function createDeck() {
  return shuffle(
    icons.flatMap((icon, index) => [
      { id: `${index}-a-${crypto.randomUUID()}`, icon, matched: false },
      { id: `${index}-b-${crypto.randomUUID()}`, icon, matched: false },
    ]),
  )
}

export default function MemoryMatch() {
  const [deck, setDeck] = useState([])
  const [openCards, setOpenCards] = useState([])
  const [moves, setMoves] = useState(0)
  const [matches, setMatches] = useState(0)
  const [started, setStarted] = useState(false)
  const [previewing, setPreviewing] = useState(false)
  const [busy, setBusy] = useState(false)

  const resetGame = () => {
    setDeck(createDeck())
    setOpenCards([])
    setMoves(0)
    setMatches(0)
    setBusy(false)
    setStarted(false)
    setPreviewing(false)
  }

  useEffect(() => {
    resetGame()
  }, [])

  useEffect(() => {
    if (!previewing) return

    const allIds = deck.map((card) => card.id)
    setOpenCards(allIds)

    const timer = window.setTimeout(() => {
      setOpenCards([])
      setPreviewing(false)
      setStarted(true)
    }, 1400)

    return () => window.clearTimeout(timer)
  }, [previewing, deck])

  useEffect(() => {
    if (openCards.length !== 2 || busy) return

    const [firstId, secondId] = openCards
    const first = deck.find((card) => card.id === firstId)
    const second = deck.find((card) => card.id === secondId)

    if (!first || !second) return

    if (first.icon === second.icon) {
      setDeck((current) =>
        current.map((card) =>
          card.id === firstId || card.id === secondId ? { ...card, matched: true } : card,
        ),
      )
      setMatches((value) => value + 1)
      setOpenCards([])
      return
    }

    setBusy(true)
    const timer = window.setTimeout(() => {
      setOpenCards([])
      setBusy(false)
    }, 650)

    return () => window.clearTimeout(timer)
  }, [openCards, deck, busy])

  const finished = useMemo(() => matches === icons.length, [matches])

  const startGame = () => {
    if (started || previewing) return
    setPreviewing(true)
  }

  const handleCard = (id) => {
    if (!started || previewing || busy || openCards.includes(id)) return
    const card = deck.find((entry) => entry.id === id)
    if (!card || card.matched || openCards.length === 2) return

    setOpenCards((current) => [...current, id])
    if (openCards.length === 0) setMoves((value) => value + 1)
  }

  return (
    <div className="game-card-shell game-card-shell--memory">
      <div className="game-card-shell__head">
        <div>
          <p className="game-kicker">Princess game</p>
          <h3>Memory Match</h3>
          <p className="muted">Start when ready, watch the quick preview, then match the treasures.</p>
        </div>
        <button className="secondary-button" onClick={resetGame}>Restart</button>
      </div>

      <div className="stats-row">
        <span>Moves: {moves}</span>
        <span>Pairs: {matches}/{icons.length}</span>
      </div>

      <div className="game-ribbon">Watch the cards, remember them, then match them</div>

      {!started && !previewing ? (
        <div className="game-start-panel">
          <div className="game-start-panel__icon">💎</div>
          <strong>Ready to play Memory Match?</strong>
          <p>Tap start, get a tiny peek at all the cards, then begin.</p>
          <button className="primary-button" onClick={startGame}>Start game</button>
        </div>
      ) : null}

      <div className={`memory-grid ${!started && !previewing ? 'is-dimmed' : ''}`}>
        {deck.map((card) => {
          const isOpen = openCards.includes(card.id) || card.matched
          return (
            <button
              key={card.id}
              className={`memory-card ${isOpen ? 'is-open' : ''} ${card.matched ? 'is-matched' : ''}`}
              onClick={() => handleCard(card.id)}
            >
              <span>{isOpen ? card.icon : '☁️'}</span>
            </button>
          )
        })}
      </div>

      {finished ? <div className="success-banner">Lovely work. You found every pair. 👑</div> : null}
    </div>
  )
}
