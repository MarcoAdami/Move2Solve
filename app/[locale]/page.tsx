// app/[locale]/page.tsx

import EquationGame from '../components/EquationGame';
import I18nProvider from '../components/i18n-provider'; // Nota: l'import è cambiato

export default function HomePage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  return (
    <I18nProvider locale={locale}>
      <main>
        <EquationGame />
      </main>
    </I18nProvider>
  );
}