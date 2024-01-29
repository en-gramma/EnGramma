import {db} from '../db.js';
import jwt from 'jsonwebtoken';
import DOMPurify from 'isomorphic-dompurify'
import dotenv from 'dotenv';

dotenv.config();

//récupération des videos
export const getVideos =  (req, res, next) => {
    const q = 'SELECT * FROM videos';
    db.query(q, (err, result) => {
        if (err) 
        return res.status(500).send(err);
        res.status(200).json(result);
    });
};

//effacer une video par son id avec comparaison du token
export const deleteVideo = (req, res, next) => {
    const token = req.cookies.access_token;
    if (!token) return res.status(401).json("Vous devez être connecté pour supprimer un album.");
  
    jwt.verify(token, process.env.JWT_SECRET, (err) => {
        if (err) return res.status(403).json("Vous n'êtes pas autorisé à supprimer cet album.");

        const videoId = req.params.id;

        const deleteQuery = 'DELETE FROM videos WHERE id = ?';
        db.query(deleteQuery, [videoId], (err) => {
            if (err) {
                next(err);
                return;
            }
            return res.status(200).json('La vidéo a été supprimée avec succès.');
        });
    });
};

// ajouter un album
export const addVideo= (req, res, next) => {
    const token = req.cookies.access_token;
    if (!token) return res.status(401).json("Pas de token trouvé.");
  
    jwt.verify(token, process.env.JWT_SECRET, (err) => {
      if (err) {
        next(err);
        return;
      }
  
      const q =
        "INSERT INTO videos (`link`) VALUES (?)";
  
        const values = req.body.link;

      db.query(q, [values], (err, data) => {
        if (err) {
          next(err);
          return;
        }
        return res.json("La vidéo a été ajoutée avec succès.");
      });
    });
  };