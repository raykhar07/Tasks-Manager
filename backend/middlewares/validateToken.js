import jwt from "jsonwebtoken";
import {config} from "../config.js";

export const authRequired = (req, res, next) => {
  const { token } = req.cookies
  if (!token) return res.status(401).json({ message: "Acceso denegado" });

  jwt.verify(token, config.SECRET_KEY, (err, payload) => {
    if (err) return res.status(401).json({ message: "Token inválido" });

    req.user = payload;

    next();
  })
}