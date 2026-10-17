import { useForm } from 'react-hook-form'
import { useAuth } from '../hooks/useAuth.jsx'
import { useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'

const UserPlusIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
  </svg>
)

const inputClasses =
  'mt-1.5 w-full rounded-lg border border-line bg-paper/60 px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-faint outline-none transition focus:border-pine focus:ring-2 focus:ring-pine/25 motion-reduce:transition-none'

const labelClasses = 'block text-sm font-medium text-ink-soft'

export const RegisterPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm()

  const { signUp, isAuthenticated, errors: registerErrors } = useAuth()

  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated) navigate('/tasks')
  }, [navigate, isAuthenticated])

  const onSubmit = handleSubmit((values) => {
    signUp(values)
  })

  return (
    <div className="stagger flex h-[calc(100vh-140px)] items-center justify-center">
      <div className="stagger w-full max-w-md rounded-xl border border-line bg-surface p-6 sm:p-8">
        <header className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-line bg-paper text-pine">
            <UserPlusIcon className="h-5 w-5" />
          </span>
          <div>
            <h1 className="text-xl tracking-tight text-ink">Crear cuenta</h1>
            <p className="text-sm text-ink-soft">Empieza a organizar tus tareas</p>
          </div>
        </header>

        {registerErrors.length > 0 && (
          <div className="mt-5 space-y-2">
            {registerErrors.map((error, i) => (
              <p key={i} className="rounded-lg border border-brick/30 bg-brick-soft px-3 py-2 text-sm text-brick">
                {error}
              </p>
            ))}
          </div>
        )}

        <form onSubmit={onSubmit} className="stagger mt-5 space-y-4">
          <div>
            <label htmlFor="username" className={labelClasses}>Nombre de usuario</label>
            <input
              id="username"
              type="text"
              autoComplete="username"
              placeholder="tu_usuario"
              {...register('username', { required: true })}
              className={inputClasses}
            />
            {errors.username && <p className="mt-1.5 text-xs text-brick">El nombre de usuario es requerido</p>}
          </div>

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
              autoComplete="new-password"
              placeholder="Mínimo 6 caracteres"
              {...register('password', { required: true, minLength: 6 })}
              className={inputClasses}
            />
            {errors.password && (
              <p className="mt-1.5 text-xs text-brick">
                {errors.password.type === 'minLength'
                  ? 'La contraseña debe tener al menos 6 caracteres'
                  : 'La contraseña es requerida'}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="press w-full rounded-lg bg-pine px-4 py-2.5 text-sm font-semibold text-on-pine transition hover:bg-pine-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pine motion-reduce:transition-none"
          >
            Crear cuenta
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-ink-soft">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="font-medium text-pine transition hover:text-pine-strong hover:underline motion-reduce:transition-none">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  )
}
