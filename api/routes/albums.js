import express from 'express';
import { getAlbums, getAlbum, addAlbum, deleteAlbum, updateAlbum } from '../controllers/album.js';


// creation du router
const router = express.Router();

// routes pour les voitures
router.get("/", getAlbums);
router.get("/:id", getAlbum);
router.post("/", addAlbum);
router.delete("/:id", deleteAlbum);
router.put("/:id", updateAlbum);

export default router;