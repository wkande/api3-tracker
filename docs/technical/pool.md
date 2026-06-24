---
title: Pool contract
---

# `Api3Pool.sol`

The pool is the heart of the DAO: it custodies staked API3, mints and burns pool
shares, tracks voting power, and mints staking rewards. It is composed of several
mixins, each owning one concern:

| Mixin | Responsibility |
|---|---|
| `StateUtils` | State variables and governable parameters (APR bounds, stake target, epoch length). |
| `GetterUtils` | View/getter functions (shares, voting power, user details). |
| `TransferUtils` | Deposits and withdrawals between wallet and pool. |
| `StakeUtils` | Stake / unstake; minting and burning of shares. |
| `RewardUtils` | Minting per-epoch rewards into the pool. |
| `DelegationUtils` | Delegating and undelegating voting power. |
| `ClaimUtils` | Insurance-claim payout handling. |
| `TimelockUtils` | Vesting / time-locked deposits. |

Source: [api3dao/api3-dao · packages/pool/contracts](https://github.com/api3dao/api3-dao/tree/main/packages/pool/contracts).

## Key constants

| Constant | Value | Meaning |
|---|---|---|
| `EPOCH_LENGTH` | `604800` (1 week) | Length of a reward epoch. |
| `REWARD_VESTING_PERIOD` | (governable-era constant) | How long minted rewards vest before they can be unstaked. |
| `HUNDRED_PERCENT` | `1e18` | Percentage base — all percentages use `1e18 = 100%`. |

## Getters used by the dashboard

From `GetterUtils` / `StateUtils`:

- `userShares(address) → uint256` — an address's pool shares.
- `userVotingPower(address) → uint256` — an address's voting power (own + delegated).
- `userStake(address) → uint256` — an address's staked API3.
- `genesisEpoch() → uint256` — the epoch index the pool launched in.
- `apr() → uint256` — current APR, `1e18 = 100%`.
- `totalStake() → uint256`, `stakeTarget() → uint256` — pool-wide staking figures.

In practice the dashboard reads most of these through the **Convenience** contract's
`getUserStakingData(address)`, which bundles them into one call (see
[Contracts](/docs/technical/contracts)).

## Percentage and amount conventions

- **Token amounts** are 18-decimal fixed point (like the API3 ERC-20).
- **Percentages** (APR, thresholds, stake-target-related values) use the
  `1e18 = 100%` convention. To display, divide by `1e16` to get a percentage number.
