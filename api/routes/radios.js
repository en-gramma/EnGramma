import express from 'express';
import { getRadios, addRadio, deleteRadio, updateRadio } from '../controllers/radio.js';


// creation du router
const router = express.Router();

// routes pour les voitures
router.get("/", getRadios);
router.post("/", addRadio);
router.delete("/:id", deleteRadio);
router.put("/:id", updateRadio);

export default router;