import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useAuth } from '../hooks/useAuth.jsx'
import { Link, useNavigate } from 'react-router-dom'

const LoginIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
  </svg>
)

const inputClasses =
  'mt-1.5 w-full rounded-lg border border-line bg-paper/60 px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-faint outline-none transition focus:border-pine focus:ring-2 focus:ring-pine/25 motion-reduce:transition-none'

const labelClasses = 'block text-sm font-medium text-ink-soft'

export const LoginPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm()

  const { signIn, errors: signinErrors, isAuthenticated } = useAuth()

  const navigate = useNavigate()

  const onSubmit = handleSubmit((data) => {
    signIn(data)
  })

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/tasks')
    }
  }, [navigate, isAuthenticated])

  return (
    <div className="stagger flex h-[calc(100vh-140px)] items-center justify-center">
      <div className="stagger w-full max-w-md rounded-xl border border-line bg-surface p-6 sm:p-8">
        <header className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-line bg-paper text-pine">
            <LoginIcon className="h-5 w-5" />
          </span>
          <div>
            <h1 className="text-xl tracking-tight text-ink">Iniciar sesión</h1>
            <p className="text-sm text-ink-soft">Accede para ver tus tareas</p>
          </div>
        </header>

        {signinErrors.length > 0 && (
          <div className="mt-5 space-y-2">
            {signinErrors.map((error, i) => (
              <p key={i} className="rounded-lg border border-brick/30 bg-brick-soft px-3 py-2 text-sm text-brick">
                {error}
              </p>
            ))}
          </div>
        )}

        <form onSubmit={onSubmit} className="stagger mt-5 space-y-4">
          <div>
            <label htmlFor="email" className={labelClasses}>Correo electrónico</label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="tu@correo.com"
              {...register('email', { required: true })}
              className={inputClasses}
            />
            {errors.email && <p className="mt-1.5 text-xs text-brick">El correo es requerido</p>}
          </div>

          <div>
            <label htmlFor="password" className={labelClasses}>Contraseña</label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••"
              {...register('password', { required: true })}
              className={inputClasses}
            />
            {errors.password && <p className="mt-1.5 text-xs text-brick">La contraseña es requerida</p>}
          </div>

          <button
            type="submit"
            className="press w-full rounded-lg bg-pine px-4 py-2.5 text-sm font-semibold text-on-pine transition hover:bg-pine-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pine motion-reduce:transition-none"
          >
            Entrar
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-ink-soft">
          ¿No tienes cuenta?{' '}
          <Link to="/register" className="font-medium text-pine transition hover:text-pine-strong hover:underline motion-reduce:transition-none">
            Crear una
          </Link>
        </p>
      </div>
    </div>
  )
}
