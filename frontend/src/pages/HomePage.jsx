import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.jsx'

const primaryCta =
  'press inline-flex items-center justify-center rounded-lg bg-pine px-6 py-3 text-sm font-semibold text-on-pine transition hover:bg-pine-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pine motion-reduce:transition-none'

const ghostCta =
  'press inline-flex items-center justify-center rounded-lg border border-line-strong bg-surface px-6 py-3 text-sm font-medium text-ink transition hover:bg-paper focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pine motion-reduce:transition-none'

const features = [
  {
    title: 'Tus tareas, solo tuyas',
    body: 'Cada cuenta ve únicamente sus tareas. El servidor filtra por usuario en cada consulta, no solo la interfaz.'
  },
  {
    title: 'Sesión en cookie httpOnly',
    body: 'El token viaja en una cookie que JavaScript no puede leer, con contraseñas cifradas con bcrypt.'
  },
  {
    title: 'Fechas en su contexto',
    body: 'Hoy, mañana o ayer se muestran por nombre, y las fechas vencidas se distinguen de un vistazo.'
  },
  {
    title: 'Validación en dos capas',
    body: 'Los esquemas con Zod protegen la API y los formularios avisan antes de enviar nada.'
  },
  {
    title: 'Cuenta bajo tu control',
    body: 'Cambia tus datos, actualiza la contraseña o elimina la cuenta con todas sus tareas.'
  },
  {
    title: 'Listo para producción',
    body: 'Backend y frontend contenerizados, con pruebas de rutas y healthcheck para el despliegue.'
  }
]

export const HomePage = () => {
  const { isAuthenticated } = useAuth()

  return (
    <div className="stagger py-10 md:py-16">
      <section className="stagger max-w-3xl">
        <h1 className="text-4xl leading-[1.1] tracking-tight text-ink sm:text-5xl lg:text-6xl">
          Un lugar tranquilo para todo lo que tienes pendiente
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft">
          Un gestor de tareas MERN pensado para usarse todos los días: crear,
          editar y cerrar pendientes sin ruido, con sesiones seguras y tus
          datos aislados por cuenta.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          {isAuthenticated ? (
            <Link to="/tasks" className={primaryCta}>
              Ir a mis tareas
            </Link>
          ) : (
            <>
              <Link to="/register" className={primaryCta}>
                Crear cuenta
              </Link>
              <Link to="/login" className={ghostCta}>
                Iniciar sesión
              </Link>
            </>
          )}
        </div>
      </section>

      <section className="stagger mt-16 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <article
            key={feature.title}
            className="lift rounded-xl border border-line bg-surface p-6"
          >
            <h2 className="text-lg text-ink">{feature.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">
              {feature.body}
            </p>
          </article>
        ))}
      </section>
    </div>
  )
}
