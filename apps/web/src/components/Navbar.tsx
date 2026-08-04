import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';

export default function Navbar() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const link = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium transition-colors ${isActive ? 'text-ink-900' : 'text-slate-600 hover:text-ink-900'}`;

  const handleLogout = async () => {
    try { await api.logout(); } catch {}
    setUser(null);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-6 px-4 py-3">
        <Link to="/" className="flex items-center gap-2 text-slate-900">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-purple-700 text-white shadow-sm">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/>
              <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/>
              <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/>
              <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>
            </svg>
          </span>
          <span className="text-lg font-extrabold tracking-tight">hunterrd<span className="text-purple-500">.</span></span>
        </Link>

        <nav className="hidden gap-6 md:flex">
          <NavLink to="/" end className={({ isActive }) => `${link({ isActive })} flex items-center gap-1`}>
            Descubrir
            <span className="h-1 w-1 rounded-full bg-purple-500"></span>
          </NavLink>
          <a href="/#top" className={link({ isActive: false })}>Proyectos</a>
          <a href="/#rankings" className={link({ isActive: false })}>Rankings</a>
          <NavLink to="/about" className={link}>Sobre</NavLink>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          {user ? (
            <>
              <Link to="/submit" className="btn-outline hidden sm:inline-flex">Publicar proyecto</Link>
              <Link to={`/u/${user.username}`} className="flex h-9 w-9 items-center justify-center rounded-full bg-purple-100 text-sm font-bold text-purple-700">
                {user.username.slice(0, 2).toUpperCase()}
              </Link>
              <button onClick={handleLogout} className="btn-ghost">Salir</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-outline hidden sm:inline-flex">Iniciar sesión</Link>
              <Link to="/register" className="btn-primary">Publicar proyecto <span className="opacity-70">+</span></Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
