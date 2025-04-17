import express from 'express';
import { createStackUserHandler ,checkStackUserExistsHandler } from '../controllers/userController.js';

const router = express.Router();

router.post('/create', createStackUserHandler);
router.post('/check-exists', checkStackUserExistsHandler);

export default router;
