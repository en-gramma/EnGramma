import {db} from '../db.js';
import jwt from 'jsonwebtoken';
import DOMPurify from 'isomorphic-dompurify'
import dotenv from 'dotenv';
import {v2 as cloudinary} from 'cloudinary'

dotenv.config();
 
//récupération des voitures
export const getArticles=  (req, res, next) => {
    const q = 'SELECT * FROM articles';
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

//effacer une voiture par son id avec comparaison du token
export const deleteArticle = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Vous devez être connecté pour supprimer un article.");

  jwt.verify(token, process.env.JWT_SECRET, (err) => {
    if (err) return res.status(403).json("Vous n'êtes pas autorisé à supprimer cet article.");
    
    const articleId = req.params.id;
    const q = 'SELECT image FROM articles WHERE id = ?';

    db.query(q, [carId], (err, data) => {
      if (err) {
        next(err);
        return;
      }
      
      const article = data[0];
      if (!article) {
        return res.status(404).json("L\'article n'a pas été trouvé.");
      }

      const imageURL = article.image;
      const imagePublicId = imageURL.split('/').pop().split('.')[0];

      // Efface l'image de cloudinary
      cloudinary.uploader.destroy(imagePublicId)
        .then(() => {
          const deleteQuery = 'DELETE FROM articles WHERE id = ?';
          db.query(deleteQuery, [articleId], (err) => {
            if (err) {
              next(err);
              return;
            }
            return res.status(200).json('La voiture a été supprimée avec succès.');
          });
        })
        .catch((error) => {
          console.error('Erreur lors de la suppression de l\'image sur Cloudinary:', error);
          return res.status(500).json('Une erreur s\'est produite lors de la suppression de la voiture.');
        });
    });
  });
};
 
// ajouter une voiture
  export const addArticle= (req, res, next) => {
    const token = req.cookies.access_token;
    if (!token) return res.status(401).json("Pas de token trouvé.");
  
    jwt.verify(token, process.env.JWT_SECRET, (err) => {
      if (err) {
        next(err);
        return;
      }
  
      const q =
        "INSERT INTO articles ( `image`, `text`, `name`, `country`) VALUES (?)";
  
      const values = [
        DOMPurify.sanitize(req.body.image),
        DOMPurify.sanitize(req.body.text),
        DOMPurify.sanitize(req.body.name),
        DOMPurify.sanitize(req.body.country),
   
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
        return res.json("L'article a été ajouté avec succès.");
      });
    });
  };

// modifier une voiture
export const updateArticle =  (req, res, next) => {
       const token = req.cookies.access_token;
    if (!token) return res.status(401).json("Pas de token trouvé.");
  
    jwt.verify(token, process.env.JWT_SECRET, (err) => {
      if (err) return res.status(403).json("Le token n'est pas valide.");
  
      const q = 
      "UPDATE articles SET  `image`=?, `text`=?, `name`=?, `country`=?  WHERE `id`=?";

      const values = [
        DOMPurify.sanitize(req.body.image),
        DOMPurify.sanitize(req.body.text),
        DOMPurify.sanitize(req.body.name),
        DOMPurify.sanitize(req.body.country),
        req.params.id
      ];
  
      db.query(q, values, (err, data) => {
        if (err) {
          next(err);
          return;
        }
  
        return res.json("L'article a été modifié avec succès.");
      });
    });
}; 