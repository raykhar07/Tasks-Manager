export const errorHandler = (err, req, res, next) => {
  console.error(err);
  if (err.name === "CastError") return res.status(400).json({ message: "ID inválido" });
  res.status(500).json({ message: "Error interno del servidor" });
}