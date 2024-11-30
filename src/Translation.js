import I18n from 'react-native-i18n';
import en from './en.json';
import hi from './hi.json';

// Load translations
I18n.translations = {
hi,
  en,
};

// Allow fallback to default language if the key is missing in the selected language
I18n.fallbacks = true;

export default I18n;
