import express from 'express';
import { sendMessage} from '../controllers/message.js';

const router = express.Router();

// Route de récupération du mot de passe
router.post("/", sendMessage);


export default router;