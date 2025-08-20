// utils/i18n.ts
import { createInstance } from 'i18next';
import { initReactI18next } from 'react-i18next';
import resourcesToBackend from 'i18next-resources-to-backend';

const getI18nInstance = async (locale: string) => {
  const i18nInstance = createInstance();
  await i18nInstance
    .use(initReactI18next)
    .use(resourcesToBackend((lng, ns, callback) => {
      import(`../public/locales/${lng}/${ns}.json`)
        .then((resources) => callback(null, resources))
        .catch((error) => callback(error, null));
    }))
    .init({
      lng: locale,
      fallbackLng: 'en',
      ns: ['common'],
      debug: false,
    });

  return i18nInstance;
};

export default getI18nInstance;