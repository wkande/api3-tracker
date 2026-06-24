---
title: Voting
---

# Voting

Governance decisions are made by on-chain votes weighted by staked voting power.

## Voting power

Your voting power is derived from your **staked pool shares**, plus any voting power
**delegated** to you, minus any you have delegated away. Because the pool checkpoints
balances, a vote uses each voter's voting power **as of the block the proposal was
created**, which prevents acquiring shares mid-vote to swing a result.

## Delegation

If you would rather not vote on every proposal, you can **delegate** your voting
power to another address. Delegation:

- transfers your voting weight to your delegate for future votes,
- can be changed or revoked, subject to on-chain timing rules,
- does **not** transfer ownership of your tokens or rewards — only voting weight.

## The proposal lifecycle

1. **Propose.** An address with at least the governable **proposal threshold** of
   voting power submits a proposal to the **primary** or **secondary** voting app.
   The proposal carries a `script` describing the on-chain actions to execute if it
   passes.
2. **Vote.** During the voting period, addresses cast **yes/no** votes weighted by
   their voting power at the proposal's creation block.
3. **Pass criteria.** A proposal passes if it meets both the **support** threshold
   (share of yes among votes cast) and the **minimum acceptance quorum** (share of
   total voting power voting yes).
4. **Execute.** A passed proposal is enacted through the track's **Agent** contract,
   which performs the encoded actions (e.g. parameter changes or treasury transfers).

Primary and secondary tracks differ in their thresholds and in the powers of their
Agents — see [Governance](/docs/governance). The governable thresholds are listed in
[Dashboard attributes](/docs/technical/dashboard-attributes).

:::note
The full proposal archive (historical proposals and outcomes) is **out of scope**
for this phase — it requires indexing past events into a database. This site shows
current pool state only.
:::
