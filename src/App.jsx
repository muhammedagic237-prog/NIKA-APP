import { useEffect, useMemo, useState } from 'react'
import CartoonPlayer from './components/CartoonPlayer'
import BalloonPop from './components/BalloonPop'
import MemoryMatch from './components/MemoryMatch'
import { cartoons } from './data/cartoons'

function SplashScreen() {
  return (
    <div className="splash-screen" aria-hidden="true">
      <div className="splash-cloud splash-cloud--one" />
      <div className="splash-cloud splash-cloud--two" />
      <div className="splash-cloud splash-cloud--three" />
      <div className="splash-stars">✦ ✦ ✦</div>
      <div className="splash-title-wrap">
        <p className="splash-whisper">out of the clouds</p>
        <h1 className="splash-cloud-title">Princess Nika</h1>
        <p className="splash-subtitle">a dreamy little world of cartoons and play</p>
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

      <section className="menu-intro panel">
        <div>
          <p className="eyebrow">Welcome back</p>
          <h1 className="menu-title">Princess Nika</h1>
          <p className="menu-copy">
            Pick something lovely. Watch a cartoon or open the play room and choose a game.
          </p>
        </div>
        <img className="menu-logo" src="/icons/logo-badge.svg" alt="Princess Nika app logo" />
      </section>

      <section className="menu-grid">
        <button className="menu-card menu-card--cartoons" onClick={onOpenCartoons}>
          <span className="menu-card__icon">🎬</span>
          <strong>Cartoons</strong>
          <span>{cartoonCount} offline favorites ready to watch</span>
        </button>

        <button className="menu-card menu-card--games" onClick={onOpenGames}>
          <span className="menu-card__icon">🪄</span>
          <strong>Play Room</strong>
          <span>Choose one mini-game and start only when you are ready</span>
        </button>
      </section>
    </section>
  )
}

function GamesMenu({ onBack, onSelectGame }) {
  const games = [
    {
      id: 'memory',
      title: 'Memory Match',
      icon: '👑',
      description: 'Flip princess cards and find the matching pairs.',
    },
    {
      id: 'balloons',
      title: 'Balloon Pop',
      icon: '🎈',
      description: 'Pop floating balloons and catch sparkly bonus hearts.',
    },
  ]

  return (
    <section className="games-menu-stack">
      <div className="section-topbar">
        <button className="secondary-button" onClick={onBack}>Back</button>
        <span className="princess-badge">Princess Nika</span>
      </div>

      <section className="panel game-menu-panel">
        <p className="eyebrow">Play room</p>
        <h2>Choose a game</h2>
        <p className="menu-copy">Pick one game first, then start when you want. No clutter, no autoplay.</p>
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
        <button className="secondary-button" onClick={onBack}>Back to play room</button>
        <span className="princess-badge">Princess Nika</span>
      </div>
      {game === 'memory' ? <MemoryMatch /> : <BalloonPop />}
    </section>
  )
}

export default function App() {
  const [view, setView] = useState('home')
  const [selectedGame, setSelectedGame] = useState(null)
  const [showSplash, setShowSplash] = useState(true)

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setShowSplash(false)
    }, 3000)

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
    <div className="app-shell">
      {showSplash ? <SplashScreen /> : null}
      <div className="app-shell__bg app-shell__bg--one" />
      <div className="app-shell__bg app-shell__bg--two" />
      <div className="app-shell__bg app-shell__bg--three" />
      <main className="app-main">{activeView}</main>
    </div>
  )
}
