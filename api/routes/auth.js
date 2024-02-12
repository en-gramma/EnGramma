import express from 'express';
import rateLimit from 'express-rate-limit';
import { register, login, logout, getUsers, deleteUser, checkLoggin, getUser, updateUser, deleteImage } from '../controllers/auth.js';

// import du controller
const router = express.Router();

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 100 
  });

// routes pour les utilisateurs
router.post("/register", limiter, register);
router.post("/login", limiter, login);
router.post("/logout", limiter, logout);
router.get("/", limiter, getUsers);
router.delete("/:id", limiter, deleteUser);
router.delete("/deleteImage/:id", limiter, deleteImage);
router.get("/checkLoggin", limiter, checkLoggin);
router.get("/users", limiter, getUsers);
router.get("/:id", limiter, getUser); 
router.put("/:id", limiter, updateUser);

export default router;