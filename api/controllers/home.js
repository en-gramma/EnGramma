import {db} from '../db.js';
import jwt from 'jsonwebtoken';
import DOMPurify from 'isomorphic-dompurify'
import dotenv from 'dotenv';


dotenv.config();

//récupération du texte de la page d'accueil
export const getHomes =  (req, res, next) => {
    const q = 'SELECT * FROM homes';
    db.query(q, (err, result) => {
        if (err) 
        return res.status(500).send(err);
        res.status(200).json(result);
    });
};

// mise à jour du texte de la page d'accueil
export const updateHome =  (req, res, next) => {
    const token = req.cookies.access_token;
 if (!token) return res.status(401).json("Pas de token trouvé.");

 jwt.verify(token, process.env.JWT_SECRET, (err) => {
   if (err) return res.status(403).json("Le token n'est pas valide.");

   const q = 
   "UPDATE homes SET `text`=?, `textEn`=? WHERE `id`=?";

   const values = [
    DOMPurify.sanitize(req.body.text),
    DOMPurify.sanitize(req.body.textEn),
    req.params.id
  ];

   db.query(q, values, (err, data) => {
     if (err) {
      console.error(err);
       next(err);
       return;
     }

     return res.json("Le texte a été modifié avec succès.");
   });
 });
}; 