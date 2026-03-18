import { Sparkles, Image, Layers, LogOut, ChevronDown, GalleryHorizontal, Menu, X } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

interface Props {
  mode: 'single' | 'batch' | 'gallery'
  onModeChange: (mode: 'single' | 'batch' | 'gallery') => void
}

export function Navbar({ mode, onModeChange }: Props) {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  function handleLogout() {
    logout()
    navigate('/login')
  }

  const navItems = [
    { id: 'single' as const, label: '생성', Icon: Image },
    { id: 'batch' as const, label: '배치', Icon: Layers },
    { id: 'gallery' as const, label: '갤러리', Icon: GalleryHorizontal },
  ]

  return (
    <header className="h-14 bg-white border-b border-gray-100 flex items-center px-4 md:px-6 gap-4 md:gap-6 sticky top-0 z-10 shadow-sm">
      <div className="flex items-center gap-2 mr-2">
        <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <span className="font-semibold text-gray-900">Whisk</span>
      </div>

      {/* Desktop nav */}
      <nav className="hidden md:flex items-center gap-1">
        {navItems.map(({ id, label, Icon }) => (
          <button
            key={id}
            onClick={() => onModeChange(id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              mode === id
                ? 'bg-indigo-50 text-indigo-700'
                : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </nav>

      {/* Mobile hamburger */}
      <button
        className="md:hidden flex items-center justify-center w-8 h-8 rounded-lg text-gray-500 hover:bg-gray-50 transition-colors"
        onClick={() => setMobileNavOpen((v) => !v)}
      >
        {mobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      <div className="ml-auto relative">
        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center">
            <span className="text-xs font-semibold text-indigo-700">
              {user?.name?.charAt(0).toUpperCase()}
            </span>
          </div>
          <span className="hidden sm:block text-sm font-medium text-gray-700">{user?.name}</span>
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </button>

        {menuOpen && (
          <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-20">
            <div className="px-3 py-2 border-b border-gray-50">
              <p className="text-xs font-medium text-gray-900">{user?.name}</p>
              <p className="text-xs text-gray-400">{user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              로그아웃
            </button>
          </div>
        )}
      </div>

      {/* Mobile nav dropdown */}
      {mobileNavOpen && (
        <div className="md:hidden absolute left-0 right-0 top-14 bg-white border-b border-gray-100 shadow-sm z-20 px-4 py-2">
          {navItems.map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => { onModeChange(id); setMobileNavOpen(false) }}
              className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors mb-1 ${
                mode === id
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>
      )}
    </header>
  )
}
