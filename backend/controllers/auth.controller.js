import User from "../models/user.model.js";
import Task from "../models/task.model.js";
import bcrypt from "bcryptjs";
import {createAccessToken} from "../libs/jwt.js";
import jwt from "jsonwebtoken";
import {config} from "../config.js";
import { cookieOptions } from "../libs/cookie.js";

// Hash de relleno con el que se compara cuando el email no existe. Evita que
// el tiempo de respuesta (bcrypt tarda ~100 ms) revele si la cuenta existe.
const DUMMY_PASSWORD_HASH = bcrypt.hashSync("placeholder-no-usado-0", 10)

const serializeUser = (user) => ({
  id: user._id,
  username: user.username,
  email: user.email,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt
})

const sendSession = async (res, user, message) => {
  const token = await createAccessToken({ id: user._id, tokenVersion: user.tokenVersion ?? 0 });
  res.cookie("token", token, cookieOptions)
  res.json({
    message,
    data: serializeUser(user)
  })
}

export const register = async (req, res) => {
  const { username, email, password } = req.body;
  const userFound = await User.findOne({ email });
  if (userFound) return res.status(400).json( ["El usuario ya existe"] );

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ username, email, password: hashedPassword });
  const savedUser = await user.save();
  await sendSession(res, savedUser, "Usuario registrado correctamente");
}

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+password");

  // Se compara siempre (contra un hash de relleno si el email no existe) para
  // no distinguir por tiempo si la cuenta está registrada.
  const isMatch = await bcrypt.compare(password, user?.password ?? DUMMY_PASSWORD_HASH);

  // Un único mensaje para "no existe" y "contraseña incorrecta": evita
  // enumerar cuentas registradas.
  if (!user || !isMatch) {
    return res.status(400).json({ message: "Credenciales inválidas" });
  }

  await sendSession(res, user, "Usuario logueado correctamente");
}

export const logout = (req, res) => {
  res.clearCookie('token', cookieOptions)
  return res.sendStatus(200);
}

export const profile = async (req, res) => {
  const user = await User.findById(req.user.id)
  if (!user) return res.status(404).json({ message: "Usuario no encontrado" });
  return res.json(serializeUser(user))
}

export const updateProfile = async (req, res) => {
  const { username, email } = req.body
  const userId = req.user.id

  const existingUser = await User.findOne({
    email,
    _id: { $ne: userId }
  })

  if (existingUser) {
    return res.status(400).json(["El email ya está en uso"])
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { username, email },
    { new: true, runValidators: true }
  )

  if (!user) {
    return res.status(404).json({ message: "Usuario no encontrado" })
  }

  return res.json({
    message: "Perfil actualizado correctamente",
    data: serializeUser(user)
  })
}

export const updatePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body
  const user = await User.findById(req.user.id).select("+password")

  if (!user) {
    return res.status(404).json({ message: "Usuario no encontrado" })
  }

  const isMatch = await bcrypt.compare(currentPassword, user.password)
  if (!isMatch) {
    return res.status(400).json({ message: "La contraseña actual es incorrecta" })
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10)
  user.password = hashedPassword
  // Invalida los JWT emitidos con la contraseña anterior.
  user.tokenVersion = (user.tokenVersion ?? 0) + 1
  await user.save()

  // Se reemite la sesión actual para que quien cambia la contraseña siga
  // dentro, pero cualquier token previo queda revocado.
  return sendSession(res, user, "Contraseña actualizada correctamente")
}

export const deleteProfile = async (req, res) => {
  const userId = req.user.id

  const user = await User.findById(userId)
  if (!user) {
    return res.status(404).json({ message: "Usuario no encontrado" })
  }

  await Task.deleteMany({ user: userId })
  await User.findByIdAndDelete(userId)

  res.clearCookie("token", cookieOptions)
  return res.json({ message: "Cuenta eliminada correctamente" })
}

export const verify = async (req, res) => {
  const { token } = req.cookies
  if (!token) return res.json(null)

  try {
    const payload = jwt.verify(token, config.SECRET_KEY, { algorithms: ["HS256"] })
    const user = await User.findById(payload.id)

    const sesionValida =
      user && (payload.tokenVersion ?? 0) === (user.tokenVersion ?? 0)

    if (!sesionValida) {
      res.clearCookie("token", cookieOptions)
      return res.json(null)
    }

    return res.json(serializeUser(user))
  } catch (error) {
    res.clearCookie("token", cookieOptions)
    res.json(null)
  }
}