---
title: Claude Code Prompt
slug: /prompt
---

# {frontMatter.title}

Following is the Claude Code prompt used to create the project. I was pleased with the quality and simplicity of the code for the React components.

---

# Project spec: Api3 DAO docs + live tracker site (Docusaurus)

## 1. Summary

Build a Docusaurus site that replaces https://tracker.api3.org/ for a specific, limited scope:

- **Documentation** — Markdown/MDX pages covering the API3 DAO (governance, staking, voting, contracts reference), adapted from the existing docs at https://dao-docs.api3.org/.
- **Live dashboard** — a handful of React components embedded in the site that read **current on-chain state** directly from the API3 Pool contracts via RPC, client-side, with no backend.

**Explicitly out of scope for this phase:** historical charts (e.g. APR over time), the full wallet/member leaderboard, and the proposal archive. Those require an indexer + database (the current tracker uses Postgres + cron jobs for this — see "Future phase" below) and are deliberately deferred. Do not build a backend, database, or scheduled job for this phase.

## 2. Reference material

- Current site being replaced: https://tracker.api3.org/
- Current site's source (architecture reference only, not to be reused wholesale — it's Next.js + Postgres, ours is static): https://github.com/api3dao/api3-tracker/
  - Has a `/abi` folder with contract ABIs already extracted — check there before re-deriving ABIs from scratch.
  - Has a `/components` folder showing what the current FE displays — useful for parity-checking which fields matter.
- DAO documentation (source content to adapt for the docs section): https://dao-docs.api3.org/
  - Contracts overview: https://dao-docs.api3.org/technical/
  - Pool contract reference: https://dao-docs.api3.org/technical/pool.html
  - Dashboard attributes (governable parameters): https://dao-docs.api3.org/technical/dashboard-attributes.html
  - Reward calc/distribution: https://dao-docs.api3.org/technical/distribution.html
- Contract source code: https://github.com/api3dao/api3-dao/tree/main/packages/pool/contracts
  - `Api3Pool.sol` is composed of: `TimelockUtils.sol`, `ClaimUtils.sol`, `StakeUtils.sol`, `TransferUtils.sol`, `DelegationUtils.sol`, `RewardUtils.sol`, `GetterUtils.sol`, `StateUtils.sol`.
  - **`GetterUtils.sol` is the most important file to read first** — it should contain the exact view/getter function signatures needed for the dashboard (current epoch, current APR, total staked, etc.). The docs pages above describe behavior but don't enumerate every getter signature.

## 3. Contract addresses (Ethereum mainnet)

| Name                    | Address                                      |
| ----------------------- | -------------------------------------------- |
| DAO Pool (Api3Pool.sol) | `0x6dd655f10d4b9e242ae186d9050b68f725c76d76` |
| API3 Token              | `0x0b38210ea11411557c13457D4dA7dC6ea731B88a` |
| API3 Supply             | `0xcD34bC5B03C954268d27c9Bc165a623c318bD0a8` |
| Convenience             | `0x95087266018b9637aff3d76d4e0cad7e52c19636` |
| Time-lock Manager       | `0xFaef86994a37F1c8b2A5c73648F07dd4eFF02baA` |
| DAO Kernel              | `0x593ea926ee9820a933488b6a288433c387d06dba` |
| ACL                     | `0x1e7ecc6d3b5b4cfdfc71cb7c3ea9ac4a55f4195a` |
| Primary Voting          | `0xdb6c812e439ce5c740570578681ea7aadba5170b` |
| Secondary Voting        | `0x1c8058e72e4902b3431ef057e8d9a58a73f26372` |
| Primary Agent           | `0xd9f80bdb37e6bad114d747e60ce6d2aaf26704ae` |
| Secondary Agent         | `0x556ecbb0311d350491ba0ec7e019c354d7723ce0` |
| V1 Treasury             | `0xe7aF7c5982e073aC6525a34821fe1B3e8E432099` |

**Note:** the "Convenience" contract is likely a bundling/view contract (common pattern: aggregates multiple reads into one call to save round trips). Investigate it first — it may return most or all of the dashboard fields in a single `eth_call`, which would be far cleaner than calling the pool contract for each field separately. Only fall back to individual pool getters if Convenience doesn't cover everything needed.

Only the Pool, Token, Supply, and Convenience contracts are needed for this phase. DAO Kernel / ACL / Voting / Agent / Treasury addresses are listed for completeness but aren't used by the live-stats dashboard.

## 4. Tech stack

- **Docusaurus 3.x** (TypeScript preset)
- **viem** for all contract reads (lighter than ethers + wagmi for a read-only, no-wallet-connect use case; no need for wagmi/RainbowKit since users only type in an address, they don't connect a wallet — confirm this matches the current tracker's "no wallet connection needed" approach)
- No backend, no database. Build output must be static-exportable (`docusaurus build`) and deployable to GitHub Pages, Netlify, or Cloudflare Pages.
- RPC endpoint should be configurable via an environment variable at build time, defaulting to a public RPC (e.g. a public Cloudflare or Ankr Ethereum endpoint), so no secret key is ever required or exposed client-side. If the project owner wants to use a keyed provider (Alchemy/Infura) later, the key must be restricted by domain/origin at the provider level — never assume a secret can stay hidden in client-side code.

## 5. Site structure

**File placement is not optional.** All custom React components for this project MUST live under `src/components/` (the standard Docusaurus convention — same place the default template puts its own example component). Do not place them in `docs/`, `static/`, a top-level `components/` outside `src/`, or anywhere else. The exact paths below are required, not illustrative.

```
docs/
  intro.md                     — what is the API3 DAO (adapt from dao-docs overview)
  governance.md
  rewards.md
  staking.md                   — staking tokens (member-facing how-to)
  voting.md
  technical/
    contracts.md               — overview + address table
    pool.md                    — Api3Pool.sol reference
    dashboard-attributes.md    — governable parameters
    distribution.md            — reward calc/distribution

src/components/dashboard/
  CurrentEpochCard.tsx         — current epoch #, APR, epoch reward %
  StakingStatsCard.tsx         — total staked, staking target, supply figures
  MyStakeLookup.tsx            — text input for a wallet address -> stake, shares, voting power
  TokenSupplyCard.tsx          — total/circulating supply, locked-by-governance, locked-rewards

src/pages/dashboard.tsx        — assembles the cards above into a page (or embed
                                  the same components directly into docs/intro.md via MDX —
                                  decide based on whether this should read as "a doc page"
                                  or "an app page"; default to a dedicated /dashboard page
                                  linked from the docs sidebar)

src/lib/
  chain.ts                     — viem public client setup, RPC URL from env
  contracts.ts                 — addresses + minimal ABI fragments (only the functions used)
  abi/                         — copy relevant ABI JSON from api3-tracker's /abi folder if usable
```

## 6. Component specs

For each component below: show a loading skeleton while the RPC call resolves, show a clear inline error state if the call fails (don't fail silently), and include a manual refresh control (no polling needed for a v1 — refresh-on-demand is enough since this isn't a live ticker).

- **CurrentEpochCard** — reads current epoch index, current APR, current epoch reward percentage from the Pool (or Convenience) contract. No props.
- **StakingStatsCard** — reads total staked amount and stake target from the Pool contract; computes/display whether target is met (mirror the tracker's "APR will increase until target is met" messaging, sourced from `https://dao-docs.api3.org/technical/distribution.html` — paraphrase, don't copy verbatim).
- **TokenSupplyCard** — reads total supply and circulating supply from the API3 Supply contract; if "locked by governance" and "locked rewards" breakdowns aren't directly exposed there, check Convenience or compute from Pool state.
- **MyStakeLookup** — controlled text input (plain string, validate as a checksummed address client-side before calling), calls Pool contract getters scoped to that address (stake amount, shares, voting power — confirm exact getter names from `GetterUtils.sol`), renders results or a clear "no stake found" / "invalid address" state.

## 7. Non-functional requirements

- TypeScript throughout, strict mode.
- All chain calls go through a single typed client module (`src/lib/chain.ts`) — no ad hoc `fetch`/RPC calls scattered in components.
- Components must degrade gracefully if the RPC endpoint is unreachable (rate-limited, down, etc.) — show an error state, never an unhandled crash or an infinite spinner.
- No wallet connection, no transaction-sending logic anywhere in this phase — read-only.
- Lighthouse/static-export sanity check: confirm `docusaurus build` produces a fully static site with no SSR-only dependencies (viem calls happen client-side after hydration).

## 8. Open decisions for the project owner (flag, don't guess)

- Exact wording/content for each docs page — this spec lists structure, not final prose. Claude Code should draft content from the dao-docs source pages but the owner should review before publishing, especially anything that's close paraphrase of existing API3 docs.
- Branding/theme (logo, colors, light/dark mode default) — not specified here; use Docusaurus defaults until told otherwise.
- Final choice of public RPC endpoint vs. a provided API key.
- Hosting target (GitHub Pages vs Netlify vs Cloudflare Pages) — affects `docusaurus.config.js` `baseUrl`/`url` settings.

## 9. Future phase (not part of this build)

If/when historical views (APR history, full wallet list, proposal archive) are wanted, that requires an indexer reading chain events into a database and an API layer for the Docusaurus site's React components to query — essentially a slimmed-down version of what `api3-tracker`'s backend already does. Flagging this now so the data-layer code in this phase (`src/lib/chain.ts`) is written in a way that a future API-backed data source could be swapped in without rewriting the components — e.g. components should consume data through a small hook (`useCurrentEpoch()`, `useStakingStats()`, etc.) rather than calling viem directly inline, so the hook's internals can change later without touching the UI.

## 10. Suggested build order

1. Scaffold Docusaurus (TypeScript template), confirm `yarn build` works with no content yet.
2. Set up `src/lib/chain.ts` and `src/lib/contracts.ts`; verify a single read (e.g. total supply) works end-to-end against mainnet via a public RPC, logged to console.
3. Investigate the Convenience contract and `GetterUtils.sol` to finalize exact ABI fragments needed.
4. Build the four dashboard components against real reads, with loading/error states.
5. Assemble `/dashboard` page.
6. Write/adapt docs content into the `docs/` structure above.
7. Wire up sidebar navigation linking docs `<->` dashboard.
8. Confirm static export works and deploy to a preview host.
