import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translations: {
          welcome: "Welcome to React and react-i18next",
          // Add more English translations here
        }
      },
      fr: {
        translations: {
          welcome: "Bienvenue à React et react-i18next",
          // Add more French translations here
        }
      }
    },
    lng: "en",
    fallbackLng: "en",
    ns: ["translations"],
    defaultNS: "translations",
    keySeparator: false,
    interpolation: {
      escapeValue: false,
      formatSeparator: ","
    },
    react: {
      wait: true
    }
  });

export default i18n;