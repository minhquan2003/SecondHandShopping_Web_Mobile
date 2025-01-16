import express from 'express';
import { loginUser } from '../controllers/authController.js';

const authRoute = express.Router();

authRoute.post('/login', loginUser);

export default authRoute;
