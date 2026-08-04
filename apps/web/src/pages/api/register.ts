import type { APIRoute } from 'astro';
import { setToken, clearToken } from '../../lib/auth';

export const prerender = false;

const API_BASE = import.meta.env.PUBLIC_API_BASE_URL || 'http://localhost:3001/api/v1';

export const POST: APIRoute = async (ctx) => {
  const form = await ctx.request.formData();
  const email = String(form.get('email') ?? '').trim();
  const username = String(form.get('username') ?? '').trim();
  const password = String(form.get('password') ?? '');

  if (!email || !username || password.length < 8) {
    return ctx.redirect(`/register?error=${encodeURIComponent('Datos inválidos (password min 8 chars)')}`);
  }

  try {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, username, password }),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      const msg = body?.message ? (Array.isArray(body.message) ? body.message.join(', ') : body.message) : 'No se pudo crear la cuenta';
      return ctx.redirect(`/register?error=${encodeURIComponent(msg)}`);
    }
    const data = await res.json();
    setToken(ctx, data.accessToken);
    return ctx.redirect('/');
  } catch {
    return ctx.redirect('/register?error=No_se_pudo_contactar_al_servidor');
  }
};
