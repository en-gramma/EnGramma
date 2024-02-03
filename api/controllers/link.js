import {db} from '../db.js';
import jwt from 'jsonwebtoken';

//récupération des liens
export const getLinks =  (req, res, next) => {
    const q = 'SELECT * FROM links';
    db.query(q, (err, result) => {
        if (err) 
        return res.status(500).send(err);
        res.status(200).json(result);
    });
};

//changer les liens des dossiers et fiche technique
export const updateLinks =  (req, res, next) => {
       const token = req.cookies.access_token;
    if (!token) return res.status(401).json("Pas de token trouvé.");
  
    jwt.verify(token, process.env.JWT_SECRET, (err) => {
      if (err) return res.status(403).json("Le token n'est pas valide.");

    // URL validation regex
    const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;

    if ((req.body.dossier !== '' && !urlRegex.test(req.body.dossier)) || (req.body.fiche !== '' && !urlRegex.test(req.body.fiche))) {
        return res.status(400).json("L'URL n'est pas valide.");
    }
  
  
      const q = 
      "UPDATE links SET `dossier`=?, `fiche`=? WHERE `id`=?";

      const values = [
        req.body.dossier,
        req.body.fiche,
        req.params.id
      ];
  
      db.query(q, values, (err, data) => {
        if (err) {
          next(err);
          return;
        }
  
        return res.json("Les liens ont été modifiés avec succès.");
      });
    });
}; 