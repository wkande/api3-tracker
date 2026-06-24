---
title: Contracts
---

# Contracts reference

The API3 DAO is a set of on-chain contracts on **Ethereum mainnet**. This page is an
overview and the canonical address table; the [Pool](/docs/technical/pool) page
covers the staking pool in more depth.

## Addresses (Ethereum mainnet)

| Name | Address | Used by dashboard |
|---|---|:---:|
| DAO Pool (`Api3Pool.sol`) | [`0x6dd655f10d4b9e242ae186d9050b68f725c76d76`](https://etherscan.io/address/0x6dd655f10d4b9e242ae186d9050b68f725c76d76) | ✅ |
| API3 Token | [`0x0b38210ea11411557c13457D4dA7dC6ea731B88a`](https://etherscan.io/address/0x0b38210ea11411557c13457D4dA7dC6ea731B88a) | ✅ |
| API3 Supply | [`0xcD34bC5B03C954268d27c9Bc165a623c318bD0a8`](https://etherscan.io/address/0xcD34bC5B03C954268d27c9Bc165a623c318bD0a8) | ✅ |
| Convenience | [`0x95087266018b9637aff3d76d4e0cad7e52c19636`](https://etherscan.io/address/0x95087266018b9637aff3d76d4e0cad7e52c19636) | ✅ |
| Time-lock Manager | [`0xFaef86994a37F1c8b2A5c73648F07dd4eFF02baA`](https://etherscan.io/address/0xFaef86994a37F1c8b2A5c73648F07dd4eFF02baA) | |
| DAO Kernel | [`0x593ea926ee9820a933488b6a288433c387d06dba`](https://etherscan.io/address/0x593ea926ee9820a933488b6a288433c387d06dba) | |
| ACL | [`0x1e7ecc6d3b5b4cfdfc71cb7c3ea9ac4a55f4195a`](https://etherscan.io/address/0x1e7ecc6d3b5b4cfdfc71cb7c3ea9ac4a55f4195a) | |
| Primary Voting | [`0xdb6c812e439ce5c740570578681ea7aadba5170b`](https://etherscan.io/address/0xdb6c812e439ce5c740570578681ea7aadba5170b) | |
| Secondary Voting | [`0x1c8058e72e4902b3431ef057e8d9a58a73f26372`](https://etherscan.io/address/0x1c8058e72e4902b3431ef057e8d9a58a73f26372) | |
| Primary Agent | [`0xd9f80bdb37e6bad114d747e60ce6d2aaf26704ae`](https://etherscan.io/address/0xd9f80bdb37e6bad114d747e60ce6d2aaf26704ae) | |
| Secondary Agent | [`0x556ecbb0311d350491ba0ec7e019c354d7723ce0`](https://etherscan.io/address/0x556ecbb0311d350491ba0ec7e019c354d7723ce0) | |
| V1 Treasury | [`0xe7aF7c5982e073aC6525a34821fe1B3e8E432099`](https://etherscan.io/address/0xe7aF7c5982e073aC6525a34821fe1B3e8E432099) | |

## What the dashboard reads

The [live dashboard](/dashboard) only needs four of these contracts:

- **Convenience** — a view/aggregation contract. Its `getUserStakingData(address)`
  returns the pool-wide figures (APR, total supply, total stake, total shares, stake
  target) **and** per-address figures (staked, shares, locked, …) in a **single
  `eth_call`**. The dashboard uses this for most reads, calling it with the zero
  address for the pool-wide cards.
- **Pool** (`Api3Pool.sol`) — for `EPOCH_LENGTH`, `genesisEpoch`, and per-address
  `userShares` / `userVotingPower`.
- **Supply** — for `getCirculatingSupply`, `getLockedByGovernance`,
  `getLockedRewards`, and `getLockedVestings`.
- **Token** — the API3 ERC-20 (its total supply is also surfaced via Convenience).

The Kernel, ACL, Voting, Agent, and Treasury contracts are listed for completeness
but are not read by this phase's dashboard.

## ABIs

Minimal ABI fragments for exactly the functions used live in
[`src/lib/contracts.ts`](https://github.com/api3dao/api3-tracker), with the full
vendored ABIs under `src/lib/abi/`.
