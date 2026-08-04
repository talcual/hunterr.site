import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ApiError, api, type ProductDetail } from '../lib/api';
import { useAuth } from '../context/AuthContext';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [votes, setVotes] = useState(0);
  const [voted, setVoted] = useState(false);
  const [comment, setComment] = useState('');
  const [commentError, setCommentError] = useState<string | null>(null);

  const load = () => {
    if (!id) return;
    api.getProduct(id).then((p) => { setProduct(p); setVotes(p._count.votes); }).catch((e) => setError(e?.message ?? 'No encontrado'));
  };

  useEffect(load, [id]);

  const handleVote = async () => {
    if (!user) { navigate('/login?next=' + encodeURIComponent(window.location.pathname)); return; }
    try {
      const res = await api.toggleVote(product!.id);
      setVoted(res.voted);
      setVotes((v) => v + (res.voted ? 1 : -1));
    } catch { alert('No se pudo votar'); }
  };

  const submitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { navigate('/login?next=' + encodeURIComponent(window.location.pathname)); return; }
    setCommentError(null);
    try {
      const c = await api.createComment(product!.id, comment);
      setProduct((p) => p ? { ...p, comments: [c, ...p.comments] } : p);
      setComment('');
    } catch (e: any) {
      setCommentError(e instanceof ApiError ? e.message : 'Error al comentar');
    }
  };

  if (error) {
    return (
      <div className="mx-auto max-w-md py-20 text-center">
        <h1 className="text-2xl font-extrabold text-slate-900">Proyecto no encontrado</h1>
        <p className="mt-2 text-sm text-slate-500">{error}</p>
        <Link to="/" className="btn-primary mt-6">Volver al inicio</Link>
      </div>
    );
  }
  if (!product) return <div className="mx-auto max-w-5xl px-4 py-10 text-slate-500">Cargando…</div>;

  const initials = product.name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase();

  return (
    <article className="mx-auto max-w-5xl px-4 py-10">
      <header className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card md:p-8">
        <div className="flex flex-wrap items-start gap-5">
          <div className="flex flex-col items-center gap-1 w-14 shrink-0">
            <button onClick={handleVote} className={`flex h-14 w-14 items-center justify-center rounded-xl border transition-colors ${voted ? 'border-purple-400 bg-purple-50 text-purple-500' : 'border-slate-200 bg-slate-50 text-slate-500 hover:border-purple-400 hover:text-purple-500'}`} aria-label="Votar">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6"/></svg>
            </button>
            <span className="text-base font-bold text-slate-700">{votes}</span>
          </div>

          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-purple-700 text-2xl font-extrabold text-white">
            {product.logoUrl ? <img src={product.logoUrl} className="h-full w-full rounded-2xl object-cover" /> : initials}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-extrabold text-slate-900 md:text-3xl">{product.name}</h1>
              {product.category && <span className="rounded-full px-2.5 py-1 text-xs font-medium" style={{ backgroundColor: `${product.category.color}1a`, color: product.category.color }}>{product.category.name}</span>}
            </div>
            <p className="mt-2 text-base text-slate-700">{product.tagline}</p>
            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-slate-500">
              <span className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-purple-100 text-[11px] font-bold text-purple-700">{product.hunter.username.slice(0, 2).toUpperCase()}</span>
                <Link to={`/u/${product.hunter.username}`} className="hover:text-purple-600">@{product.hunter.username}</Link>
              </span>
              <span>·</span>
              <span>{new Date(product.createdAt).toLocaleDateString('es')}</span>
              {product.url && (<><span>·</span><a href={product.url} target="_blank" rel="noopener noreferrer" className="font-medium text-purple-600 hover:underline">Visitar sitio ↗</a></>)}
            </div>
            {product.techStack && product.techStack.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {product.techStack.map((t) => <span key={t} className="chip">{t}</span>)}
              </div>
            )}
          </div>
        </div>
      </header>

      {product.description && (
        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
          <h2 className="text-lg font-bold text-slate-900">Acerca de</h2>
          <p className="mt-2 whitespace-pre-wrap text-slate-700">{product.description}</p>
        </section>
      )}

      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
        <h2 className="mb-4 text-lg font-bold text-slate-900">Comentarios ({product.comments.length})</h2>
        {commentError && <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{commentError}</div>}
        {user ? (
          <form onSubmit={submitComment} className="mb-6 space-y-2">
            <textarea className="input" required minLength={1} maxLength={2000} rows={3} placeholder="¿Qué opinas de este proyecto?" value={comment} onChange={(e) => setComment(e.target.value)} />
            <div className="flex justify-end">
              <button type="submit" className="btn-primary">Comentar</button>
            </div>
          </form>
        ) : (
          <div className="mb-6 rounded-lg bg-slate-50 p-4 text-sm text-slate-600">
            <Link to={`/login?next=/products/${product.id}`} className="font-semibold text-purple-600 hover:underline">Inicia sesión</Link> para comentar.
          </div>
        )}
        <ul className="space-y-5">
          {product.comments.length === 0 ? (
            <li className="text-sm text-slate-500">Sé el primero en comentar.</li>
          ) : product.comments.map((c) => (
            <li key={c.id} className="flex gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-purple-100 text-xs font-bold text-purple-700">{c.user.username.slice(0, 2).toUpperCase()}</span>
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline gap-2 text-sm">
                  <Link to={`/u/${c.user.username}`} className="font-semibold text-slate-900 hover:text-purple-600">@{c.user.username}</Link>
                  <span className="text-xs text-slate-400">{new Date(c.createdAt).toLocaleString('es')}</span>
                </div>
                <p className="mt-1 whitespace-pre-wrap text-sm text-slate-700">{c.body}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}
