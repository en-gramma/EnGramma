import {db} from '../db.js';
import jwt from 'jsonwebtoken';
import DOMPurify from 'isomorphic-dompurify'
import dotenv from 'dotenv';
import {v2 as cloudinary} from 'cloudinary'

dotenv.config();
 
//récupération des radios
export const getRadiofrs=  (req, res, next) => {
    const q = 'SELECT * FROM radiofrs';
    db.query(q, (err, result) => {
        if (err) 
        return res.status(500).send(err);
        res.status(200).json(result);
    });
};


//configuration des variables cloudinary
cloudinary.config({
  cloud_name: process.env.REACT_APP_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.REACT_APP_CLOUDINARY_KEY,
  api_secret: process.env.REACT_APP_CLOUDINARY_SECRET_KEY,
  secure : true
});

//effacer une radio par son id avec comparaison du token
export const deleteRadiofr = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Vous devez être connecté pour supprimer cette radio.");

  jwt.verify(token, process.env.JWT_SECRET, (err) => {
    if (err) return res.status(403).json("Vous n'êtes pas autorisé à supprimer cette radio.");
    
    const radioId = req.params.id;
    const q = 'SELECT image FROM radiofrs WHERE id = ?';

    db.query(q, [radioId], (err, data) => {
      if (err) {
        next(err);
        return;
      }
      
      const radio = data[0];
      if (!radio) {
        return res.status(404).json("La radio n'a pas été trouvé.");
      }

      const imageURL = radio.image;
      const imagePublicId = imageURL.split('/').pop().split('.')[0];

      // Efface l'image de cloudinary
      cloudinary.uploader.destroy(imagePublicId)
        .then(() => {
          const deleteQuery = 'DELETE FROM radiofrs WHERE id = ?';
          db.query(deleteQuery, [radioId], (err) => {
            if (err) {
              next(err);
              return;
            }
            return res.status(200).json('La radio été supprimée avec succès.');
          });
        })
        .catch((error) => {
          console.error('Erreur lors de la suppression de l\'image sur Cloudinary:', error);
          return res.status(500).json('Une erreur s\'est produite lors de la suppression de la radio.');
        });
    });
  });
};
 
// ajouter une radio
  export const addRadiofr = (req, res, next) => {
    const token = req.cookies.access_token;
    if (!token) return res.status(401).json("Pas de token trouvé.");
  
    jwt.verify(token, process.env.JWT_SECRET, (err) => {
      if (err) {
        next(err);
        return;
      }
  
  
      const q =
        "INSERT INTO radiofrs (`image`) VALUES (?)";
  
      const values = [
        DOMPurify.sanitize(req.body.image),
      ];
  
      db.query(q, [values], (err, data) => {
        if (err) {
          console.error(err); // Log the error to the console
          if (process.env.NODE_ENV === 'development') {
            // In development mode, send the error details to the client
            return res.status(500).json(err);
          } else {
            // In production mode, send a generic error message
            return res.status(500).json("Une erreur s'est produite lors de l'ajout de l'article.");
          }
        }
        return res.json("La radio a été ajoutée avec succès.");
      });
    });
  };

// modifier une radio
export const updateRadiofr =  (req, res, next) => {
       const token = req.cookies.access_token;
    if (!token) return res.status(401).json("Pas de token trouvé.");
  
    jwt.verify(token, process.env.JWT_SECRET, (err) => {
      if (err) return res.status(403).json("Le token n'est pas valide.");
  
      const q = 
      "UPDATE radios SET  `image`=? WHERE `id`=?";

      const values = [
        DOMPurify.sanitize(req.body.image),
        req.params.id
      ];
  
      db.query(q, values, (err, data) => {
        if (err) {
          next(err);
          return;
        }
  
        return res.json("La radio a été modifiée avec succès.");
      });
    });
}; 