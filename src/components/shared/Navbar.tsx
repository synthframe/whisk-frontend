import { Sparkles, Image, Layers, LogOut, ChevronDown } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

interface Props {
  mode: 'single' | 'batch'
  onModeChange: (mode: 'single' | 'batch') => void
}

export function Navbar({ mode, onModeChange }: Props) {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <header className="h-14 bg-white border-b border-gray-100 flex items-center px-6 gap-6 sticky top-0 z-10">
      <div className="flex items-center gap-2 mr-4">
        <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <span className="font-semibold text-gray-900">Whisk</span>
      </div>

      <nav className="flex items-center gap-1">
        <button
          onClick={() => onModeChange('single')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            mode === 'single'
              ? 'bg-indigo-50 text-indigo-700'
              : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
          }`}
        >
          <Image className="w-4 h-4" />
          생성
        </button>
        <button
          onClick={() => onModeChange('batch')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            mode === 'batch'
              ? 'bg-indigo-50 text-indigo-700'
              : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
          }`}
        >
          <Layers className="w-4 h-4" />
          배치
        </button>
      </nav>

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
          <span className="text-sm font-medium text-gray-700">{user?.name}</span>
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
    </header>
  )
}
