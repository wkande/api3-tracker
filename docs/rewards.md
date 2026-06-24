---
title: Rewards
---

# Staking rewards

Stakers are rewarded with newly minted Api3 each **epoch**. This page explains the
mechanics at a high level; the precise formula lives in
[Reward distribution](/docs/technical/distribution).

## Epochs

An **epoch is one week** (`EPOCH_LENGTH = 604800` seconds). The pool numbers epochs
sequentially; the current epoch index is simply the current block timestamp divided
by the epoch length. The epoch in which the pool launched is its **genesis epoch**.
Both figures appear on the [live dashboard](/dashboard).

## APR and per-epoch rewards

The pool maintains an **annual percentage rate (APR)**. Each epoch, approximately
`APR / 52` of the total staked amount is minted and added to the pool as rewards.
Because rewards are added to the shared pool, every staker's shares become
redeemable for proportionally more API3.

The APR is **adaptive**: it is bounded between a governable minimum and maximum, and
it moves by a governable step each epoch depending on whether the total stake is
below or above the **staking target** (see below and
[Reward distribution](/docs/technical/distribution)).

## The staking target

The DAO sets a **staking target** — the desired **share of total token supply** that
should be staked (e.g. 40%). Each epoch the pool computes the staked share as
`totalStake / totalSupply` and compares it to the target:

- When the staked share is **below target**, APR **increases** each epoch to attract
  more staking.
- When the staked share is **above target**, APR **decreases** each epoch.

This negative feedback nudges the staked share toward the target over time. The
[dashboard](/dashboard) shows the current total staked, the staked share of supply,
the target, and whether the target is currently met.

## Vesting

Minted rewards are subject to a **reward vesting period** (`REWARD_VESTING_PERIOD`)
before they can be unstaked and withdrawn. Until then they count toward an address's
locked balance. This aligns stakers with the long-term health of the network.
