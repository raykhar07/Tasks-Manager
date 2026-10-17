import {instance} from './axios'

export const registerRequest = user => instance.post(`/register`, user)

export const loginRequest = user => instance.post(`/login`, user)

export const verifyTokenRequest = () => instance.get(`/verify`)

export const logoutRequest = () => instance.post(`/logout`)