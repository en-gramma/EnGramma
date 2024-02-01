import express from 'express';
import { getRadiofrs, addRadiofr, deleteRadiofr, updateRadiofr } from '../controllers/radiofr.js';


// creation du router
const router = express.Router();

// routes pour les voitures
router.get("/", getRadiofrs);
router.post("/", addRadiofr);
router.delete("/:id", deleteRadiofr);
router.put("/:id", updateRadiofr);

export default router;