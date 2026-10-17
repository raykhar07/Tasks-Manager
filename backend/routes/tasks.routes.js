import {Router} from 'express';
import {authRequired} from '../middlewares/validateToken.js';
import {getTasks, getTask, createTask, updateTask, deleteTask} from '../controllers/task.controller.js';
import { taskSchema } from '../schemas/task.schema.js';
import { validateSchema } from '../middlewares/schemaValidator.js';

const router = Router();

router.get('/tasks', authRequired, getTasks);
router.get('/tasks/:id', authRequired, getTask);
router.post('/tasks', authRequired, validateSchema(taskSchema), createTask);
router.put('/tasks/:id', authRequired, validateSchema(taskSchema), updateTask);
router.delete('/tasks/:id', authRequired, deleteTask);

export default router;