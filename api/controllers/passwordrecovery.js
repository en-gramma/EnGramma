import { db } from "../db.js";
import bcryptjs from "bcryptjs";
import crypto from "crypto";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import DOMPurify from "isomorphic-dompurify";

dotenv.config();
const apiUrl = process.env.API_URL_SERVER;
// Route de récupération du mot de passe
export const forgotPassword = async (req, res, next) => {
  const { email } = req.body;

  // Vérifier si l'e-mail existe dans la base de données²
  const q = "SELECT * FROM users WHERE email = ?";
  db.query(q, [DOMPurify.sanitize(email)], (err, data) => {
    if (err) {
      return res.status(500).json(err);
    }
    if (data.length === 0) {
      return res.status(400).json("Adresse e-mail invalide.");
    }

    // Générer un token de réinitialisation de mot de passe unique
    const resetToken = crypto.randomBytes(20).toString("hex");

    // Stocker le token de réinitialisation de mot de passe dans la base de données
    const updateQuery = "UPDATE users SET reset_token = ? WHERE email = ?";
    db.query(updateQuery, [resetToken, email], (err) => {
      if (err) {
        return res.status(500).json(err);
      }

      // Envoyer l'e-mail de réinitialisation du mot de passe à l'utilisateur
      const resetPasswordUrl = `${apiUrl}/reset-password?token=${resetToken}`;

      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port:465,
        secure: true,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_KEY,
        },
      });

      const mailOptions = {
        from: "votre-email@gmail.com",
        to: email,
        subject: "Réinitialisation du mot de passe",
        text: `Vous avez demandé la réinitialisation de votre mot de passe. Veuillez cliquer sur le lien suivant pour réinitialiser votre mot de passe : ${resetPasswordUrl}`,
      };

      transporter.sendMail(mailOptions, (err) => {
        if (err) {
          return res.status(500).json(err);
        }
        return res.status(200).json("Un e-mail de réinitialisation du mot de passe a été envoyé à votre adresse e-mail.");
      });
    });
  });
};

// Route de réinitialisation du mot de passe
export const resetPassword = async (req, res, next) => {
  const { token, password } = req.body;

  // Vérifier si le token de réinitialisation de mot de passe est valide
  const q = "SELECT * FROM users WHERE reset_token = ?";
  db.query(q, [DOMPurify.sanitize(token)], (err, data) => {
    if (err) {
      return res.status(500).json(err);
    }
    if (data.length === 0) {
      return res.status(400).json("Token de réinitialisation invalide ou expiré.");
    }

    const userId = data[0].id;

    // Générer un nouveau hash de mot de passe
    const salt = bcryptjs.genSaltSync(10);
    const hash = bcryptjs.hashSync(password, salt);

    // Mettre à jour le mot de passe de l'utilisateur dans la base de données
    const updateQuery = "UPDATE users SET password = ?, reset_token = NULL WHERE id = ?";
    db.query(updateQuery, [DOMPurify.sanitize(hash), DOMPurify.sanitize(userId)], (err) => {
      if (err) {
        return res.status(500).json(err);
      }
      return res.status(200).json("Le mot de passe a été réinitialisé avec succès.");
    });
  });
};

