(function () {
  'use strict';

  const STORAGE_KEY = 'hotellemon-language';

  const languages = [
    { code: 'en', name: 'English', native: 'English' },
    { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
    { code: 'as', name: 'Assamese', native: 'অসমীয়া' },
    { code: 'bn', name: 'Bengali', native: 'বাংলা' },
    { code: 'brx', name: 'Bodo', native: 'बड़ो' },
    { code: 'doi', name: 'Dogri', native: 'डोगरी' },
    { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી' },
    { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
    { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ' },
    { code: 'ks', name: 'Kashmiri', native: 'कॉशुर' },
    { code: 'kok', name: 'Konkani', native: 'कोंकणी' },
    { code: 'mai', name: 'Maithili', native: 'मैथिली' },
    { code: 'ml', name: 'Malayalam', native: 'മലയാളം' },
    { code: 'mni', name: 'Manipuri', native: 'மেইতেই' },
    { code: 'mr', name: 'Marathi', native: 'मराठी' },
    { code: 'ne', name: 'Nepali', native: 'नेपाली' },
    { code: 'or', name: 'Odia', native: 'ଓଡ଼ିଆ' },
    { code: 'pa', name: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
    { code: 'sa', name: 'Sanskrit', native: 'संस्कृतम्' },
    { code: 'sat', name: 'Santali', native: 'ᱥᱟᱱᱛᱟᱲᱤ' },
    { code: 'sd', name: 'Sindhi', native: 'سنڌي' },
    { code: 'te', name: 'Telugu', native: 'తెలుగు' },
    { code: 'ur', name: 'Urdu', native: 'اردو' }
  ];

  const defaultLanguage = 'en';
  let currentLanguage =
    localStorage.getItem(STORAGE_KEY) || defaultLanguage;

  let currentTranslations = {};
  let englishFallback = {};
  let loading = false;

  function getLanguage(code) {
    return languages.find((language) => language.code === code);
  }

  function populateSelectors() {
    document.querySelectorAll('.language-select').forEach((select) => {
      select.innerHTML = '';

      languages.forEach((language) => {
        const option = document.createElement('option');

        option.value = language.code;
        option.textContent =
          language.native === language.name || language.code === 'en'
            ? language.name
            : `${language.native} (${language.name})`;

        select.appendChild(option);
      });

      select.value = currentLanguage;

      select.addEventListener('change', (event) => {
        setLanguage(event.target.value);
      });
    });
  }

  async function loadTranslations(language) {
    const response = await fetch(`locales/${language}.json`, {
      cache: 'no-cache'
    });

    if (!response.ok) {
      throw new Error(
        `Translation file not found: locales/${language}.json`
      );
    }

    return await response.json();
  }

  function replaceVariables(value, variables = {}) {
    Object.entries(variables).forEach(([key, replacement]) => {
      value = value.replace(
        new RegExp(`\\{${key}\\}`, 'g'),
        String(replacement)
      );
    });

    return value;
  }

  function translate(key, variables = {}) {
    const value =
      currentTranslations[key] ||
      englishFallback[key] ||
      window.I18nEnglish?.[key] ||
      key;

    return replaceVariables(value, variables);
  }

  function applyTranslations() {
    document.documentElement.lang = currentLanguage;

    document.querySelectorAll('[data-i18n]').forEach((element) => {
      element.textContent = translate(element.dataset.i18n);
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach((element) => {
      element.placeholder = translate(
        element.dataset.i18nPlaceholder
      );
    });

    document.querySelectorAll('[data-i18n-title]').forEach((element) => {
      element.title = translate(element.dataset.i18nTitle);
    });

    document.querySelectorAll('.language-select').forEach((select) => {
      select.value = currentLanguage;
    });

    window.dispatchEvent(
      new CustomEvent('languageChanged', {
        detail: {
          language: currentLanguage
        }
      })
    );
  }

  async function setLanguage(language) {
    if (!getLanguage(language)) {
      language = defaultLanguage;
    }

    if (loading) return;

    loading = true;

    try {
      const translations = await loadTranslations(language);

      currentLanguage = language;
      currentTranslations = translations;

      localStorage.setItem(STORAGE_KEY, currentLanguage);

      applyTranslations();
    } catch (error) {
      console.error(error);

      if (language !== defaultLanguage) {
        alert(
          `Translation file for "${language}" is missing.`
        );
      }
    } finally {
      loading = false;
    }
  }

  async function initialize() {
    populateSelectors();

    try {
      englishFallback = await loadTranslations('en');
    } catch (e) {
      console.error('Could not load English fallback', e);
    }

    try {
      currentTranslations = await loadTranslations(currentLanguage);
    } catch (error) {
      console.error(error);

      currentLanguage = defaultLanguage;
      currentTranslations = englishFallback || await loadTranslations(defaultLanguage);
    }

    applyTranslations();
  }

  window.I18n = {
    languages,
    t: translate,
    set: setLanguage,
    getLanguage: () => currentLanguage,
    initialize
  };

  document.addEventListener('DOMContentLoaded', initialize);
})();
