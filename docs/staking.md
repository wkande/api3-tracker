---
title: Staking
---

# Staking API3

Staking is how you join the API3 DAO: it earns rewards and grants voting power.
This page is a member-facing overview of the flow. All of it happens through the
[pool contract](/docs/technical/pool); this site is read-only and does not send
transactions.

## The lifecycle

Staking has a few distinct balances. Tokens move between them explicitly:

1. **Deposit** — move API3 from your wallet into the pool. Deposited-but-unstaked
   tokens sit in the pool but earn no rewards and carry no voting power.
2. **Stake** — stake your deposited tokens. Staking **mints pool shares** to you.
   Shares — not the raw token amount — represent your proportional ownership of the
   pool, your voting power, and your claim on rewards.
3. **Earn** — while staked, you accrue a share of each epoch's minted rewards (see
   [Rewards](/docs/rewards)).
4. **Unstake** — request to unstake. There is an **unstake waiting period** before
   the tokens become withdrawable; the amount and the scheduled time are recorded
   on-chain.
5. **Withdraw** — after unstaking, move tokens back out of the pool to your wallet.

## Shares vs. tokens

When you stake, you receive **shares** computed from the current ratio of total
stake to total shares. As rewards are minted into the pool, each share becomes
redeemable for more API3 — so the token value of your shares grows even though your
share count stays the same. The [dashboard](/dashboard) shows total stake and total
shares, and the per-address lookup shows an address's shares alongside its staked
amount.

## Locks

Some staked tokens may be **locked** — for example freshly minted rewards are
subject to a vesting period before they can be unstaked. The pool tracks a
`userLocked` figure per address, surfaced in the dashboard's address lookup.

## Voting power

Staked shares confer voting power. You can use it directly or **delegate** it to
another address. Delegation and undelegation are subject to their own timing rules
recorded on-chain. See [Voting](/docs/voting).
