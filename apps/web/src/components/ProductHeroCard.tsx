import type { ProductListItem } from '../lib/api';

const grad = ['from-purple-500 to-purple-700', 'from-emerald-500 to-emerald-700', 'from-sky-500 to-sky-700', 'from-pink-500 to-pink-700', 'from-amber-500 to-amber-700'];

interface Props {
  product: ProductListItem;
  rank: number;
  rot?: string;
}

export default function ProductHeroCard({ product, rank, rot = 'rotate-[-2deg]' }: Props) {
  const initials = product.name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase();
  const g = grad[product.name.charCodeAt(0) % grad.length];
  return (
    <div className={`relative w-72 rounded-2xl bg-white p-4 shadow-card-hover ${rot}`}>
      <div className="flex items-start gap-3">
        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${g} text-white font-bold`}>
          {product.logoUrl ? <img src={product.logoUrl} className="h-full w-full rounded-xl object-cover" /> : initials}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1 text-xs font-semibold text-amber-500">🏆 {rank === 1 ? '1°' : `${rank}°`} del día</div>
          <h3 className="truncate text-sm font-bold text-slate-900">{product.name}</h3>
        </div>
      </div>
      <p className="mt-2 line-clamp-2 text-xs text-slate-600">{product.tagline}</p>
      <div className="mt-3 flex items-center gap-3 text-xs text-slate-500">
        <span className="flex items-center gap-1 font-semibold text-slate-700">▲ {product._count.votes}</span>
        <span className="flex items-center gap-1">💬 {product._count.comments}</span>
      </div>
    </div>
  );
}
