import express from 'express';
import { getBios, getBio, addBio, deleteBio, updateBio } from '../controllers/bio.js';


// creation du router
const router = express.Router();

// routes pour les textes bio
router.get("/", getBios);
router.get("/:id", getBio);
router.post("/", addBio);
router.delete("/:id", deleteBio);
router.put("/:id", updateBio);

export default router;