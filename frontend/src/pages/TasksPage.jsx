import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTasks } from '../hooks/useTasks.jsx'
import { TaskCard } from '../components/TaskCard.jsx'

const PlusIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
  </svg>
)

const ctaClasses =
  'press inline-flex items-center gap-2 rounded-lg bg-pine px-4 py-2 text-sm font-semibold text-on-pine transition hover:bg-pine-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pine motion-reduce:transition-none'

const SkeletonCard = () => (
  <div className="animate-pulse rounded-xl border border-line bg-surface p-5 motion-reduce:animate-none">
    <div className="flex items-start justify-between gap-3">
      <div className="h-5 w-2/3 rounded-md bg-line/70" />
      <div className="h-6 w-20 rounded-lg bg-line/70" />
    </div>
    <div className="mt-4 space-y-2">
      <div className="h-3 w-full rounded bg-line/60" />
      <div className="h-3 w-5/6 rounded bg-line/60" />
    </div>
    <div className="mt-8 flex items-center justify-between">
      <div className="h-3 w-28 rounded bg-line/60" />
      <div className="flex gap-2">
        <div className="h-7 w-16 rounded-lg bg-line/70" />
        <div className="h-7 w-20 rounded-lg bg-line/70" />
      </div>
    </div>
  </div>
)

export const TasksPage = () => {
  const { getTasks, tasks, loading } = useTasks()

  useEffect(() => {
    getTasks()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (loading) {
    return (
      <div className="pb-10">
        <div className="mb-6 h-8 w-48 animate-pulse rounded-md bg-line/70 motion-reduce:animate-none" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    )
  }

  if (tasks.length === 0) {
    return (
      <div className="stagger flex flex-col items-center justify-center rounded-2xl border border-dashed border-line-strong bg-surface/60 px-6 py-16 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full border border-line bg-paper text-pine">
          <PlusIcon className="h-6 w-6" />
        </span>
        <h2 className="mt-4 text-xl text-ink">No tienes tareas todavía</h2>
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-ink-soft">
          Crea tu primera tarea y empieza a organizar lo que tienes pendiente.
        </p>
        <Link to="/add-task" className={`${ctaClasses} mt-6`}>
          <PlusIcon className="h-4 w-4" />
          Crear primera tarea
        </Link>
      </div>
    )
  }

  const label = tasks.length === 1 ? '1 tarea' : `${tasks.length} tareas`

  return (
    <div className="stagger pb-10">
      <header className="mb-6">
        <h1 className="text-3xl tracking-tight text-ink">Tus tareas</h1>
        <p className="mt-1 text-sm text-ink-soft">{label}</p>
      </header>

      <div className="stagger grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {tasks.map((task) => (
          <TaskCard key={task._id} task={task} />
        ))}
      </div>
    </div>
  )
}
