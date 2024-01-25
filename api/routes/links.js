import express from 'express';
import { getLinks, updateLinks } from '../controllers/link.js';


// creation du router
const router = express.Router();

// routes pour les voitures
router.get("/", getLinks);
router.put("/:id", updateLinks);


export default router;