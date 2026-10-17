import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    // El hash nunca se incluye en las consultas salvo que se pida con
    // .select('+password'): así no se filtra por accidente en respuestas.
    select: false
  },
  // Se incrementa al cambiar la contraseña para invalidar los JWT ya emitidos.
  tokenVersion: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
})

export default mongoose.model("User", userSchema)
