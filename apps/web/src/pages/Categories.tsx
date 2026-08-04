import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, type Category } from '../lib/api';

const icons: Record<string, string> = {
  'ia-machine-learning': '🤖',
  'edtech': '🎓',
  'salud-bienestar': '💚',
  'fintech': '💳',
  'medio-ambiente': '🌱',
  'productividad': '⚡',
  'social-impacto': '🤝',
  'videojuegos': '🎮',
  'herramientas-dev': '🛠',
};

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  useEffect(() => { api.listCategories().then(setCategories).catch(() => {}); }, []);
  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="text-3xl font-extrabold text-slate-900">Categorías</h1>
      <p className="mt-2 text-sm text-slate-500">Explora proyectos por temática.</p>
      {categories.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500">Aún no hay categorías.</div>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c) => (
            <Link key={c.id} to={`/?category=${c.slug}`} className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-card transition-shadow hover:shadow-card-hover">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-2xl">{icons[c.slug] ?? '🏷'}</div>
              <div className="flex-1">
                <p className="font-bold text-slate-900">{c.name}</p>
                <p className="text-xs text-slate-500">{c._count?.products ?? 0} proyectos</p>
              </div>
              <span className="text-slate-400">→</span>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
