---
title: Introduction
slug: /intro
---

# The Api3 DAO

Api3 is a collaborative project delivering traditional API services to
smart-contract platforms in a decentralized and trust-minimized way. It is
governed by a **decentralized autonomous organization (DAO)** — the API3 DAO —
whose members stake the Api3 token to participate in governance and to secure the
network's data feeds.

This site has two parts:

- **Documentation** — an adapted reference covering how the DAO is governed, how
  staking and rewards work, how voting works, and the on-chain contracts behind it.
- **[Live dashboard](/dashboard)** — a handful of components that read the
  **current on-chain state** of the staking pool directly from Ethereum mainnet in
  your browser. No wallet connection is required.

:::tip[Source & scope]

The documentation here is adapted from the official
[API3 DAO docs](https://dao-docs.api3.org/). It is a working draft pending review.
This phase intentionally covers **current** on-chain state only — historical charts
(APR over time), the full member leaderboard, and the proposal archive are out of
scope and would require an indexer + database.

:::

## How the DAO works at a glance

- **Stake to participate.** Members deposit API3 tokens into the
  [pool contract](/docs/technical/pool) and stake them. Staking mints **pool
  shares**, which represent both governance voting power and a claim on staking
  rewards.
- **Earn rewards.** Each weekly **epoch**, new API3 is minted as a staking reward
  and added to the pool. Rewards are subject to a vesting period. See
  [Rewards](/docs/rewards).
- **Govern.** Staked shares confer **voting power** that can be used directly or
  delegated. Proposals that pass execute on-chain through the DAO's Agent
  contracts. See [Voting](/docs/voting) and [Governance](/docs/governance).
- **Adaptive incentives.** A governable **staking target** drives an APR that rises
  when staking is below target and falls when it is above, nudging the total stake
  toward the target. See [Reward distribution](/docs/technical/distribution).

## Where to go next

| If you want to…                         | Go to                                  |
| --------------------------------------- | -------------------------------------- |
| Understand the DAO's structure & powers | [Governance](/docs/governance)         |
| Stake tokens (member how-to)            | [Staking](/docs/staking)               |
| Understand rewards & APR                | [Rewards](/docs/rewards)               |
| Understand proposals & votes            | [Voting](/docs/voting)                 |
| Read the contract reference             | [Contracts](/docs/technical/contracts) |
| See current on-chain numbers            | [Live dashboard](/dashboard)           |
