# Nyasawallet

Your pan-African digital wallet — store, send, and spend USDT and local fiat currency with ease.

## Features

- 💸 **Instant Transfers** — Send USDT across Africa in seconds
- 🔒 **Bank-grade Security** — Your funds are always protected
- 💱 **Best Exchange Rates** — Live rates updated in real time
- 🌍 **11 Countries Supported** — Malawi, Kenya, Nigeria, Ghana, Ethiopia, Mozambique, Rwanda, Tanzania, Uganda, Zambia, Zimbabwe
- 💳 **Virtual Debit Cards** — Spend USDT anywhere
- 📱 **Mobile Money Integration** — Airtel Money, MPesa, and more
- 🔗 **Multiple USDT Networks** — TRC20, ERC20, BSC, Polygon
- 👥 **Referral System** — Earn rewards by inviting friends
- 🛡️ **KYC Verification** — Secure identity verification
- 🎫 **Support System** — Built-in support tickets with AI assistance

## Tech Stack

- **Frontend:** Next.js (App Router), TypeScript, Tailwind CSS
- **Backend:** Supabase (PostgreSQL, Auth, Storage, Realtime)
- **Hosting:** Vercel (frontend) + Supabase (backend/database)
- **Version Control:** GitHub

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- A Supabase account

### Installation

1. Clone the repo:
```bash
git clone https://github.com/geniuspulse/nyasawallet.git
cd nyasawallet
```

2. Install dependencies:
```bash
npm install
```

3. Copy the env file and add your Supabase credentials:
```bash
cp .env.example .env.local
```

4. Run the database migration:
```bash
# Using Supabase CLI
supabase db push

# Or run the SQL manually in Supabase SQL editor
# See supabase/migrations/0001_initial_schema.sql
```

5. Start the dev server:
```bash
npm run dev
```

Visit `http://localhost:3000`

## Project Structure

```
nyasawallet/
├── app/                    # Next.js App Router
│   ├── (auth)/             # Auth pages (login, sign-up)
│   ├── (dashboard)/        # Protected app pages
│   ├── (admin)/            # Admin panel pages
│   ├── welcome/            # Landing page
│   └── layout.tsx          # Root layout
├── components/             # React components
│   ├── ui/                 # Reusable UI components
│   ├── auth/               # Auth components
│   ├── dashboard/          # Dashboard components
│   └── admin/              # Admin components
├── lib/                    # Utilities & types
│   ├── supabase/           # Supabase client configs
│   ├── types/              # TypeScript type definitions
│   └── utils/              # Helper functions
├── supabase/               # Supabase migrations
│   └── migrations/         # SQL migration files
└── public/                 # Static assets
```

## Database Schema

The app uses Supabase (PostgreSQL) with the following tables:

- `profiles` — User profiles with KYC status and referral codes
- `wallets` — USDT wallets with balances
- `transactions` — Deposits, sends, buys, sells, withdrawals
- `country_rates` — Exchange rates per country
- `gateway_configs` — Payment gateway configurations
- `virtual_cards` — Virtual debit cards
- `kyc_submissions` — KYC verification documents
- `support_tickets` — Support ticket system
- `support_messages` — Support chat messages
- `referrals` — Referral tracking and rewards
- `wallet_settings` — Global wallet configuration
- `balance_snapshots` — Historical balance snapshots

## License

MIT License © 2026 Arthur Chibondo
