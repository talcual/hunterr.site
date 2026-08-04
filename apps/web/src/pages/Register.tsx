import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ApiError, api } from '../lib/api';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { refresh } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [institution, setInstitution] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      await api.register({ username, email, password, institution: institution || undefined });
      await refresh();
      navigate('/');
    } catch (e: any) {
      setError(e instanceof ApiError ? e.message : 'Error al crear la cuenta');
    } finally { setBusy(false); }
  };

  return (
    <div className="mx-auto max-w-md py-16">
      <h1 className="text-center text-3xl font-extrabold text-slate-900">Crear cuenta</h1>
      <p className="mt-2 text-center text-sm text-slate-500">Únete a la comunidad de hunterrd.</p>
      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
        {error && <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="label" htmlFor="username">Username</label>
            <input className="input" id="username" required minLength={3} maxLength={32} pattern="[a-zA-Z0-9_]+" value={username} onChange={(e) => setUsername(e.target.value)} />
          </div>
          <div>
            <label className="label" htmlFor="email">Email</label>
            <input className="input" id="email" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="label" htmlFor="institution">Institución (opcional)</label>
            <input className="input" id="institution" value={institution} onChange={(e) => setInstitution(e.target.value)} placeholder="Universidad..." />
          </div>
          <div>
            <label className="label" htmlFor="password">Contraseña</label>
            <input className="input" id="password" type="password" required minLength={8} autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <button type="submit" className="btn-primary w-full" disabled={busy}>{busy ? 'Creando…' : 'Crear cuenta'}</button>
        </form>
      </div>
      <p className="mt-6 text-center text-sm text-slate-500">
        ¿Ya tienes cuenta? <Link to="/login" className="font-semibold text-purple-600 hover:underline">Entrar</Link>
      </p>
    </div>
  );
}
