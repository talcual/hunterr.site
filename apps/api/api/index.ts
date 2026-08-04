import 'reflect-metadata';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createApp } from '../dist/main';

let appPromise: ReturnType<typeof createApp> | null = null;
const getApp = () => (appPromise ??= createApp());

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const app = await getApp();
  const expressApp = app.getHttpAdapter().getInstance();
  const handle = expressApp as unknown as (
    req: VercelRequest,
    res: VercelResponse,
    next: () => void,
  ) => void;
  return new Promise<void>((resolve) => {
    handle(req, res, () => resolve());
  });
}
