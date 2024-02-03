import {db} from '../db.js';
import jwt from 'jsonwebtoken';
import DOMPurify from 'isomorphic-dompurify'
import dotenv from 'dotenv';

dotenv.config();

//récupération des albums
export const getBios =  (req, res, next) => {
    const q = 'SELECT * FROM bios';
    db.query(q, (err, result) => {
        if (err) 
        return res.status(500).send(err);
        res.status(200).json(result);
    });
};

// récupération d'un album par son id
export const getBio =  (req, res, next) => {
    const q = 'SELECT * FROM bios WHERE id = ?';
    db.query (q, [req.params.id], (err, result) => {
        if (err) 
        return res.status(500).send(err);
        res.status(200).json(result);
    });
};

//effacer un album par son id avec comparaison du token
export const deleteBio = (req, res, next) => {
    const token = req.cookies.access_token;
    if (!token) return res.status(401).json("Vous devez être connecté pour supprimer un texte bio.");
  
    jwt.verify(token, process.env.JWT_SECRET, (err) => {
        if (err) return res.status(403).json("Vous n'êtes pas autorisé à supprimer ce texte bio.");

        const bioId = req.params.id;

        const deleteQuery = 'DELETE FROM bios WHERE id = ?';
        db.query(deleteQuery, [bioId], (err) => {
            if (err) {
                next(err);
                return;
            }
            return res.status(200).json('le texte a été supprimée avec succès.');
        });
    });
};

// ajouter un album
export const addBio= (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Pas de token trouvé.");

  jwt.verify(token, process.env.JWT_SECRET, (err) => {
    if (err) {
      next(err);
      return;
    }

    const frenchTitleRegex = /^[a-zA-Z0-9àâäéèêëïîôöùûüçÀÂÄÉÈÊËÏÎÔÖÙÛÜÇ' -]+$/;
    const descriptionRegex = /^[\w\W\s]*$/;
  
    // Validation
    if (!frenchTitleRegex.test(req.body.title)) {
      return res.status(400).json({ error: 'Erreur : Le titre contient des caractères non valides' });
    }
    if (!descriptionRegex.test(req.body.text)) {
      return res.status(400).json({ error: 'Erreur : La description contient des caractères non valides.' });
    }

    const q =
      "INSERT INTO albums (`title`, `description`, `image`) VALUES (?)";

    const values = [
      DOMPurify.sanitize(req.body.title),
      DOMPurify.sanitize(req.body.description),
      DOMPurify.sanitize(req.body.image),
    ];

    db.query(q, [values], (err, data) => {
      if (err) {
        next(err);
        return;
      }
      return res.json("Le texte a été ajouté avec succès.");
    });
  });
};

  export const updateBio =  (req, res, next) => {
    const token = req.cookies.access_token;
 if (!token) return res.status(401).json("Pas de token trouvé.");

 jwt.verify(token, process.env.JWT_SECRET, (err) => {
   if (err) return res.status(403).json("Le token n'est pas valide.");

   const q = 
   "UPDATE albums SET `title`=?, `description`=?, `image`=?, WHERE `id`=?";

  req.body.title = DOMPurify.sanitize(req.body.title);
  req.body.description = DOMPurify.sanitize(req.body.description);
  req.body.albumLink = DOMPurify.sanitize(req.body.image);


   const values = [
      req.body.title,
      req.body.description,
      req.body.image,
      req.params.id
   ];

   db.query(q, values, (err, data) => {
     if (err) {
       next(err);
       return;
     }

     return res.json("Le texte a été modifiée avec succès.");
   });
 });
}; 