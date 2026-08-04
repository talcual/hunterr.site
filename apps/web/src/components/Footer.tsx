import { Link } from 'react-router-dom';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-16 bg-ink-900 text-slate-300">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-5">
        <div className="md:col-span-2">
          <Link to="/" className="flex items-center gap-2 text-white">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-purple-700 text-white">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/>
                <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/>
              </svg>
            </span>
            <span className="text-lg font-extrabold tracking-tight">hunterrd<span className="text-purple-400">.</span></span>
          </Link>
          <p className="mt-3 max-w-xs text-sm text-slate-400">La plataforma donde los proyectos de aula se convierten en oportunidades reales.</p>
          <div className="mt-5 flex gap-3 text-slate-400">
            <a href="#" aria-label="X" className="hover:text-white">𝕏</a>
            <a href="#" aria-label="GitHub" className="hover:text-white">GitHub</a>
            <a href="#" aria-label="LinkedIn" className="hover:text-white">in</a>
            <a href="#" aria-label="Instagram" className="hover:text-white">◎</a>
          </div>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold text-white">Explorar</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:text-white">Proyectos</Link></li>
            <li><Link to="/categories" className="hover:text-white">Categorías</Link></li>
            <li><a href="/#rankings" className="hover:text-white">Rankings</a></li>
            <li><Link to="/about" className="hover:text-white">Comunidad</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold text-white">Para estudiantes</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/submit" className="hover:text-white">Publicar proyecto</Link></li>
            <li><a href="/" className="hover:text-white">Guía de uso</a></li>
            <li><a href="/" className="hover:text-white">Recursos</a></li>
            <li><a href="/" className="hover:text-white">Eventos</a></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold text-white">Suscríbete</h4>
          <p className="mb-3 text-sm text-slate-400">Recibe lo mejor de la innovación estudiantil.</p>
          <form className="flex items-center gap-2 rounded-lg border border-slate-700 bg-ink-800 p-1" onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="Tu email" className="flex-1 bg-transparent px-2 py-1.5 text-sm text-white placeholder:text-slate-500 outline-none" />
            <button type="submit" className="rounded-md bg-purple-500 px-3 py-1.5 text-sm font-semibold text-white hover:bg-purple-600">→</button>
          </form>
        </div>
      </div>
      <div className="border-t border-slate-800">
        <p className="mx-auto max-w-7xl px-4 py-4 text-center text-xs text-slate-500">© {year} hunterrd. Hecho con 💜 para la comunidad estudiantil.</p>
      </div>
    </footer>
  );
}
