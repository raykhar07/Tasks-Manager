import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)

export const formatDate = (date) => dayjs.utc(date).format('DD/MM/YYYY')

export const formatRelativeDate = (date) => {
  const target = dayjs.utc(date).startOf('day')
  const today = dayjs.utc().startOf('day')
  const diff = target.diff(today, 'day')
  if (diff === 0) return 'Hoy'
  if (diff === 1) return 'Mañana'
  if (diff === -1) return 'Ayer'
  return target.format('DD/MM/YYYY')
}

export const isPastDate = (date) =>
  dayjs.utc(date).startOf('day').isBefore(dayjs.utc().startOf('day'))
export const toInputDate = (date) => dayjs.utc(date).format('YYYY-MM-DD')
export const toISODate = (date) => dayjs.utc(date || dayjs().format('YYYY-MM-DD')).format()