import { useState } from 'react'
import { useTasks } from '../hooks/useTasks.jsx'
import { Link } from 'react-router-dom'
import { formatDate, formatRelativeDate, isPastDate } from '../utils/date.js'

const PencilIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.862 4.487z" />
  </svg>
)

const TrashIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
  </svg>
)

const CalendarIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
  </svg>
)

const btnBase =
  'press inline-flex items-center gap-1.5 rounded-lg border border-line bg-paper/70 px-3 py-1.5 text-xs font-medium text-ink-soft transition motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2'

export const TaskCard = ({ task }) => {
  const { deleteTask } = useTasks()
  const [removing, setRemoving] = useState(false)
  const overdue = isPastDate(task.date)

  const handleDelete = async () => {
    setRemoving(true)
    try {
      // Si el borrado tiene éxito, la tarjeta se desmonta y no pasa nada más.
      await deleteTask(task._id)
    } finally {
      // Si falló, la tarea sigue en la lista: devolvemos la tarjeta.
      setRemoving(false)
    }
  }

  return (
    <article
      style={removing ? { animation: 'card-out 200ms ease-in forwards' } : undefined}
      className={`lift group flex h-full flex-col rounded-xl border border-line bg-surface p-5 motion-reduce:transition-none ${
        removing ? 'pointer-events-none' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <h2 className="min-w-0 flex-1 text-lg tracking-tight text-ink">
          {task.title}
        </h2>
        <span
          className={`inline-flex shrink-0 items-center gap-1.5 rounded-lg border px-2 py-1 text-xs font-medium ${
            overdue
              ? 'border-brick/30 bg-brick-soft text-brick'
              : 'border-line bg-paper text-ink-soft'
          }`}
        >
          <CalendarIcon className="h-3.5 w-3.5" />
          {formatRelativeDate(task.date)}
        </span>
      </div>

      <p className="mb-4 mt-3 line-clamp-3 text-sm leading-relaxed text-ink-soft">
        {task.description}
      </p>

      <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
        <span className="text-xs text-ink-faint">
          Creada el {formatDate(task.createdAt ?? task.date)}
        </span>
        <div className="flex gap-2">
          <Link
            to={`/tasks/${task._id}`}
            className={`${btnBase} hover:border-pine/40 hover:bg-pine-soft hover:text-pine focus-visible:ring-pine`}
          >
            <PencilIcon className="h-3.5 w-3.5" />
            Editar
          </Link>
          <button
            type="button"
            onClick={handleDelete}
            disabled={removing}
            className={`${btnBase} hover:border-brick/40 hover:bg-brick-soft hover:text-brick focus-visible:ring-brick`}
          >
            <TrashIcon className="h-3.5 w-3.5" />
            Eliminar
          </button>
        </div>
      </div>
    </article>
  )
}
