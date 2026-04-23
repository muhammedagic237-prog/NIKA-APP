import { useEffect, useMemo, useState } from 'react'
import BalloonPop from './components/BalloonPop'
import BlockBreaker from './components/BlockBreaker'
import CartoonPlayer from './components/CartoonPlayer'
import { cartoons } from './data/cartoons'

function SplashScreen() {
  return (
    <div className="splash-screen" aria-hidden="true">
      <div className="mist mist--one" />
      <div className="mist mist--two" />
      <div className="mist mist--three" />
      <div className="spark spark--one">✦</div>
      <div className="spark spark--two">✦</div>
      <div className="spark spark--three">✦</div>
      <div className="splash-core">
        <p className="splash-whisper">from the pink mist</p>
        <h1 className="splash-neon-title">Princess Nika</h1>
      </div>
    </div>
  )
}

function HomeMenu({ onOpenCartoons, onOpenGames, cartoonCount }) {
  return (
    <section className="home-menu">
      <div className="home-topbar">
        <span className="princess-badge">Princess Nika</span>
      </div>

      <section className="panel home-panel home-panel--simple">
        <h1 className="menu-title">Princess Nika</h1>
        <p className="menu-copy">Choose cartoons or games.</p>
        <div className="menu-grid">
          <button className="menu-card menu-card--cartoons" onClick={onOpenCartoons}>
            <span className="menu-card__icon">🎬</span>
            <strong>Movies</strong>
            <span>{cartoonCount} offline cartoons</span>
          </button>

          <button className="menu-card menu-card--games" onClick={onOpenGames}>
            <span className="menu-card__icon">🕹️</span>
            <strong>Games</strong>
            <span>Open the arcade room</span>
          </button>
        </div>
      </section>
    </section>
  )
}

function GamesMenu({ onBack, onSelectGame }) {
  const games = [
    {
      id: 'breaker',
      title: 'Block Breaker',
      icon: '🟦',
      description: 'Destroy glowing blocks with the little ball.',
    },
    {
      id: 'balloons',
      title: 'Balloon Pop',
      icon: '🎈',
      description: 'A brighter neon balloon game with more motion and color.',
    },
  ]

  return (
    <section className="games-menu-stack">
      <div className="section-topbar">
        <button className="secondary-button" onClick={onBack}>Back</button>
        <span className="princess-badge">Princess Nika</span>
      </div>

      <section className="panel game-menu-panel">
        <h2>Arcade Room</h2>
        <p className="menu-copy">Pick one game and start when ready.</p>
      </section>

      <div className="game-choice-grid">
        {games.map((game) => (
          <button key={game.id} className="game-choice-card" onClick={() => onSelectGame(game.id)}>
            <span className="game-choice-card__icon">{game.icon}</span>
            <strong>{game.title}</strong>
            <span>{game.description}</span>
          </button>
        ))}
      </div>
    </section>
  )
}

function GameScreen({ game, onBack }) {
  return (
    <section className="games-stack">
      <div className="section-topbar">
        <button className="secondary-button" onClick={onBack}>Back to games</button>
        <span className="princess-badge">Princess Nika</span>
      </div>
      {game === 'breaker' ? <BlockBreaker /> : <BalloonPop />}
    </section>
  )
}

export default function App() {
  const [view, setView] = useState('home')
  const [selectedGame, setSelectedGame] = useState(null)
  const [showSplash, setShowSplash] = useState(true)

  useEffect(() => {
    const timer = window.setTimeout(() => setShowSplash(false), 3000)
    return () => window.clearTimeout(timer)
  }, [])

  const activeView = useMemo(() => {
    if (view === 'cartoons') {
      return (
        <section className="view-stack">
          <div className="section-topbar">
            <button className="secondary-button" onClick={() => setView('home')}>Back</button>
            <span className="princess-badge">Princess Nika</span>
          </div>
          <CartoonPlayer />
        </section>
      )
    }

    if (view === 'games-menu') {
      return (
        <GamesMenu
          onBack={() => setView('home')}
          onSelectGame={(gameId) => {
            setSelectedGame(gameId)
            setView('game')
          }}
        />
      )
    }

    if (view === 'game' && selectedGame) {
      return <GameScreen game={selectedGame} onBack={() => setView('games-menu')} />
    }

    return (
      <HomeMenu
        cartoonCount={cartoons.length}
        onOpenCartoons={() => setView('cartoons')}
        onOpenGames={() => setView('games-menu')}
      />
    )
  }, [view, selectedGame])

  return (
    <div className="app-shell app-shell--neon">
      {showSplash ? <SplashScreen /> : null}
      <div className="app-shell__bg app-shell__bg--one" />
      <div className="app-shell__bg app-shell__bg--two" />
      <div className="app-shell__bg app-shell__bg--three" />
      <main className="app-main">{activeView}</main>
    </div>
  )
}
