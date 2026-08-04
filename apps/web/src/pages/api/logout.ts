import type { APIRoute } from 'astro';
import { clearToken } from '../../lib/auth';

export const prerender = false;

export const POST: APIRoute = async (ctx) => {
  clearToken(ctx);
  return ctx.redirect('/');
};

export const GET: APIRoute = async (ctx) => {
  clearToken(ctx);
  return ctx.redirect('/');
};
