import {useState} from 'react'
import {TasksContext} from './TasksContext'
import {createTaskRequest, deleteTaskRequest, getTasksRequest, getTaskRequest, updateTaskRequest} from '../api/tasks.js'

export const TaskContextProvider = ({children}) => {

  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)

  const getTasks = async () => {
    setLoading(true)
  try {
    const res = await getTasksRequest()
    setTasks(res.data.tasks)
  } catch (error) {
    console.error(error)
  } finally {
    setLoading(false)
  }
}

const getTask = async (id) => {
      const res = await getTaskRequest(id)
      return res.data.task
    
  }

  const createTask = async (task) => {
  const res = await createTaskRequest(task)
  setTasks((prev) => [...prev, res.data.task])
}

const updateTask = async (id, task) => {
      const res = await updateTaskRequest(id, task) 
      setTasks((prev) => prev.map((t) => (t._id === id ? res.data.task : t)))
  }

  const deleteTask = async (id) => {
    try {
      await deleteTaskRequest(id)
      setTasks((prev) => prev.filter((task) => task._id !== id))
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <TasksContext.Provider value={{
      tasks, loading, getTasks, getTask, createTask, updateTask, deleteTask
    }}>
      {children}
    </TasksContext.Provider>
  )
}
