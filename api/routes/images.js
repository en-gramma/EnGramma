import express from 'express';
import { getImages, addImage, deleteImage } from '../controllers/image.js';


// creation du router
const router = express.Router();

// routes pour les voitures
router.get("/", getImages);
router.post("/", addImage);
router.delete("/:id", deleteImage);

export default router;