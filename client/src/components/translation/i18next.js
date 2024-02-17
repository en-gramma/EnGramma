import { initReactI18next } from "react-i18next";
import axios from 'axios';
import en from "./en.json";
import fr from "./fr.json";
import i18n from "i18next";

// Récupération des données de la base de données
const apiUrl = process.env.REACT_APP_API_URL;

const initializeI18n = axios.get(`${apiUrl}/api/bios`)
  .then(response => {
    const dbTranslationsFr = response.data.reduce((translations, row) => {
      translations[row.title] = row.text;
      translations[row.title + 'Title'] = row.title; 
      return translations;
    }, {});

    const dbTranslationsEn = response.data.reduce((translations, row) => {
      translations[row.title] = row.textEn;
      translations[row.title + 'Title'] = row.titleEn;
      return translations;
    }, {});

    // Initialize i18next with the database data
    return i18n
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

export default initializeI18n;