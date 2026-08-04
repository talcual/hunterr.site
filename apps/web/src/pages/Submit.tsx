import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ApiError, api, type Category } from '../lib/api';
import { useAuth } from '../context/AuthContext';

export default function Submit() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [techStack, setTechStack] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => { if (!loading && !user) navigate('/login?next=/submit'); }, [loading, user, navigate]);
  useEffect(() => { api.listCategories().then(setCategories).catch(() => {}); }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const techs = techStack.split(',').map((s) => s.trim()).filter(Boolean);
      const product = await api.createProduct({
        name, tagline,
        description: description || undefined,
        url: url || undefined,
        logoUrl: logoUrl || undefined,
        techStack: techs.length ? techs : undefined,
        categoryId: categoryId || undefined,
      });
      navigate(`/products/${product.id}`);
    } catch (e: any) {
      setError(e instanceof ApiError ? e.message : 'Error al publicar');
    } finally { setBusy(false); }
  };

  if (loading || !user) return null;

  return (
    <div className="mx-auto max-w-2xl py-12">
      <h1 className="text-3xl font-extrabold text-slate-900">Publicar un proyecto</h1>
      <p className="mt-2 text-sm text-slate-500">Compártelo con miles de estudiantes y curiosos.</p>
      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
        {error && <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="label" htmlFor="name">Nombre del proyecto</label>
            <input className="input" id="name" required minLength={2} maxLength={80} value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label className="label" htmlFor="tagline">Tagline</label>
            <input className="input" id="tagline" required minLength={10} maxLength={140} placeholder="Una frase que lo explique" value={tagline} onChange={(e) => setTagline(e.target.value)} />
          </div>
          <div>
            <label className="label" htmlFor="description">Descripción</label>
            <textarea className="input" id="description" rows={6} maxLength={8000} value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="label" htmlFor="url">URL del proyecto</label>
              <input className="input" id="url" type="url" placeholder="https://" value={url} onChange={(e) => setUrl(e.target.value)} />
            </div>
            <div>
              <label className="label" htmlFor="logoUrl">Logo URL</label>
              <input className="input" id="logoUrl" type="url" placeholder="https://" value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)} />
            </div>
          </div>
          <div>
            <label className="label" htmlFor="tech">Tecnologías (separadas por coma)</label>
            <input className="input" id="tech" placeholder="React, Node.js, IA" value={techStack} onChange={(e) => setTechStack(e.target.value)} />
          </div>
          <div>
            <label className="label" htmlFor="categoryId">Categoría</label>
            <select className="input" id="categoryId" value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
              <option value="">— Sin categoría —</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Link to="/" className="btn-ghost">Cancelar</Link>
            <button type="submit" className="btn-primary" disabled={busy}>{busy ? 'Publicando…' : 'Publicar proyecto'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
