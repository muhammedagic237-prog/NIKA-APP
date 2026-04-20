export default function TabBar({ activeTab, onChange }) {
  const tabs = [
    { key: 'home', label: 'Home', icon: '🏠' },
    { key: 'cartoons', label: 'Cartoons', icon: '🎬' },
    { key: 'games', label: 'Games', icon: '🎮' },
  ]

  return (
    <nav className="tabbar">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          className={`tabbar__button ${activeTab === tab.key ? 'is-active' : ''}`}
          onClick={() => onChange(tab.key)}
        >
          <span className="tabbar__icon">{tab.icon}</span>
          <span className="tabbar__label">{tab.label}</span>
        </button>
      ))}
    </nav>
  )
}
