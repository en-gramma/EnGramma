import express from 'express';
import { register, login, logout, getUsers, deleteUser, checkLoggin, getUser, updateUser, deleteImage } from '../controllers/auth.js';

// import du controller
const router = express.Router();

// routes pour les utilisateurs
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/", getUsers);
router.delete("/:id", deleteUser);
router.delete("/deleteImage/:id", deleteImage);
router.get("/checkLoggin", checkLoggin);
router.get("/users", getUsers);
router.get("/:id", getUser); 
router.put("/:id", updateUser);

export default router;