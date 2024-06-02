import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import fr from "./fr/fr.json";
import en from "./en/en.json";
const resources = {
  en: { translation: en },
  fr: { translation: fr },
};
i18next
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    debug: true,
    compatibilityJSON: "v3", //To make it work for Android devices, add this line.
    resources,
    lng: "fr", // default language to use.
    // if you're using a language detector, do not define the lng option
    interpolation: {
      escapeValue: false,
    },
  });

export default i18next;
