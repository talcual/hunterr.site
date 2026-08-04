import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api, type Category, type ProductListItem } from '../lib/api';
import ProductRow from '../components/ProductRow';
import ProductHeroCard from '../components/ProductHeroCard';
import FeaturedProjectCard from '../components/FeaturedProjectCard';
import StepCard from '../components/StepCard';

const categoryIcons: Record<string, string> = {
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

const steps = [
  { icon: 'upload' as const, title: 'Publica tu proyecto', description: 'Comparte tu idea, demo, capturas y tecnologías usadas.' },
  { icon: 'vote' as const, title: 'Recibe votos y feedback', description: 'La comunidad descubre, prueba y apoya tus proyectos.' },
  { icon: 'trophy' as const, title: 'Gana visibilidad', description: 'Haz que tu talento llegue a empresas, inversionistas y al mundo.' },
];

const sortTabs: Array<{ key: 'new' | 'top' | 'trending'; label: string }> = [
  { key: 'new', label: 'Recientes' },
  { key: 'top', label: 'Más votados' },
  { key: 'trending', label: 'Trending' },
];

export default function Home() {
  const [params, setParams] = useSearchParams();
  const sort = (params.get('sort') as 'new' | 'top' | 'trending' | null) ?? 'new';
  const category = params.get('category') ?? undefined;

  const [items, setItems] = useState<ProductListItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      api.listProducts({ sort, category, limit: 12 }),
      api.listCategories(),
    ])
      .then(([data, cats]) => { setItems(data.items); setCategories(cats); })
      .catch((e) => setError(e?.message ?? 'No se pudo conectar con la API'));
  }, [sort, category]);

  const top3 = items.slice(0, 3);
  const topDay = items.slice(0, 5);
  const featured = items.slice(0, 3);

  return (
    <>
      <section className="relative overflow-hidden bg-ink-900 text-white">
        <div className="absolute inset-0 opacity-30" style={{ background: 'radial-gradient(80% 50% at 20% 0%, rgba(124,92,255,0.5), transparent), radial-gradient(60% 50% at 100% 30%, rgba(236,72,153,0.25), transparent)' }}></div>
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 md:grid-cols-2 md:py-24">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs font-medium text-purple-200">
              🚀 La vitrina de talento estudiantil
            </span>
            <h1 className="mt-5 text-4xl font-extrabold leading-tight tracking-tight md:text-6xl">
              Grandes ideas<br />empiezan en el <span className="text-purple-300">aula</span>.
            </h1>
            <p className="mt-4 max-w-md text-base text-slate-300 md:text-lg">
              Descubre, vota y comparte los mejores proyectos creados por estudiantes de todo el mundo.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="#top" className="btn-primary">Explorar proyectos <span className="opacity-70">→</span></a>
              <Link to="/submit" className="btn-outline border-white/30 bg-white/5 text-white hover:bg-white/10">Publicar mi proyecto</Link>
            </div>
            <div className="mt-10 grid grid-cols-3 gap-6 border-t border-white/10 pt-6 text-sm">
              <div><p className="text-2xl font-extrabold text-white">1.2K</p><p className="text-slate-400">Proyectos publicados</p></div>
              <div><p className="text-2xl font-extrabold text-white">28K</p><p className="text-slate-400">Votos de la comunidad</p></div>
              <div><p className="text-2xl font-extrabold text-white">150+</p><p className="text-slate-400">Instituciones</p></div>
            </div>
          </div>

          <div className="relative h-80 md:h-96">
            {top3.length === 0 ? (
              <div className="flex h-full items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-300">
                <p>{error ? `⚠ ${error}` : 'Aún no hay proyectos destacados.'}</p>
              </div>
            ) : (
              <div className="relative h-full">
                {top3[0] && <div className="absolute left-0 top-0"><ProductHeroCard product={top3[0]} rank={1} rot="rotate-[-3deg]" /></div>}
                {top3[1] && <div className="absolute right-2 top-12"><ProductHeroCard product={top3[1]} rank={2} rot="rotate-[4deg]" /></div>}
                {top3[2] && <div className="absolute bottom-2 left-1/3"><ProductHeroCard product={top3[2]} rank={3} rot="rotate-[-1deg]" /></div>}
              </div>
            )}
          </div>
        </div>
      </section>

      <section id="top" className="mx-auto max-w-7xl px-4 py-14">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="flex items-center gap-2 text-2xl font-extrabold text-slate-900 md:text-3xl">
              <span className="text-2xl">🔥</span> Top del día
            </h2>
            <p className="mt-1 text-sm text-slate-500">Los proyectos más votados por la comunidad</p>
          </div>
          <div className="flex gap-2 text-sm">
            {sortTabs.map((t) => (
              <button
                key={t.key}
                onClick={() => { const p = new URLSearchParams(params); if (t.key === 'new') p.delete('sort'); else p.set('sort', t.key); setParams(p); }}
                className={`rounded-full px-3 py-1 font-medium transition-colors ${sort === t.key ? 'bg-ink-900 font-semibold text-white' : 'text-slate-600 hover:bg-slate-100'}`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
          <div className="space-y-3">
            {topDay.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
                <p className="text-slate-500">{error ?? 'Aún no hay proyectos hoy.'}</p>
                <Link to="/submit" className="btn-primary mt-3">Sé el primero en publicar</Link>
              </div>
            ) : (
              topDay.map((p, i) => <ProductRow key={p.id} product={p} index={i} badge={i === 0 ? '1°' : undefined} />)
            )}
          </div>

          <aside className="space-y-6">
            <div>
              <h3 className="mb-3 text-base font-bold text-slate-900">Categorías</h3>
              <ul className="space-y-1">
                <li>
                  <Link to="/" className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm font-semibold ${!category ? 'bg-purple-50 text-purple-700' : 'text-slate-700 hover:bg-slate-100'}`}>
                    🏷 Todas las categorías
                  </Link>
                </li>
                {categories.map((c) => (
                  <li key={c.id}>
                    <Link to={category === c.slug ? '/' : `/?category=${c.slug}`} className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm ${category === c.slug ? 'bg-purple-50 font-semibold text-purple-700' : 'text-slate-700 hover:bg-slate-100'}`}>
                      <span className="flex items-center gap-2"><span>{categoryIcons[c.slug] ?? '🏷'}</span> {c.name}</span>
                      <span className="text-xs text-slate-400">{c._count?.products ?? 0}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {topDay.length > 0 && (
              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <h3 className="mb-3 text-base font-bold text-slate-900">Top de la semana</h3>
                <ol className="space-y-3">
                  {topDay.slice(0, 5).map((p, i) => (
                    <li key={p.id} className="flex items-center gap-3">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600">{i + 1}</span>
                      <div className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-purple-500 to-purple-700 text-[10px] font-bold text-white">
                        {p.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <Link to={`/products/${p.id}`} className="block truncate text-sm font-semibold text-slate-900 hover:text-purple-600">{p.name}</Link>
                        <p className="text-xs text-slate-500">{(p._count.votes / 1000).toFixed(1)}K votos</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            <div className="rounded-2xl bg-gradient-to-br from-purple-500 to-purple-700 p-6 text-white">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">🚀</div>
              <h3 className="mt-3 text-lg font-extrabold">¿Listo para mostrar tu proyecto?</h3>
              <p className="mt-1 text-sm text-purple-100">Publica tu proyecto, recibe feedback, consigue visibilidad y conecta con oportunidades.</p>
              <Link to="/submit" className="mt-4 inline-block rounded-lg bg-white px-4 py-2 text-sm font-bold text-purple-700 hover:bg-purple-50">Publicar proyecto →</Link>
            </div>
          </aside>
        </div>
      </section>

      <section id="rankings" className="bg-slate-50 py-14">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-6">
            <h2 className="flex items-center gap-2 text-2xl font-extrabold text-slate-900 md:text-3xl">
              <span className="text-2xl">⭐</span> Proyectos destacados
            </h2>
            <p className="mt-1 text-sm text-slate-500">Selección editorial de proyectos innovadores</p>
          </div>
          {featured.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">Aún no hay proyectos destacados.</div>
          ) : (
            <div className="grid gap-5 md:grid-cols-3">
              {featured.map((p, i) => (
                <FeaturedProjectCard key={p.id} product={p} badge={i === 0 ? '⭐ TOP 1' : i === 1 ? '⭐ TOP 2' : '⭐ TOP 3'} categoryLabel={p.category?.name} description={p.tagline} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14">
        <div className="mb-8">
          <h2 className="flex items-center gap-2 text-2xl font-extrabold text-slate-900 md:text-3xl">
            <span className="text-2xl">⚡</span> Cómo funciona
          </h2>
          <p className="mt-1 text-sm text-slate-500">Del aula al mundo en 3 simples pasos</p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {steps.map((s, i) => <StepCard key={i} number={i + 1} {...s} />)}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16">
        <div className="relative overflow-hidden rounded-3xl bg-purple-50 p-8 md:p-12">
          <span className="absolute left-6 top-6 text-6xl font-serif text-purple-300/70">"</span>
          <div className="relative grid items-center gap-8 md:grid-cols-[1fr_auto]">
            <div>
              <p className="text-lg font-medium text-slate-800 md:text-xl">
                "hunterrd me ayudó a que mi proyecto de clase se hiciera viral. Hoy trabajo en una startup gracias a la visibilidad que obtuve."
              </p>
              <div className="mt-5 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-purple-400 to-purple-600 text-sm font-bold text-white">CR</div>
                <div>
                  <p className="font-semibold text-slate-900">Camila Rodríguez</p>
                  <p className="text-sm text-slate-500">Ex estudiante, ahora Product Designer</p>
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="rounded-2xl bg-white p-3 shadow-card">
                <div className="grid h-32 w-56 grid-cols-6 grid-rows-4 gap-1">
                  {Array.from({ length: 24 }).map((_, i) => (
                    <div key={i} className={`rounded-sm ${['bg-purple-200', 'bg-purple-300', 'bg-purple-400', 'bg-purple-500'][i % 4]}`} style={{ opacity: 0.3 + ((i * 13) % 70) / 100 }}></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
