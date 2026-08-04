import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ProductRow from '../components/ProductRow';
import { api, type UserProfile } from '../lib/api';

export default function Profile() {
  const { username } = useParams<{ username: string }>();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!username) return;
    const base = (import.meta.env.VITE_API_BASE_URL as string) || '/api/v1';
    fetch(`${base}/users/${username}`, { credentials: 'include' })
      .then((r) => { if (!r.ok) throw new Error('not found'); return r.json(); })
      .then(setProfile)
      .catch(() => setError('Usuario no encontrado'));
  }, [username]);

  const initials = (profile?.username ?? '?').slice(0, 2).toUpperCase();

  return (
    <section className="mx-auto max-w-5xl px-4 py-10">
      {error ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-card">
          <h1 className="text-2xl font-extrabold text-slate-900">{error}</h1>
          <Link to="/" className="btn-primary mt-6">Volver</Link>
        </div>
      ) : !profile ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-500">Cargando…</div>
      ) : (
        <div className="space-y-8">
          <header className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
            <div className="flex flex-wrap items-center gap-5">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-purple-400 to-purple-600 text-2xl font-extrabold text-white">
                {profile.avatarUrl ? <img src={profile.avatarUrl} className="h-full w-full rounded-full object-cover" /> : initials}
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-extrabold text-slate-900">@{profile.username}</h1>
                {profile.bio && <p className="mt-1 text-slate-600">{profile.bio}</p>}
                {profile.institution && <p className="mt-1 text-sm text-slate-500">🎓 {profile.institution}</p>}
                <p className="mt-1 text-xs text-slate-400">Se unió en {new Date(profile.createdAt).toLocaleDateString('es')}</p>
              </div>
            </div>
          </header>

          <section>
            <h2 className="mb-4 text-lg font-bold text-slate-900">Proyectos publicados ({profile.products?.length ?? 0})</h2>
            {profile.products?.length ? (
              <div className="space-y-3">
                {profile.products.map((p: any) => (
                  <ProductRow
                    key={p.id}
                    product={{
                      ...p,
                      hunter: { id: profile.id, username: profile.username, avatarUrl: profile.avatarUrl },
                      category: null,
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">Aún no ha publicado proyectos.</div>
            )}
          </section>
        </div>
      )}
    </section>
  );
}
