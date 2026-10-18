import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import en from "./locales/en/translation.json";
import ml from "./locales/ml/translation.json";
import { getStoreI18nResources } from "@shared/store.config";

// Store/brand strings are owned by `Server/shared/store.config.js` and merged
// into each locale under the `store` namespace (e.g. `t("store.emailSupport")`).
const resources = {
  en: {
    translation: { ...en, store: getStoreI18nResources("en") },
  },
  ml: {
    translation: { ...ml, store: getStoreI18nResources("ml") },
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    supportedLngs: ["en", "ml"],
    detection: {
      order: ["localStorage", "cookie", "navigator", "htmlTag"],
      lookupLocalStorage: "i18nextLng",
      caches: ["localStorage"],
    },
    interpolation: {
      escapeValue: false, // React already escapes by default
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n;
