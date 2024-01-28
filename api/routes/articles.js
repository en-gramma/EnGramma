import express from 'express';
import { getArticles, addArticle, deleteArticle, updateArticle } from '../controllers/article.js';


// creation du router
const router = express.Router();

// routes pour les voitures
router.get("/", getArticles);
router.post("/", addArticle);
router.delete("/:id", deleteArticle);
router.put("/:id", updateArticle);

export default router;