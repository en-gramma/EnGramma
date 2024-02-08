import { initReactI18next } from "react-i18next";
import axios from 'axios';
import en from "./en.json";
import fr from "./fr.json";
import i18n from "i18next";

// Récupération des données de la base de données
const apiUrl = process.env.REACT_APP_API_URL;
axios.get(`${apiUrl}/api/bios`)
  .then(response => {
    const dbTranslationsFr = response.data.reduce((translations, row) => {
      translations[row.title] = row.text;
      translations[row.title + 'Title'] = row.title; 
      return translations;
    }, {});

    const dbTranslationsEn = response.data.reduce((translations, row) => {
      translations[row.title] = row.textEn;
      translations[row.title + 'Title'] = row.titleEn;
       //  row.title comme clé et row.textEn comme valeur
      return translations;
    }, {});

    // Initialiser i18next avec les données de la base de données
    i18n
      .use(initReactI18next)
      .init({
        resources: {
          en: { translation: { ...en, ...dbTranslationsEn } }, 
          fr: { translation: { ...fr, ...dbTranslationsFr } } 
        },
        lng: "fr",
        fallbackLng: "fr",
        interpolation: {
          escapeValue: false
        }
      });
  })
  .catch(error => {
    console.error(error);
  });