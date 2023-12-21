import express from 'express';
import { forgotPassword, resetPassword } from '../controllers/passwordrecovery.js';

const router = express.Router();

// Route de récupération du mot de passe
router.post("/forgot-password", forgotPassword);

// Route de réinitialisation du mot de passe
router.post("/reset-password", resetPassword);

export default router;