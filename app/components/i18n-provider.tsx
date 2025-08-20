// app/components/i18n-provider.tsx
'use client';

import { I18nextProvider } from 'react-i18next';
import { createInstance } from 'i18next';
import { initReactI18next } from 'react-i18next/initReactI18next';
import resourcesToBackend from 'i18next-resources-to-backend';

// Crea l'istanza di i18next una volta sola
const i18n = createInstance();

export default function I18nProvider({
  children,
  locale,
}: {
  children: React.ReactNode;
  locale: string;
}) {
  // Configura i18next con la lingua corretta quando il componente viene montato
  if (!i18n.isInitialized) {
    i18n
      .use(initReactI18next)
      .use(
        resourcesToBackend((lng, ns, callback) => {
          import(`../../public/locales/${lng}/${ns}.json`)
            .then((resources) => callback(null, resources))
            .catch((error) => callback(error, null));
        })
      )
      .init({
        lng: locale, // Usa il locale passato dalla pagina
        fallbackLng: 'en',
        ns: ['common'],
        debug: false,
      });
  }

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}