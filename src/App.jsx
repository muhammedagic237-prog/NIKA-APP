import { useEffect, useMemo, useState } from 'react'
import CartoonPlayer from './components/CartoonPlayer'
import BalloonPop from './components/BalloonPop'
import MemoryMatch from './components/MemoryMatch'
import TabBar from './components/TabBar'
import { cartoons } from './data/cartoons'

function SplashScreen() {
  return (
    <div className="splash-screen" aria-hidden="true">
      <div className="splash-screen__glow splash-screen__glow--one" />
      <div className="splash-screen__glow splash-screen__glow--two" />
      <div className="splash-screen__card">
        <div className="splash-screen__sparkles">✨ 💖 ✨</div>
        <div className="splash-screen__crown">👑</div>
        <p className="splash-screen__hello">Welcome princess</p>
        <h1 className="splash-screen__title">NIKA&apos;s APP</h1>
        <p className="splash-screen__subtitle">Cartoons, smiles, and tiny games just for Nika</p>
      </div>
    </div>
  )
}

function HomePanel({ onOpenCartoons, onOpenGames }) {
  const cartoonCount = cartoons.length

  return (
    <section className="home-stack">
      <div className="home-topbar">
        <span className="princess-badge">Princess Nika</span>
      </div>

      <section className="hero-card">
        <div className="hero-copy">
          <p className="eyebrow">Nika&apos;s dreamy tablet app</p>
          <h1>NIKA&apos;s APP</h1>
          <p>
            A cheerful little pink world for travel days. Big buttons, smooth local cartoons, and
            tiny games that feel friendly, soft, and easy to use.
          </p>
        </div>
        <div className="hero-badge">👑</div>
      </section>

      <section className="feature-grid">
        <button className="feature-card feature-card--pink" onClick={onOpenCartoons}>
          <span className="feature-card__icon">🎬</span>
          <strong>Cartoons</strong>
          <span>{cartoonCount} offline favorites ready for Nika&apos;s tablet.</span>
        </button>

        <button className="feature-card feature-card--rose" onClick={onOpenGames}>
          <span className="feature-card__icon">🎮</span>
          <strong>Mini-games</strong>
          <span>Memory Match and Balloon Pop, sweet, simple, and touch-friendly.</span>
        </button>
      </section>

      <section className="panel quick-guide">
        <div>
          <p className="eyebrow">Made with love</p>
          <h2>A little princess tablet world</h2>
          <ul>
            <li>offline cartoon shelf for easy travel watching</li>
            <li>big buttons and soft visuals for little hands</li>
            <li>lightweight build for a cheaper tablet</li>
            <li>simple, cheerful, and internet-free once installed</li>
          </ul>
        </div>
      </section>
    </section>
  )
}

export default function App() {
  const [activeTab, setActiveTab] = useState('home')
  const [showSplash, setShowSplash] = useState(true)

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setShowSplash(false)
    }, 2500)

    return () => window.clearTimeout(timer)
  }, [])

  const activeView = useMemo(() => {
    if (activeTab === 'cartoons') return <CartoonPlayer />
    if (activeTab === 'games') {
      return (
        <section className="games-stack">
          <div className="section-copy section-copy--centered">
            <p className="eyebrow">Mini-games</p>
            <h2>Pretty little games for little fingers</h2>
            <p>Soft colors, easy taps, no clutter, no ads, and no internet needed.</p>
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
      {showSplash ? <SplashScreen /> : null}
      <div className="app-shell__bg app-shell__bg--one" />
      <div className="app-shell__bg app-shell__bg--two" />
      <div className="app-shell__bg app-shell__bg--three" />

      <main className="app-main">{activeView}</main>
      <TabBar activeTab={activeTab} onChange={setActiveTab} />
    </div>
  )
}
