import express from 'express';
import { getVideos, addVideo, deleteVideo } from '../controllers/video.js';


// creation du router
const router = express.Router();

// routes pour les voitures
router.get("/", getVideos);
router.post("/", addVideo);
router.delete("/:id", deleteVideo);

export default router;