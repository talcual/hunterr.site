import type { APIRoute } from 'astro';
import { getToken } from '../../../lib/auth';

export const prerender = false;

const API_BASE = import.meta.env.PUBLIC_API_BASE_URL || 'http://localhost:3001/api/v1';

export const POST: APIRoute = async (ctx) => {
  const token = getToken(ctx);
  const { id: productId } = ctx.params;
  if (!productId) return new Response('Bad request', { status: 400 });
  if (!token) return ctx.redirect(`/login?next=/products/${productId}`);

  const form = await ctx.request.formData();
  const body = String(form.get('body') ?? '').trim();
  if (!body) return ctx.redirect(`/products/${productId}?comment_error=${encodeURIComponent('Comentario vacío')}`);

  try {
    const res = await fetch(`${API_BASE}/products/${productId}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ body }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      const msg = data?.message ? (Array.isArray(data.message) ? data.message.join(', ') : data.message) : 'Error al comentar';
      return ctx.redirect(`/products/${productId}?comment_error=${encodeURIComponent(msg)}`);
    }
  } catch {
    return ctx.redirect(`/products/${productId}?comment_error=No_se_pudo_contactar_al_servidor`);
  }
  return ctx.redirect(`/products/${productId}`);
};
