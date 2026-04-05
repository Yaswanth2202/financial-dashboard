#!/usr/bin/env sh
set -eu

cd "$(dirname "$0")"

echo ""
echo "[install-dependencies] Finance Dashboard - installing npm packages..."
echo ""

if ! command -v node >/dev/null 2>&1; then
  echo "ERROR: Node.js is not installed or not on PATH."
  echo "Install Node.js 18+ from https://nodejs.org/ then run this script again."
  exit 1
fi

if ! command -v npm >/dev/null 2>&1; then
  echo "ERROR: npm was not found. Reinstall Node.js or fix your PATH."
  exit 1
fi

npm install

echo ""
echo "[install-dependencies] Done. Run: npm run dev"
echo ""
