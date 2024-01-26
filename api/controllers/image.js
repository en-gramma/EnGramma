import {db} from '../db.js';
import jwt from 'jsonwebtoken';
import DOMPurify from 'isomorphic-dompurify'
import dotenv from 'dotenv';
import {v2 as cloudinary} from 'cloudinary'

dotenv.config();

//configuration des variables cloudinary
cloudinary.config({
    cloud_name: process.env.REACT_APP_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.REACT_APP_CLOUDINARY_KEY,
    api_secret: process.env.REACT_APP_CLOUDINARY_SECRET_KEY,
    secure : true
  });

  //récupération des voitures
export const getImages=  (req, res, next) => {
    const q = 'SELECT * FROM images';
    db.query(q, (err, result) => {
        if (err) 
        return res.status(500).send(err);
        res.status(200).json(result);
    });
};

//effacer une voiture par son id avec comparaison du token
export const deleteImage = (req, res, next) => {
    const token = req.cookies.access_token;
    if (!token) return res.status(401).json("Vous devez être connecté pour supprimer une voiture.");
  
    jwt.verify(token, process.env.JWT_SECRET, (err) => {
      if (err) return res.status(403).json("Vous n'êtes pas autorisé à supprimer cette voiture.");
      
      const imageId = req.params.id;
      const q = 'SELECT image FROM images WHERE id = ?';
  
      db.query(q, [imageId], (err, data) => {
        if (err) {
          next(err);
          return;
        }
        
        const image = data[0];
        if (!image) {
          return res.status(404).json("L'image' n'a pas été trouvée.");
        }
  
        const imageURL = image.image;
        const imagePublicId = imageURL.split('/').pop().split('.')[0];
  
        // Efface l'image de cloudinary
        cloudinary.uploader.destroy(imagePublicId)
          .then(() => {
            const deleteQuery = 'DELETE FROM images WHERE id = ?';
            db.query(deleteQuery, [imageId], (err) => {
              if (err) {
                next(err);
                return;
              }
              return res.status(200).json("L'image' a été supprimée avec succès.");
            });
          })
          .catch((error) => {
            console.error('Erreur lors de la suppression de l\'image sur Cloudinary:', error);
            return res.status(500).json('Une erreur s\'est produite lors de la suppression de l\'image.');
          });
      });
    });
  };

// ajouter une voiture
export const addImage = (req, res, next) => {
    const token = req.cookies.access_token;
    if (!token) return res.status(401).json("Pas de token trouvé.");
  
    jwt.verify(token, process.env.JWT_SECRET, (err) => {
      if (err) {
        next(err);
        return;
      }
  
      const q =
        "INSERT INTO images (`title`, `author`, `image` ) VALUES (?)";
  
      const values = [
        DOMPurify.sanitize(req.body.title),
        DOMPurify.sanitize(req.body.author),
        DOMPurify.sanitize(req.body.image),
        
      ];
  
      db.query(q, [values], (err, data) => {
        if (err) {
          next(err);
          return;
        }
        return res.json("L'image a été ajoutée avec succès.");
      });
    });
  };