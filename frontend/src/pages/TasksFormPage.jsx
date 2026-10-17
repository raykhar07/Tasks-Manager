import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTasks } from '../hooks/useTasks.jsx'
import { useNavigate, useParams } from 'react-router-dom'
import { toInputDate, toISODate } from '../utils/date.js'

const PencilIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.862 4.487z" />
  </svg>
)

const PlusIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
  </svg>
)

const inputClasses =
  'mt-1.5 w-full rounded-lg border border-line bg-paper/60 px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-faint outline-none transition focus:border-pine focus:ring-2 focus:ring-pine/25 motion-reduce:transition-none'

const labelClasses = 'block text-sm font-medium text-ink-soft'

export const TasksFormPage = () => {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm()

  const { createTask, getTask, updateTask } = useTasks()

  const [serverError, setServerError] = useState('')

  const navigate = useNavigate()

  const { id } = useParams()

  useEffect(() => {
    if (!id) return
    const loadTask = async () => {
      try {
        const task = await getTask(id)
        setValue('title', task.title)
        setValue('description', task.description)
        setValue('date', toInputDate(task.date))
      } catch (error) {
        const data = error.response?.data
        setServerError(Array.isArray(data) ? data.join('. ') : data?.message || 'Error al cargar la tarea')
      }
    }
    loadTask()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onSubmit = handleSubmit(async (values) => {
    setServerError('')
    const task = {
      ...values,
      date: toISODate(values.date)
    }
    try {
      if (id) await updateTask(id, task)
      else await createTask(task)
      navigate('/tasks')
    } catch (error) {
      const data = error.response?.data
      setServerError(Array.isArray(data) ? data.join('. ') : data?.message || 'Error al guardar la tarea')
    }
  })

  const title = id ? 'Editar tarea' : 'Nueva tarea'

  return (
    <div className="stagger flex h-[calc(100vh-140px)] items-center justify-center">
      <div className="stagger w-full max-w-md rounded-xl border border-line bg-surface p-6 sm:p-8">
        <header className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-line bg-paper text-pine">
            {id ? <PencilIcon className="h-5 w-5" /> : <PlusIcon className="h-5 w-5" />}
          </span>
          <div>
            <h1 className="text-xl tracking-tight text-ink">{title}</h1>
            <p className="text-sm text-ink-soft">
              {id ? 'Actualiza los datos y guarda' : 'Describe qué necesitas hacer'}
            </p>
          </div>
        </header>

        {serverError && (
          <p className="mt-5 rounded-lg border border-brick/30 bg-brick-soft px-3 py-2 text-sm text-brick">
            {serverError}
          </p>
        )}

        <form onSubmit={onSubmit} className="stagger mt-5 space-y-4">
          <div>
            <label htmlFor="title" className={labelClasses}>Título</label>
            <input
              id="title"
              type="text"
              placeholder="Comprar materiales"
              autoFocus
              {...register('title', { required: 'El título es requerido' })}
              className={inputClasses}
            />
            {errors.title && <p className="mt-1.5 text-xs text-brick">{errors.title.message}</p>}
          </div>

          <div>
            <label htmlFor="description" className={labelClasses}>Descripción</label>
            <textarea
              id="description"
              rows="3"
              placeholder="Detalles de la tarea"
              {...register('description', { required: 'La descripción es requerida' })}
              className={`${inputClasses} resize-y`}
            ></textarea>
            {errors.description && <p className="mt-1.5 text-xs text-brick">{errors.description.message}</p>}
          </div>

          <div>
            <label htmlFor="date" className={labelClasses}>Fecha</label>
            <input
              id="date"
              type="date"
              {...register('date')}
              className={inputClasses}
            />
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => navigate('/tasks')}
              className="press inline-flex items-center justify-center rounded-lg border border-line bg-paper/70 px-4 py-2 text-sm font-medium text-ink-soft transition hover:bg-paper hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pine motion-reduce:transition-none"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="press inline-flex items-center justify-center rounded-lg bg-pine px-4 py-2 text-sm font-semibold text-on-pine transition hover:bg-pine-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pine motion-reduce:transition-none"
            >
              Guardar tarea
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
