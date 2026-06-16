#!/bin/bash
set -e

echo "Installing project dependencies..."

cd erp-gateway/
cp .env.example .env
pnpm install

cd ..
cd erp-inventory/
cp .env.example .env
pnpm install

cd ..
cd erp-payment/
cp .env.example .env
pnpm install

cd ..
cd erp-people/
cp .env.example .env
pnpm install

cd ..
cd erp-purchase/
cp .env.example .env
pnpm install

cd ..
cd erp-sale/
cp .env.example .env
pnpm install

echo "Project dependencies installed successfully."