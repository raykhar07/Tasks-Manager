import { config } from '../config.js'

export const cookieOptions = {
  httpOnly: true,
  sameSite: config.COOKIE_SAMESITE,
  secure: config.isProduction,
  maxAge: 24 * 60 * 60 * 1000
}