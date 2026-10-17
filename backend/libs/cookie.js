import { config } from '../config.js'

export const cookieOptions = {
  httpOnly: true,
  sameSite: 'lax',
  secure: config.isProduction,
  maxAge: 24 * 60 * 60 * 1000
}