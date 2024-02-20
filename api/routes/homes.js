import express from 'express';
import { getHomes, updateHome } from '../controllers/home.js';


// creation du router
const router = express.Router();

// routes pour les textes bio
router.get("/", getHomes);
router.put("/:id", updateHome);

export default router;