import { db } from "../db.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import DOMPurify from "isomorphic-dompurify";
import dotenv from "dotenv";
import {v2 as cloudinary} from 'cloudinary'

dotenv.config();

export const checkLoggin = (req, res) => {
  const token = req.cookies.access_token;

  if (!token) {
    return res.status(401).json("Vous n'êtes pas connecté.");
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json("Vous n'êtes pas autorisé.");
    }

    const userId = decoded.id;
    const q = 'SELECT id, username, email, role FROM users WHERE id = ?';
    db.query(q, [userId], (err, result) => {
      if (err) {
        return res.status(500).json("Une erreur s'est produite lors de la récupération des informations de l'utilisateur.");
      }

      if (result.length === 0) {
        return res.status(404).json("Utilisateur non trouvé.");
      }

      const user = result[0];
      return res.status(200).json(user);
    });
  });
};

//enregister un nouvelle employé
export const register = async (req, res, next) => { 
    // validation du password, 8 caractères et un chiffre au minimum, on utilise Dompurify pour echapper toutes balises ou scripts malveillants
    const password = DOMPurify.sanitize(req.body.password); 

    if (!password || !/^(?=.*[A-Za-zÀ-ÿ])(?=.*\d)(?=.*[@$!%*?&])[A-Za-zÀ-ÿ\d@$!%*?&]{8,}$/.test(password)) {
        return res.status(400).json({
          error: 'Le mot de passe doit contenir au moins 8 caractères, y compris au moins une lettre, un chiffre et un caractère @, $, !, %, *, ?, ou &.',
        });
      }

    // création utilisateurs
    const q = "SELECT * FROM users WHERE email = ? OR username = ?";
    db.query(q, [DOMPurify.sanitize(req.body.email), DOMPurify.sanitize(req.body.username), DOMPurify.sanitize(req.body.img)], (err, data) => {
        if (err) {
            return res.status(500).json(err); 
        }
        if (data.length > 0) {
            // 409 = données déja existantes (conflit)
            return res.status(409).json("Données incorrectes"); 
        }
        //hashage du mot de passe et creation de l'utilisateur
        const salt = bcryptjs.genSaltSync(10);
        const hash = bcryptjs.hashSync(req.body.password, salt);

        //envoi des données dans la base de données
        const q = "INSERT INTO users (username, email, img, password) VALUES (?, ?, ?, ?)";
        const values = [
            DOMPurify.sanitize(req.body.username),
            DOMPurify.sanitize(req.body.email),
            DOMPurify.sanitize(req.body.img),
            DOMPurify.sanitize(hash)
        ]

        db.query(q, values, (err, data) => {
            if (err) {
                return res.status(500).json(err); 
            }
            return res.status(200).json("L'utilisateur a bien été créé"); 
        });
    });
};

//formulaire de connexion
export const login = async (req, res, next) => { 
  const { email, password } = req.body;

  //verification du regex password
  if (!/^(?=.*[A-Za-zÀ-ÿ])(?=.*\d)(?=.*[@$!%*?&])[A-Za-zÀ-ÿ\d@$!%*?&]{8,}$/.test(password)) {
    return res.status(400).json('Le format du mot de passe ne correspond pas.');
  }

  //verification du regex email
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json('Veuillez fournir une adresse e-mail valide.');
  }
  // si l'utilisateur existe
  const q = "SELECT * FROM users WHERE email = ?";

  const userData = await new Promise((resolve, reject) => {
    db.query(q, [DOMPurify.sanitize(email)], (err, data) => {
      if (err) return reject(err);
      resolve(data);
    });
  });

  if (userData.length === 0) {
    return res.status(401).json("Donnée incorrecte!");
  }
  
  db.query(q, [DOMPurify.sanitize(req.body.email)], (err, data) => {
      if (err) return res.json(err);
      if (data.length === 0) {
          return res.status(401).json("Donnée incorrecte!");
      }
      
      // si le mot de passe est correct
      const isPasswordValid = bcryptjs.compareSync(
          DOMPurify.sanitize(req.body.password), 
          data[0].password
      );
      
      if (!isPasswordValid)
      return res.status(400).json("Email ou mot de passe incorrect");
      

      // Création du token    
      const token = jwt.sign({ id: data[0].id }, process.env.JWT_SECRET);
      //separer le mot de passe de data
      
      const { password, ...other } = data[0];

      
      res.cookie("access_token", token, {
          httpOnly: true,
          secure: 'auto',
          sameSite: "none",
          maxAge: 14 * 24 * 60 * 60 * 1000,
          }).status(200).json(other);
  });
};

//déconnexion
export const logout = async (req, res, next) => { 
  res.clearCookie("access_token",
   {
      httpOnly: true,
      sameSite: "none",
      secure: "auto",

  }).status(200).json("Vous êtes déconnecté");
};

//récupération des utilisateurs
export const getUsers =  (req, res, next) => {
    const token = req.cookies.access_token;
    if (!token) return res.status(401).json("Vous devez être connecté pour supprimer un utilisteur.");
  
    jwt.verify(token, process.env.JWT_SECRET, (err) => {
      if (err) return res.status(403).json("Vous n'êtes pas autorisé à supprimer cet utilisteur.");
    const q = 'SELECT id, username, email, role, img FROM users';
    db.query(q, (err, result) => {
        if (err) 
        return res.status(500).send(err);
        res.status(200).json(result);
    });
    });
};

 export const getUser =  (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Vous devez être connecté pour supprimer un utilisteur.");

  jwt.verify(token, process.env.JWT_SECRET, (err) => {
    if (err) return res.status(403).json("Vous n'êtes pas autorisé à supprimer cet utilisteur.");
  const q = 'SELECT * FROM users WHERE id = ?';
  db.query (q, [req.params.id], (err, result) => {
      if (err) 
      return res.status(500).send(err);
      res.status(200).json(result);
  });
});
};

cloudinary.config({
  cloud_name: process.env.REACT_APP_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.REACT_APP_CLOUDINARY_KEY,
  api_secret: process.env.REACT_APP_CLOUDINARY_SECRET_KEY,
  secure : true
});

//effacer un utilisateur
export const deleteUser = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Vous devez être connecté pour supprimer une voiture.");

  jwt.verify(token, process.env.JWT_SECRET, (err) => {
    if (err) return res.status(403).json("Vous n'êtes pas autorisé à supprimer cette voiture.");
    
    const userId = req.params.id;
    const q = 'SELECT img FROM users WHERE id = ?';

    db.query(q, [userId], (err, data) => {
      if (err) {
        next(err);
        return;
      }
      
      const user = data[0];
      if (!user) {
        return res.status(404).json("L'utilisateur n'a pas été trouvée.");
      }

      const imageURL = user.img;
      if (!imageURL) {
        // L'utilisateur n'a pas d'image, passer à la suppression de l'utilisateur dans la base de données
        const deleteQuery = 'DELETE FROM users WHERE id = ?';
        db.query(deleteQuery, [userId], (err) => {
          if (err) {
            next(err);
            return;
          }
          return res.status(200).json('L\'utilisateur a été supprimée avec succès.');
        });
        return;
}
      const imagePublicId = imageURL.split('/').pop().split('.')[0];

      // Efface l'image de cloudinary
      cloudinary.uploader.destroy(imagePublicId)
        .then(() => {
          const deleteQuery = 'DELETE FROM users WHERE id = ?';
          db.query(deleteQuery, [userId], (err) => {
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

export const updateUser = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) {
    return res.status(401).json("Vous devez être connecté pour mettre à jour un utilisateur.");
  }

  jwt.verify(token, process.env.JWT_SECRET, (err) => {
    if (err) {
      return res.status(403).json("Vous n'êtes pas autorisé à mettre à jour cet utilisateur.");
    }

    const userId = req.params.id;
    const { username, email, img } = req.body;

    const q = 'UPDATE users SET username = ?, email = ?, img = ? WHERE id = ?';
    const values = [
      DOMPurify.sanitize(username),
      DOMPurify.sanitize(email),
      DOMPurify.sanitize(img),
      userId
    ];

    db.query(q, values, (err) => {
      if (err) {
        return res.status(500).json("Une erreur s'est produite lors de la mise à jour de l'utilisateur.");
      }

      return res.status(200).json("L'utilisateur a été mis à jour avec succès.");
    });
  });
};


export const deleteImage = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Vous devez être connecté pour supprimer une image.");

  jwt.verify(token, process.env.JWT_SECRET, (err) => {
    if (err) return res.status(403).json("Vous n'êtes pas autorisé à supprimer cette image.");
    
    const userId = req.params.id;
    const q = 'SELECT img FROM users WHERE id = ?';

    db.query(q, [userId], (err, data) => {
      if (err) {
        next(err);
        return;
      }
      
      const user = data[0];
      if (!user) {
        return res.status(404).json("L'utilisateur n'a pas été trouvé.");
      }

      const imageURL = user.img;
      if (!imageURL) {
        return res.status(200).json("L'utilisateur n'a pas d'image à supprimer.");
      }


      const imagePublicId = imageURL.split('/').pop().split('.')[0];

      // Efface l'image de Cloudinary
      cloudinary.uploader.destroy(imagePublicId)
        .then(result => {
          console.log(result);
          // Update the user record in the database to remove the image information
          const updateQuery = 'UPDATE users SET img = NULL WHERE id = ?';
          db.query(updateQuery, [userId], (err) => {
            if (err) {
              next(err);
              return;
            }
            res.status(200).json("L'image a été supprimée avec succès.");
          });
        })
        .catch(error => {
          console.error('Erreur lors de la suppression de l\'image sur Cloudinary:', error);
          res.status(500).json('Une erreur s\'est produite lors de la suppression de l\'image.');
        });
    });
  });
};