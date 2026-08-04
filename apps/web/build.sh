#!/usr/bin/env bash
# Vercel runs this from /vercel/path0/apps/web (auto-detected Astro root).
# Jump to the monorepo root so npm workspaces can resolve the script.
set -e
cd ../..
exec npm run build:web
