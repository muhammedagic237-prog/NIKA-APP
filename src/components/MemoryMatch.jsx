import { useEffect, useMemo, useState } from 'react'

const icons = ['👑', '🦄', '🌈', '🍓', '💖', '🦋']

function shuffle(items) {
  return [...items].sort(() => Math.random() - 0.5)
}

export default function MemoryMatch() {
  const [deck, setDeck] = useState([])
  const [openCards, setOpenCards] = useState([])
  const [moves, setMoves] = useState(0)
  const [matches, setMatches] = useState(0)

  const resetGame = () => {
    const fullDeck = shuffle(
      icons.flatMap((icon) => [
        { id: `${icon}-a-${Math.random()}`, icon, matched: false },
        { id: `${icon}-b-${Math.random()}`, icon, matched: false },
      ]),
    )

    setDeck(fullDeck)
    setOpenCards([])
    setMoves(0)
    setMatches(0)
  }

  useEffect(() => {
    resetGame()
  }, [])

  useEffect(() => {
    if (openCards.length !== 2) return

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

    const timer = setTimeout(() => setOpenCards([]), 700)
    return () => clearTimeout(timer)
  }, [openCards, deck])

  const finished = useMemo(() => matches === icons.length, [matches])

  const handleCard = (id) => {
    if (openCards.includes(id)) return
    const card = deck.find((entry) => entry.id === id)
    if (!card || card.matched || openCards.length === 2) return

    setOpenCards((current) => [...current, id])
    if (openCards.length === 0) setMoves((value) => value + 1)
  }

  return (
    <div className="game-card-shell">
      <div className="game-card-shell__head">
        <div>
          <p className="game-kicker">Princess game</p>
          <h3>Memory Match</h3>
          <p className="muted">Match the same cute icons. Gentle, simple, tablet-friendly.</p>
        </div>
        <button className="secondary-button" onClick={resetGame}>
          Restart
        </button>
      </div>

      <div className="stats-row">
        <span>Moves: {moves}</span>
        <span>Pairs: {matches}/{icons.length}</span>
      </div>

      <div className="game-ribbon">Find the matching princess treasures</div>

      <div className="memory-grid">
        {deck.map((card) => {
          const isOpen = openCards.includes(card.id) || card.matched
          return (
            <button
              key={card.id}
              className={`memory-card ${isOpen ? 'is-open' : ''}`}
              onClick={() => handleCard(card.id)}
            >
              <span>{isOpen ? card.icon : '✨'}</span>
            </button>
          )
        })}
      </div>

      {finished && <div className="success-banner">Nice job, princess. You found every pair. 👑</div>}
    </div>
  )
}
