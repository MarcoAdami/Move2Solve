// app/[locale]/page.tsx

import EquationGame from '../components/EquationGame';

export default function HomePage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  return (
      <main>
        <EquationGame />
      </main>
  );
}