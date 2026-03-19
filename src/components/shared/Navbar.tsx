import { Sparkles, Image, Layers, GalleryHorizontal, LogOut, ChevronDown } from 'lucide-react'
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

  function handleLogout() { logout(); navigate('/login') }

  const navItems = [
    { id: 'single', label: '이미지 생성', icon: Image },
    { id: 'batch', label: '배치 생성', icon: Layers },
    { id: 'gallery', label: '갤러리', icon: GalleryHorizontal },
  ] as const

  return (
    <header className="h-16 border-b border-white/[0.07] bg-[#0a0a0d]/95 backdrop-blur-xl sticky top-0 z-50">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 h-full flex items-center gap-6">
        {/* Logo */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-900/60">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold text-white tracking-tight">Whisk</span>
        </div>

        {/* Divider */}
        <div className="w-px h-6 bg-white/[0.1] flex-shrink-0" />

        {/* Nav tabs */}
        <nav className="flex items-center bg-white/[0.04] rounded-2xl p-1 gap-0.5 border border-white/[0.06]">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => onModeChange(id)}
              className={`relative flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${
                mode === id
                  ? 'bg-gradient-to-r from-violet-600 to-purple-500 text-white shadow-lg shadow-violet-900/50'
                  : 'text-slate-500 hover:text-slate-200 hover:bg-white/[0.06]'
              }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span className="whitespace-nowrap">{label}</span>
              {mode === id && (
                <span className="absolute -top-px left-1/2 -translate-x-1/2 w-8 h-0.5 bg-violet-400/60 rounded-full blur-[2px]" />
              )}
            </button>
          ))}
        </nav>

        {/* User menu */}
        <div className="ml-auto relative flex-shrink-0">
          <button
            onClick={() => setMenuOpen(v => !v)}
            className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl hover:bg-white/[0.06] transition-all border border-transparent hover:border-white/[0.08]"
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white shadow">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <span className="text-sm text-slate-300 hidden md:block font-semibold">{user?.name}</span>
            <ChevronDown className="w-4 h-4 text-slate-600" />
          </button>

          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 top-full mt-2 w-56 bg-[#18181f] border border-white/[0.08] rounded-2xl shadow-2xl shadow-black/60 py-1.5 z-20 animate-fade-in">
                <div className="px-4 py-3 border-b border-white/[0.06]">
                  <p className="text-sm font-semibold text-slate-100">{user?.name}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{user?.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-400 hover:text-red-400 hover:bg-red-500/[0.07] transition-colors rounded-b-2xl"
                >
                  <LogOut className="w-4 h-4" />
                  로그아웃
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
