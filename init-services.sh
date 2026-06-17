#!/bin/bash
set -e

echo "Installing project dependencies..."

cd erp-gateway/
if [ ! -f .env ]; then
  cp .env.example .env
fi
pnpm install

cd ..
cd erp-company/
if [ ! -f .env ]; then
  cp .env.example .env
fi
pnpm install

cd ..
cd erp-inventory/
if [ ! -f .env ]; then
  cp .env.example .env
fi
pnpm install

cd ..
cd erp-payment/
if [ ! -f .env ]; then
  cp .env.example .env
fi
pnpm install

cd ..
cd erp-people/
if [ ! -f .env ]; then
  cp .env.example .env
fi
pnpm install

cd ..
cd erp-purchase/
if [ ! -f .env ]; then
  cp .env.example .env
fi
pnpm install

cd ..
cd erp-sale/
if [ ! -f .env ]; then
  cp .env.example .env
fi
pnpm install

echo "Project dependencies installed successfully."