import { useMemo, useState } from 'react'
import CartoonPlayer from './components/CartoonPlayer'
import BalloonPop from './components/BalloonPop'
import MemoryMatch from './components/MemoryMatch'
import TabBar from './components/TabBar'
import { cartoons } from './data/cartoons'

function HomePanel({ onOpenCartoons, onOpenGames }) {
  const cartoonCount = cartoons.length

  return (
    <section className="home-stack">
      <section className="hero-card">
        <div className="hero-copy">
          <p className="eyebrow">Nika's custom tablet app</p>
          <h1>Nika's World</h1>
          <p>
            A soft, offline-friendly kid app for travel days. Big buttons, easy touch targets,
            local cartoons, and a couple of tiny games that should run on a cheap tablet.
          </p>
        </div>
        <div className="hero-badge">👑</div>
      </section>

      <section className="feature-grid">
        <button className="feature-card feature-card--pink" onClick={onOpenCartoons}>
          <span className="feature-card__icon">🎬</span>
          <strong>Cartoons</strong>
          <span>{cartoonCount} offline slots, easy to replace with her favorite MP4 files.</span>
        </button>

        <button className="feature-card feature-card--purple" onClick={onOpenGames}>
          <span className="feature-card__icon">🎮</span>
          <strong>Mini-games</strong>
          <span>Memory Match and Balloon Pop, both touch-first and lightweight.</span>
        </button>
      </section>

      <section className="panel quick-guide">
        <div>
          <p className="eyebrow">What changed</p>
          <h2>This is now a real Vite app</h2>
          <ul>
            <li>clean React structure instead of one giant HTML file</li>
            <li>offline cartoon shelf with local MP4 slots</li>
            <li>simple service worker and installable web app setup</li>
            <li>lighter, easier to maintain and update for your friend’s daughter</li>
          </ul>
        </div>
      </section>
    </section>
  )
}

export default function App() {
  const [activeTab, setActiveTab] = useState('home')

  const activeView = useMemo(() => {
    if (activeTab === 'cartoons') return <CartoonPlayer />
    if (activeTab === 'games') {
      return (
        <section className="games-stack">
          <div className="section-copy section-copy--centered">
            <p className="eyebrow">Mini-games</p>
            <h2>Small games for little fingers</h2>
            <p>Keep it simple, colorful, and offline. No clutter, no ads, no internet needed.</p>
          </div>
          <MemoryMatch />
          <BalloonPop />
        </section>
      )
    }

    return <HomePanel onOpenCartoons={() => setActiveTab('cartoons')} onOpenGames={() => setActiveTab('games')} />
  }, [activeTab])

  return (
    <div className="app-shell">
      <div className="app-shell__bg app-shell__bg--one" />
      <div className="app-shell__bg app-shell__bg--two" />

      <main className="app-main">{activeView}</main>
      <TabBar activeTab={activeTab} onChange={setActiveTab} />
    </div>
  )
}
