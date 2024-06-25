const deeplLang = {
    fr: "fr",
    en: "en-gb",
    default: "en-gb"
};

const getDeeplLangAttribute = (lang) => {
    return deeplLang[lang] || deeplLang.default;
};

export { getDeeplLangAttribute };