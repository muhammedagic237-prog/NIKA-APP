import { useEffect, useMemo, useState } from 'react'
import BalloonPop from './components/BalloonPop'
import BlockBreaker from './components/BlockBreaker'
import CartoonPlayer from './components/CartoonPlayer'
import { cartoons } from './data/cartoons'

function SplashScreen() {
  return (
    <div className="splash-screen" aria-hidden="true">
      <div className="splash-glow splash-glow--one" />
      <div className="splash-glow splash-glow--two" />
      <div className="splash-glow splash-glow--three" />

      <div className="mist mist--one" />
      <div className="mist mist--two" />
      <div className="mist mist--three" />
      <div className="mist mist--four" />

      <div className="splash-bubble splash-bubble--one" />
      <div className="splash-bubble splash-bubble--two" />
      <div className="splash-bubble splash-bubble--three" />
      <div className="spark spark--one">✦</div>
      <div className="spark spark--two">✦</div>
      <div className="spark spark--three">✦</div>

      <div className="castle-silhouette" />

      <div className="splash-core">
        <div className="splash-title-cloud" />
        <h1 className="splash-title">Princess Nika</h1>
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

      <section className="panel hero-panel">
        <p className="eyebrow">Offline fun</p>
        <h1 className="menu-title">Movies, glow, and arcade fun.</h1>
        <p className="menu-copy">A brighter little world for cartoons and simple games, ready even without internet.</p>

        <div className="menu-grid">
          <button className="menu-card menu-card--cartoons" onClick={onOpenCartoons}>
            <span className="menu-card__icon">🎬</span>
            <strong>Movies</strong>
            <span>{cartoonCount} offline cartoons</span>
          </button>

          <button className="menu-card menu-card--games" onClick={onOpenGames}>
            <span className="menu-card__icon">🕹️</span>
            <strong>Games</strong>
            <span>Open the play room</span>
          </button>
        </div>
      </section>
    </section>
  )
}

function GamesMenu({ onBack, onSelectGame }) {
  const games = [
    { id: 'breaker', title: 'Block Breaker', icon: '🟦' },
    { id: 'balloons', title: 'Balloon Pop', icon: '🎈' },
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
      </section>

      <div className="game-launch-grid">
        {games.map((game) => (
          <div key={game.id} className="game-launch-tile">
            <button className="game-launch-button" onClick={() => onSelectGame(game.id)}>
              <span className="game-launch-button__icon">{game.icon}</span>
            </button>
            <span className="game-launch-label">{game.title}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

function GameScreen({ game, onBack }) {
  return (
    <section className="games-stack games-stack--play">
      <div className="section-topbar">
        <button className="secondary-button" onClick={onBack}>Back to games</button>
        <span className="princess-badge">Princess Nika</span>
      </div>
      <div className="game-window">
        {game === 'breaker' ? <BlockBreaker /> : <BalloonPop />}
      </div>
    </section>
  )
}

export default function App() {
  const [view, setView] = useState('home')
  const [selectedGame, setSelectedGame] = useState(null)
  const [showSplash, setShowSplash] = useState(true)

  useEffect(() => {
    const timer = window.setTimeout(() => setShowSplash(false), 2800)
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
