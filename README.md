# API3 DAO Tracker

A [Docusaurus](https://docusaurus.io/) site with two parts:

- **Docs** (`docs/`) — adapted reference for the API3 DAO (governance, staking,
  rewards, voting, and an on-chain contracts reference).
- **Live dashboard** (`/dashboard`) — React components that read **current**
  on-chain state of the API3 staking pool directly from Ethereum mainnet via
  [viem](https://viem.sh/), client-side, **no backend and no wallet connection**.

## Quick start

```bash
npm install
npm start          # dev server at http://localhost:3000
npm run build      # static export to ./build
npm run serve      # serve the production build locally
npm run typecheck  # tsc --noEmit (strict)
```

## RPC configuration

All chain reads go through a single client module (`src/lib/chain.ts`). The RPC
endpoint is configurable at **build time** via an environment variable and defaults
to a public, no-key endpoint:

```bash
API3_RPC_URL="https://your-endpoint" npm run build
```

- Default: `https://ethereum-rpc.publicnode.com` (keyless).
- The value is wired through `docusaurus.config.ts` → `customFields.rpcUrl` and read
  by the data hooks. **Never put a secret API key here** — anything in client-side
  code is public. If you use a keyed provider (Alchemy/Infura), restrict the key by
  HTTP origin at the provider.

## Architecture

```
docs/                          Markdown docs (sidebar defined in sidebars.ts)
src/lib/
  chain.ts                     viem client + typed fetch* functions (the only place RPC happens)
  contracts.ts                 mainnet addresses + minimal typed ABI fragments
  hooks.ts                     useCurrentEpoch / useStakingStats / useTokenSupply / useStakeLookup
  format.ts                    bigint -> display helpers (token amounts, 1e18=100% percentages)
  abi/                         full vendored ABIs (reference)
src/components/dashboard/      the four cards + shared UI primitives
src/pages/dashboard.tsx        assembles the cards
```

Components consume data **only** through the hooks in `src/lib/hooks.ts`. This is a
deliberate seam: a future API-backed data source (an indexer for historical charts,
the full member list, the proposal archive — all out of scope for this phase) can be
swapped into the hooks/`chain.ts` without touching any component.

### Key on-chain facts

- The **Convenience** contract's `getUserStakingData(address)` returns most
  dashboard figures (APR, supply, total stake/shares, stake target, and per-user
  data) in a single `eth_call`. Pool-wide cards call it with the zero address.
- **APR and the stake target are percentages** (`1e18 = 100%`), not token amounts.
  The stake target is a target *share of total supply*; the pool compares
  `totalStake / totalSupply` against it each epoch to raise/lower APR.

## Deployment

Static output (`./build`) deploys to GitHub Pages, Netlify, or Cloudflare Pages.
Before deploying, set `url` and `baseUrl` in `docusaurus.config.ts` to match the
host (for GitHub Pages project sites, `baseUrl` is usually `/<repo>/`).
