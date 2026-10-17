import { useCallback, useEffect, useState } from 'react'

const STORAGE_KEY = 'tm-theme'

const getInitialTheme = () => {
  if (typeof document === 'undefined') return 'light'
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light'
}

export const useTheme = () => {
  const [theme, setTheme] = useState(getInitialTheme)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    try {
      localStorage.setItem(STORAGE_KEY, theme)
    } catch {
      /* almacenamiento no disponible: el tema sigue funcionando en memoria */
    }
  }, [theme])

  const setLight = useCallback(() => setTheme('light'), [])
  const setDark = useCallback(() => setTheme('dark'), [])

  return { theme, setLight, setDark }
}
