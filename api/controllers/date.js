import {db} from '../db.js';
import jwt from 'jsonwebtoken';
import DOMPurify from 'isomorphic-dompurify'
import dotenv from 'dotenv';

dotenv.config();

//récupération des dates
export const getDates=  (req, res, next) => {
    const q = 'SELECT * FROM dates';
    db.query(q, (err, result) => {
        if (err) 
        return res.status(500).send(err);
        res.status(200).json(result);
    });
};

// récupération d'une date par son id
export const getDate =  (req, res, next) => {
    const q = 'SELECT * FROM dates WHERE id = ?';
    db.query (q, [req.params.id], (err, result) => {
        if (err) 
        return res.status(500).send(err);
        res.status(200).json(result);
    });
};

//effacer une datepar son id avec comparaison du token
export const deleteDate = (req, res, next) => {
    const token = req.cookies.access_token;
    if (!token) return res.status(401).json("Vous devez être connecté pour supprimer une date.");
  
    jwt.verify(token, process.env.JWT_SECRET, (err) => {
        if (err) return res.status(403).json("Vous n'êtes pas autorisé à supprimer cette date.");

        const dateId = req.params.id;

        const deleteQuery = 'DELETE FROM dates WHERE id = ?';
        db.query(deleteQuery, [dateId], (err) => {
            if (err) {
                next(err);
                return;
            }
            return res.status(200).json('La date a été supprimée avec succès.');
        });
    });
};

// ajouter un album
export const addDate= (req, res, next) => {
    const token = req.cookies.access_token;
    if (!token) return res.status(401).json("Pas de token trouvé.");
  
    jwt.verify(token, process.env.JWT_SECRET, (err) => {
      if (err) {
        next(err);
        return;
      }

      const dayRegex = /^\d+$/;
      const wordRegex = /^[\w\W\s]*$/;
    
      if (!dayRegex.test(req.body.day) || !wordRegex.test(req.body.month) || 
          !wordRegex.test(req.body.place) || !wordRegex.test(req.body.city)|| !wordRegex.test(req.body.monthEn)
          || !dayRegex.test(req.body.year)) {
        return res.status(400).json("Les données entrées sont invalides.");
      }
  
      const q =
        "INSERT INTO dates (`day`, `month`, `place`, `city`, `monthEn`, `year`) VALUES (?)";
  
        const values = [
          DOMPurify.sanitize(req.body.day),
          DOMPurify.sanitize(req.body.month),
          DOMPurify.sanitize(req.body.place),
          DOMPurify.sanitize(req.body.city),
          DOMPurify.sanitize(req.body.monthEn),
          DOMPurify.sanitize(req.body.year)
        ];
  
      db.query(q, [values], (err, data) => {
        if (err) {
          next(err);
          return;
        }
        return res.json("la date a été ajoutée avec succès.");
      });
    });
  };
