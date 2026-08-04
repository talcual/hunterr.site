import { Link } from 'react-router-dom';
import { useState } from 'react';
import { api, type ProductListItem } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface Props {
  product: ProductListItem;
  index?: number;
  badge?: string;
  institution?: string;
  techStack?: string[];
  voterCount?: number;
}

const palette = ['#7c5cff', '#22c55e', '#ec4899', '#facc15', '#06b6d4', '#f97316'];

export default function ProductRow({ product, index, badge, institution, techStack = [], voterCount = 0 }: Props) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [votes, setVotes] = useState(product._count.votes);
  const [voted, setVoted] = useState(false);
  const [busy, setBusy] = useState(false);

  const initials = product.name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase();
  const logoBg = palette[product.name.charCodeAt(0) % palette.length];

  const handleVote = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) { navigate('/login?next=' + encodeURIComponent(window.location.pathname)); return; }
    setBusy(true);
    try {
      const res = await api.toggleVote(product.id);
      setVoted(res.voted);
      setVotes((v) => v + (res.voted ? 1 : -1));
    } catch { alert('No se pudo registrar el voto'); } finally { setBusy(false); }
  };

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card transition-shadow hover:shadow-card-hover">
      <div className="flex items-start gap-4">
        <div className="flex flex-col items-center gap-1 w-12 shrink-0">
          <button
            onClick={handleVote}
            disabled={busy}
            className={`flex h-11 w-11 items-center justify-center rounded-lg border transition-colors ${
              voted ? 'border-purple-400 bg-purple-50 text-purple-500' : 'border-slate-200 bg-slate-50 text-slate-400 hover:border-purple-400 hover:text-purple-500'
            }`}
            aria-label="Votar"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6"/></svg>
          </button>
          <span className="text-sm font-bold text-slate-700">{votes}</span>
        </div>

        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-white font-bold" style={{ backgroundColor: logoBg }}>
          {product.logoUrl ? <img src={product.logoUrl} alt={product.name} className="h-full w-full rounded-xl object-cover" /> : initials}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            {typeof index === 'number' && <span className="text-xs font-mono text-slate-400">#{index + 1}</span>}
            <Link to={`/products/${product.id}`} className="text-base font-bold text-slate-900 hover:text-purple-600">{product.name}</Link>
            {badge && <span className="rounded-md bg-amber-100 px-1.5 py-0.5 text-[11px] font-bold text-amber-700">🏆 {badge}</span>}
            {product.category && (
              <span className="rounded-full px-2.5 py-1 text-xs font-medium" style={{ backgroundColor: `${product.category.color}1a`, color: product.category.color }}>
                {product.category.name}
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-slate-600">{product.tagline}</p>
          {techStack.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {techStack.slice(0, 4).map((t) => <span key={t} className="chip">{t}</span>)}
            </div>
          )}

          <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-200 text-[11px] font-bold text-slate-700">
                {product.hunter.username.slice(0, 2).toUpperCase()}
              </span>
              <div className="leading-tight">
                <p className="font-medium text-slate-700">{product.hunter.username}</p>
                {institution && <p className="text-xs text-slate-500">{institution}</p>}
              </div>
            </div>
            <div className="flex items-center gap-3">
              {voterCount > 0 && <span className="text-xs text-slate-500">+{voterCount} voters</span>}
              <span className="flex items-center gap-1 text-slate-500">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                {product._count.comments}
              </span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
