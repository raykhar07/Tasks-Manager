import Task from "../models/task.model.js";

export const getTasks = async (req, res) => {
    const tasks = await Task.find({
      user: req.user.id
    })
    res.json({
      message: "Tareas obtenidas exitosamente",
      tasks
    });
}

export const getTask = async (req, res) => {
    const task = await Task.findOne({ _id: req.params.id, user: req.user.id });
    if (!task) return res.status(404).json({ message: "Tarea no encontrada" });
    res.json({
      message: "Tarea obtenida exitosamente",
      task
    });
  
}

export const createTask = async (req, res) => {
    const { title, description, date } = req.body;
    const task = await Task.create({ title, description, date, user: req.user.id });
    res.json({
      message: "Tarea creada exitosamente",
      task
    });
}

export const updateTask = async (req, res) => {
    const task = await Task.findOneAndUpdate({
      _id: req.params.id,
      user: req.user.id
    },
    req.body,
    { new: true, runValidators: true });
    if (!task) return res.status(404).json({ message: "Tarea no encontrada" });
    res.json({
      message: "Tarea actualizada exitosamente",
      task
    });

};
export const deleteTask = async (req, res) => {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });
    if (!task) return res.status(404).json({ message: "Tarea no encontrada" });
    res.status(200).json({
      message: "Tarea eliminada exitosamente",
      task: task
    });
}