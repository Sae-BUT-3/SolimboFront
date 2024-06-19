import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import fr from "./fr/fr.json";
import en from "./en/en.json";
const resources = {
  en: { translation: en },
  fr: { translation: fr },
};
console.log(i18next.language);
i18next
  .use(LanguageDetector)
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    whitelist: ["fr", "en"],
    debug: true,
    compatibilityJSON: "v3", //To make it work for Android devices, add this line.
    resources,
    detection: {
      order: [
        "querystring",
        "cookie",
        "localStorage",
        "navigator",
        "htmlTag",
        "path",
        "subdomain",
      ],
      caches: ["localStorage", "cookie"], // Where to store the detected language
      lookupQuerystring: "lng",
      lookupCookie: "i18next",
      lookupLocalStorage: "i18nextLng",
      lookupFromPathIndex: 0,
      lookupFromSubdomainIndex: 0,
      checkWhitelist: true,
    },
  });

export default i18next;
