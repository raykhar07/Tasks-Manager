import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useTheme } from '../hooks/useTheme'

const CheckIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </svg>
)

const PlusIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
  </svg>
)

const LogoutIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
  </svg>
)

const SunIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1.5m0 15V21m9-9h-1.5m-15 0H3m15.364-6.364-1.06 1.06M7.696 16.304l-1.06 1.06m12.728 0-1.06-1.06M7.696 7.696l-1.06-1.06M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
  </svg>
)

const MoonIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
  </svg>
)

const ghostBtn =
  'press inline-flex items-center gap-1.5 rounded-lg border border-line bg-surface px-3 py-2 text-xs font-medium text-ink-soft transition hover:bg-paper hover:text-ink focus-visible:outline-none focus-visible:ring-2 motion-reduce:transition-none'

const primaryBtn =
  'press inline-flex items-center gap-1.5 rounded-lg bg-pine px-3 py-2 text-xs font-semibold text-on-pine transition hover:bg-pine-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pine motion-reduce:transition-none'

const themeBtn =
  'press inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pine motion-reduce:transition-none'

export const Navbar = () => {
  const { isAuthenticated, logout, user } = useAuth()
  const { theme, setLight, setDark } = useTheme()
  const navigate = useNavigate()

  const handleLogout = () => {
    navigate('/')
    logout()
  }

  const initial = user?.username?.trim().charAt(0).toUpperCase() || '?'

  return (
    <nav className="sticky top-3 z-40 my-3 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line bg-surface/85 px-4 py-3 backdrop-blur-md">
      <Link
        to={isAuthenticated ? '/tasks' : '/'}
        className="group flex items-center gap-2.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pine"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-line bg-paper text-pine transition group-hover:border-pine/40 group-hover:bg-pine-soft motion-reduce:transition-none">
          <CheckIcon className="h-5 w-5" />
        </span>
        <span className="text-lg font-semibold tracking-tight text-ink transition group-hover:text-pine motion-reduce:transition-none">
          Tasks manager
        </span>
      </Link>

      <ul className="flex flex-wrap items-center gap-2 text-sm">
        <li>
          <div
            role="group"
            aria-label="Tema de la interfaz"
            className="flex items-center gap-0.5 rounded-lg border border-line bg-paper/70 p-0.5"
          >
            <button
              type="button"
              onClick={setLight}
              title="Modo claro"
              aria-pressed={theme === 'light'}
              className={`${themeBtn} ${
                theme === 'light'
                  ? 'bg-pine-soft text-pine-strong'
                  : 'text-ink-soft hover:text-ink'
              }`}
            >
              <SunIcon className="h-4 w-4" />
              <span className="hidden lg:inline">Claro</span>
            </button>
            <button
              type="button"
              onClick={setDark}
              title="Modo oscuro"
              aria-pressed={theme === 'dark'}
              className={`${themeBtn} ${
                theme === 'dark'
                  ? 'bg-pine-soft text-pine-strong'
                  : 'text-ink-soft hover:text-ink'
              }`}
            >
              <MoonIcon className="h-4 w-4" />
              <span className="hidden lg:inline">Oscuro</span>
            </button>
          </div>
        </li>

        {isAuthenticated ? (
          <>
            <li>
              <Link
                to="/profile"
                aria-label={`Perfil de ${user?.username}`}
                className="press flex items-center gap-2 rounded-lg border border-line bg-paper/70 py-1.5 pl-1.5 pr-3 transition hover:border-pine/40 hover:bg-pine-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pine motion-reduce:transition-none"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full border border-pine/25 bg-pine-soft text-xs font-semibold text-pine">
                  {initial}
                </span>
                <span className="hidden max-w-[10rem] truncate text-ink-soft sm:inline">
                  {user?.username}
                </span>
              </Link>
            </li>
            <li>
              <Link to="/add-task" className={primaryBtn}>
                <PlusIcon className="h-4 w-4" />
                Nueva tarea
              </Link>
            </li>
            <li>
              <button
                type="button"
                onClick={handleLogout}
                className={`${ghostBtn} hover:border-brick/40 hover:bg-brick-soft hover:text-brick focus-visible:ring-brick`}
              >
                <LogoutIcon className="h-4 w-4" />
                Salir
              </button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/login" className={`${ghostBtn} focus-visible:ring-pine`}>
                Iniciar sesión
              </Link>
            </li>
            <li>
              <Link to="/register" className={primaryBtn}>
                Crear cuenta
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  )
}
