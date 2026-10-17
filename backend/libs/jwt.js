import {config} from "../config.js";
import jwt from "jsonwebtoken";

export const createAccessToken = (payload)=> {
  return new Promise((res, rej) => {
    jwt.sign(
    payload, 
    config.SECRET_KEY, 
    {expiresIn: "1d"},
    (err, token)=> {
      if (err) {
        return rej(err);
      }
      res(token);
    });
  })
}