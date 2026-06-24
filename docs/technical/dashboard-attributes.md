---
title: Dashboard attributes
---

# Dashboard attributes (governable parameters)

Several of the pool's parameters are **governable** — the DAO can change them through
a vote. They directly shape staking incentives. This page summarizes the ones that
matter for the staking dashboard; see the official
[API3 dashboard attributes](https://dao-docs.api3.org/technical/dashboard-attributes.html)
for the complete list.

| Parameter | Getter | Meaning |
|---|---|---|
| **Stake target** | `stakeTarget()` | Desired **staked share of total supply** (a percentage, `1e18 = 100%`). Drives whether APR rises or falls each epoch. |
| **Min APR** | `minApr()` | Lower bound on the APR. |
| **Max APR** | `maxApr()` | Upper bound on the APR. |
| **APR update step** | `aprUpdateStep()` | How much the APR moves per epoch toward the target. |
| **Current APR** | `apr()` | The APR currently in effect, between min and max. |
| **Unstake waiting period** | (state) | Delay between requesting an unstake and being able to withdraw. |
| **Reward vesting period** | `REWARD_VESTING_PERIOD` | How long minted rewards stay locked. |
| **Proposal threshold** | (voting app) | Minimum share of voting power required to create a proposal. |

## Units

- APR-related values (`apr`, `minApr`, `maxApr`, `aprUpdateStep`) use the
  `1e18 = 100%` convention.
- `stakeTarget` **also** uses the `1e18 = 100%` convention — it is a target *share
  of total supply*, not a token amount. (For example a raw value of `4e17` means a
  40% target.)

## How they interact

Each epoch the pool computes the staked share of supply and compares it to the
target:

```
totalStakePercentage = totalStake × 1e18 / api3Token.totalSupply()
```

- `totalStakePercentage` below `stakeTarget` → APR moves **up** by `aprUpdateStep`
  (capped at `maxApr`);
- above `stakeTarget` → APR moves **down** by `aprUpdateStep` (floored at `minApr`).

The resulting APR sets that epoch's minted reward (`≈ APR / 52` of total stake). See
[Reward distribution](/docs/technical/distribution) for the exact mechanism, and the
[live dashboard](/dashboard) for the current values of `apr`, `totalStake`, and
`stakeTarget`.
