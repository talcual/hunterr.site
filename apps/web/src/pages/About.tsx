import StepCard from '../components/StepCard';

const steps = [
  { icon: 'upload' as const, title: 'Publica tu proyecto', description: 'Comparte tu idea, demo, capturas y tecnologías usadas.' },
  { icon: 'vote' as const, title: 'Recibe votos y feedback', description: 'La comunidad descubre, prueba y apoya tus proyectos.' },
  { icon: 'trophy' as const, title: 'Gana visibilidad', description: 'Haz que tu talento llegue a empresas, inversionistas y al mundo.' },
];

export default function About() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-extrabold text-slate-900 md:text-4xl">Sobre hunterrd</h1>
      <p className="mt-3 text-lg text-slate-600">
        hunterrd es la vitrina donde el talento estudiantil se hace visible. Publica tus proyectos, recibe feedback de la comunidad y conecta con oportunidades reales.
      </p>
      <h2 className="mt-10 text-xl font-bold text-slate-900">Cómo funciona</h2>
      <div className="mt-4 grid gap-4 md:grid-cols-3">
        {steps.map((s, i) => <StepCard key={i} number={i + 1} {...s} />)}
      </div>
      <h2 className="mt-10 text-xl font-bold text-slate-900">Stack técnico</h2>
      <ul className="mt-3 list-inside list-disc text-slate-600">
        <li>API: NestJS 10, Prisma 5, PostgreSQL 14, JWT auth (cookies httpOnly), bcrypt</li>
        <li>Web: React 18, Vite, Tailwind CSS, React Router v6</li>
      </ul>
    </section>
  );
}
