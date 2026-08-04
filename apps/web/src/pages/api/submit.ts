import type { APIRoute } from 'astro';
import { getToken } from '../../lib/auth';

export const prerender = false;

const API_BASE = import.meta.env.PUBLIC_API_BASE_URL || 'http://localhost:3001/api/v1';

export const POST: APIRoute = async (ctx) => {
  const token = getToken(ctx);
  if (!token) return ctx.redirect('/login?next=/submit');

  const form = await ctx.request.formData();
  const techRaw = String(form.get('techStack') ?? '').trim();
  const techStack = techRaw ? techRaw.split(',').map((s) => s.trim()).filter(Boolean) : undefined;
  const body = {
    name: String(form.get('name') ?? '').trim(),
    tagline: String(form.get('tagline') ?? '').trim(),
    description: String(form.get('description') ?? '').trim() || undefined,
    url: String(form.get('url') ?? '').trim() || undefined,
    logoUrl: String(form.get('logoUrl') ?? '').trim() || undefined,
    techStack,
    categoryId: String(form.get('categoryId') ?? '').trim() || undefined,
  };

  try {
    const res = await fetch(`${API_BASE}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      const msg = data?.message ? (Array.isArray(data.message) ? data.message.join(', ') : data.message) : 'Error al crear';
      return ctx.redirect(`/submit?error=${encodeURIComponent(msg)}`);
    }
    const product = await res.json();
    return ctx.redirect(`/products/${product.id}`);
  } catch {
    return ctx.redirect('/submit?error=No_se_pudo_contactar_al_servidor');
  }
};
