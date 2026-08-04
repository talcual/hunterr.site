import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ApiError, api } from '../lib/api';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { refresh } = useAuth();
  const [params] = useSearchParams();
  const next = params.get('next') ?? '/';
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      await api.login({ email, password });
      await refresh();
      navigate(next.startsWith('/') ? next : '/');
    } catch (e: any) {
      setError(e instanceof ApiError ? e.message : 'Error al iniciar sesión');
    } finally { setBusy(false); }
  };

  return (
    <div className="mx-auto max-w-md py-16">
      <h1 className="text-center text-3xl font-extrabold text-slate-900">Iniciar sesión</h1>
      <p className="mt-2 text-center text-sm text-slate-500">Bienvenido de vuelta a hunterrd.</p>
      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
        {error && <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="label" htmlFor="email">Email</label>
            <input className="input" id="email" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="label" htmlFor="password">Contraseña</label>
            <input className="input" id="password" type="password" required minLength={8} autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <button type="submit" className="btn-primary w-full" disabled={busy}>{busy ? 'Entrando…' : 'Entrar'}</button>
        </form>
      </div>
      <p className="mt-6 text-center text-sm text-slate-500">
        ¿Sin cuenta? <Link to="/register" className="font-semibold text-purple-600 hover:underline">Crear cuenta</Link>
      </p>
    </div>
  );
}
