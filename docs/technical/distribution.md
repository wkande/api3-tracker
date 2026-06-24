---
title: Reward distribution
---

# Reward distribution

This page explains how per-epoch staking rewards are calculated and distributed. It
paraphrases the official
[API3 reward distribution docs](https://dao-docs.api3.org/technical/distribution.html);
consult the contract source for exact arithmetic.

## Each epoch

An **epoch is one week**. Once per epoch the pool mints a staking reward and adds it
to the shared pool. Roughly:

```
epochReward ≈ apr / 52 × totalStake
```

Because the reward is added to the pool rather than paid out per address, **every
staker's shares become redeemable for proportionally more API3** — no per-address
claim transaction is needed for the principal to grow.

## Adaptive APR

The APR is not fixed. Each epoch the pool computes the **staked share of supply** and
adjusts the APR to keep that share near the **staking target**:

```
totalStakePercentage = totalStake × 1e18 / api3Token.totalSupply()
```

- `totalStakePercentage` **below** `stakeTarget` → APR **increases** by the governable
  `aprUpdateStep`, up to `maxApr`. Higher rewards attract more staking.
- **At or above** target → APR **decreases** by `aprUpdateStep`, down to `minApr`.

Note the target is itself a percentage (`1e18 = 100%`), so both sides of the
comparison are shares of supply. This is a negative-feedback loop: it pushes the
staked share toward the target rather than toward an extreme. The
[dashboard's staking card](/dashboard) mirrors this — when the staked share is below
target it notes that APR will increase until the target is met.

All of `apr`, `minApr`, `maxApr`, `aprUpdateStep`, and `stakeTarget` are governable;
see [Dashboard attributes](/docs/technical/dashboard-attributes).

## Vesting

Newly minted rewards are subject to the **reward vesting period**
(`REWARD_VESTING_PERIOD`). During vesting they are counted in an address's locked
balance and cannot be unstaked. This discourages staking purely to capture a single
epoch's reward and then leaving.

## What the dashboard derives

- **Current APR** — `apr()`, shown as a percentage (`apr / 1e16`).
- **Per-epoch reward** — displayed as `APR / 52`.
- **Target progress** — staked share of supply (`totalStake / totalSupply`) against
  the target share (`stakeTarget`), with a "met / below" badge.

Historical APR and reward series are **out of scope** for this phase; they require
indexing past epochs from chain events.
