import express from 'express';
import { getDates, getDate, addDate, deleteDate } from '../controllers/date.js';


// creation du router
const router = express.Router();

// routes pour les voitures
router.get("/", getDates);
router.get("/:id", getDate);
router.post("/", addDate);
router.delete("/:id", deleteDate);

export default router;