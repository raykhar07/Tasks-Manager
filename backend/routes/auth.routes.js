import {Router} from 'express';
import { register, login, logout, profile, verify, updateProfile, updatePassword, deleteProfile } from '../controllers/auth.controller.js';
import { authRequired } from '../middlewares/validateToken.js';
import { registerSchema, loginSchema, updateProfileSchema, updatePasswordSchema } from '../schemas/userSchema.validation.js';
import { validateSchema } from '../middlewares/schemaValidator.js';
import { authLimiter } from '../middlewares/rateLimit.js';

const router = Router();

router.post('/register', authLimiter, validateSchema(registerSchema), register);

router.post('/login', authLimiter, validateSchema(loginSchema), login);

router.post('/logout', logout)

router.get('/profile', authRequired, profile)

router.put('/profile', authRequired, validateSchema(updateProfileSchema), updateProfile)

router.put('/profile/password', authRequired, validateSchema(updatePasswordSchema), updatePassword)

router.delete('/profile', authRequired, deleteProfile)

router.get('/verify', verify)

export default router;