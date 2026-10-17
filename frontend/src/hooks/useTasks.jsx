import { useContext } from 'react'
import { TasksContext } from '../context/TasksContext.jsx'

export const useTasks = () => {
    const context = useContext(TasksContext)

    if (!context) {
      throw new Error("useTasks must be used within a TaskContextProvider")
    }
    return context
  }