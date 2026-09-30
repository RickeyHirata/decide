#!/usr/bin/env bash
set -euo pipefail
if ! command -v supabase >/dev/null 2>&1; then
  echo 'SKIP: Supabase CLI is not installed; real DB/RLS/concurrency tests were not run.' >&2
  exit 2
fi
supabase db reset
