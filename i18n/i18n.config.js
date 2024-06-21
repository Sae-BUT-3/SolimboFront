import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { Platform } from 'react-native';
import fr from "./fr/fr.json";
import en from "./en/en.json";
const resources = {
  en: { translation: en },
  fr: { translation: fr },
};

const languageDetectorWeb = {
  type: 'languageDetector',
  init: () => {},
  detect: () => {
    // Example detection using navigator object (web)
    return navigator.language || navigator.userLanguage || 'en';
  },
  cacheUserLanguage: () => {},
};
const languageDetectorNative = {
  type: 'languageDetector',
  async: true,
  detect: (callback) => {
    import('react-native-localize').then(RNLocalize => {
      const locales = RNLocalize.getLocales();
      if (locales.length > 0) {
        callback(locales[0].languageTag);
      } else {
        callback('en'); // Default to English if no locale detected
      }
    });
  },
  init: () => {},
  cacheUserLanguage: () => {},
};

const languageDetector = Platform.OS === 'web' ? languageDetectorWeb : languageDetectorNative;
i18next
  .use(languageDetector)
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    whitelist: ["fr", "en"],
    debug: true,
    compatibilityJSON: "v3", //To make it work for Android devices, add this line.
    fallbackLng: "en",
    resources,
    interpolation: {
      escapeValue: false,
    },
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

// i18next.use(initReactI18next).init({
//   compatibilityJSON: 'v3',
//   fallbackLng: 'en',
//   resources,
// });

export default i18next;
