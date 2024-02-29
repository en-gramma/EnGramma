import {db} from '../db.js';
import jwt from 'jsonwebtoken';
import DOMPurify from 'isomorphic-dompurify'
import dotenv from 'dotenv';
import xss from 'xss';

dotenv.config();

//récupération des albums
export const getAlbums =  (req, res, next) => {
    const q = 'SELECT * FROM albums';
    db.query(q, (err, result) => {
        if (err) 
        return res.status(500).send(err);
        res.status(200).json(result);
    });
};

// récupération d'un album par son id
export const getAlbum =  (req, res, next) => {
    const q = 'SELECT * FROM albums WHERE id = ?';
    db.query (q, [req.params.id], (err, result) => {
        if (err) 
        return res.status(500).send(err);
        res.status(200).json(result);
    });
};

//effacer un album par son id avec comparaison du token
export const deleteAlbum = (req, res, next) => {
    const token = req.cookies.access_token;
    if (!token) return res.status(401).json("Vous devez être connecté pour supprimer un album.");
  
    jwt.verify(token, process.env.JWT_SECRET, (err) => {
        if (err) return res.status(403).json("Vous n'êtes pas autorisé à supprimer cet album.");

        const albumId = req.params.id;

        const deleteQuery = 'DELETE FROM albums WHERE id = ?';
        db.query(deleteQuery, [albumId], (err) => {
            if (err) {
                next(err);
                return;
            }
            return res.status(200).json('L\'album a été supprimée avec succès.');
        });
    });
};

// ajouter un album
export const addAlbum= (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Pas de token trouvé.");

  jwt.verify(token, process.env.JWT_SECRET, (err) => {
    if (err) {
      next(err);
      return;
    }

    const frenchTitleRegex = /^[a-zA-Z0-9àâäéèêëïîôöùûüçÀÂÄÉÈÊËÏÎÔÖÙÛÜÇ' -]+$/;
    const descriptionRegex = /^[\w\W\s]*$/;
  
    // Validation regex
    if (!frenchTitleRegex.test(req.body.title)) {
      return res.status(400).json({ error: 'Erreur : Le titre contient des caractères non valides' });
    }
    if (!descriptionRegex.test(req.body.description)) {
      return res.status(400).json({ error: 'Erreur : La description contient des caractères non valides.' });
    }
    if (!descriptionRegex.test(req.body.descriptionEn)) {
      return res.status(400).json({ error: 'Erreur : La description en anglais contient des caractères non valides.' });
    }

    const q =
      "INSERT INTO albums (`title`, `bandcamp`, `description`, `descriptionEn`, `albumLink`) VALUES (?)";
      
      //Création d'une whitelist Bandcamp pour les iframes
      let options = {
        whiteList: {
          iframe: ['src', 'style'],
          a: ['href']
        },
        onIgnoreTagAttr: function (tag, name, value, isWhiteAttr) {
          if (tag === 'iframe' && name === 'src') {
            if (!value.startsWith('https://') || !value.includes('.bandcamp.com')) {
              return '';
            }
          }
          if (name === 'style') {
            return `${name}="${xss.escapeAttrValue(value)}"`;
          }
        }
      };

    const values = [
      DOMPurify.sanitize(req.body.title),
      xss(req.body.bandcamp, options),
      DOMPurify.sanitize(req.body.description),
      DOMPurify.sanitize(req.body.descriptionEn),
      DOMPurify.sanitize(req.body.albumLink, { ADD_TAGS: ["a"], ADD_ATTR: ["href"] }),
    ];

    db.query(q, [values], (err, data) => {
      if (err) {
        next(err);
        return;
      }
      return res.json("L'album' a été ajoutée avec succès.");
    });
  });
};

//mise à jour d'un album
export const updateAlbum = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Pas de token trouvé.");

  jwt.verify(token, process.env.JWT_SECRET, (err) => {
    if (err) {
      next(err);
      return;
    }

    const frenchTitleRegex = /^[a-zA-Z0-9àâäéèêëïîôöùûüçÀÂÄÉÈÊËÏÎÔÖÙÛÜÇ' -]+$/;
    const descriptionRegex = /^[\w\W\s]*$/;
  
    // Validation regex
    if (!frenchTitleRegex.test(req.body.title)) {
      return res.status(400).json({ error: 'Erreur : Le titre contient des caractères non valides' });
    }
    if (!descriptionRegex.test(req.body.description)) {
      return res.status(400).json({ error: 'Erreur : La description contient des caractères non valides.' });
    }
    if (!descriptionRegex.test(req.body.descriptionEn)) {
      return res.status(400).json({ error: 'Erreur : La description en anglais contient des caractères non valides.' });
    }

    const q =
      "UPDATE albums SET `title` = ?, `bandcamp` = ?, `description` = ?, `descriptionEn` = ?, `albumLink` = ? WHERE `id` = ?";

      //Création d'une whitelist Bandcamp pour les iframes
      let options = {
        whiteList: {
          iframe: ['src', 'style'],
          a: ['href']
        },
        onIgnoreTagAttr: function (tag, name, value, isWhiteAttr) {
          if (tag === 'iframe' && name === 'src') {
            if (!value.startsWith('https://') || !value.includes('.bandcamp.com')) {
              return '';
            }
          }
          if (name === 'style') {
            return `${name}="${xss.escapeAttrValue(value)}"`;
          }
        }
      };

    const values = [
      DOMPurify.sanitize(req.body.title),
      xss(req.body.bandcamp, options),
      DOMPurify.sanitize(req.body.description),
      DOMPurify.sanitize(req.body.descriptionEn),
      DOMPurify.sanitize(req.body.albumLink, { ADD_TAGS: ["a"], ADD_ATTR: ["href"] }),
      req.params.id,
    ];

    db.query(q, values, (err, data) => {
      if (err) {
       console.log(err);
        return;
      }
      return res.json("L'album a été mis à jour avec succès.");
    });
  });
};