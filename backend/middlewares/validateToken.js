import jwt from "jsonwebtoken";
import {config} from "../config.js";
import User from "../models/user.model.js";

export const authRequired = async (req, res, next) => {
  const { token } = req.cookies
  if (!token) return res.status(401).json({ message: "Acceso denegado" });

  let payload;
  try {
    // Se fija el algoritmo esperado para descartar tokens firmados con otro.
    payload = jwt.verify(token, config.SECRET_KEY, { algorithms: ["HS256"] });
  } catch {
    return res.status(401).json({ message: "Token inválido" });
  }

  try {
    const user = await User.findById(payload.id).select("tokenVersion");

    // El usuario ya no existe, o la contraseña cambió después de emitir el
    // token (tokenVersion distinta): la sesión deja de ser válida.
    if (!user) return res.status(401).json({ message: "Token inválido" });
    if ((payload.tokenVersion ?? 0) !== (user.tokenVersion ?? 0)) {
      return res.status(401).json({ message: "Token inválido" });
    }

    req.user = { id: user._id.toString() };
    next();
  } catch {
    return res.status(401).json({ message: "Token inválido" });
  }
}
