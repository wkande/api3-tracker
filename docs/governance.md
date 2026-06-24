---
title: Governance
---

# Governance

The API3 DAO governs the project's treasury, parameters, and protocol decisions
entirely on-chain. Governance is built on an [Aragon](https://aragon.org/)-style
stack, with the DAO's powers split across dedicated contracts.

## Structure

| Role | What it does |
|---|---|
| **Pool** | Holds staked API3, mints pool shares, tracks voting power and rewards. |
| **Voting apps** | Two voting tracks — **primary** and **secondary** — with different thresholds and powers. |
| **Agents** | Execute the actions approved by a vote (e.g. moving treasury funds, changing parameters). The **primary agent** holds elevated powers; the **secondary agent** handles lower-risk actions. |
| **ACL** | Access-control list mapping which entities may perform which protected actions. |
| **Kernel** | The Aragon kernel tying the organization's apps together. |
| **Treasuries** | Hold the DAO's funds (including a V1 treasury carried over from earlier). |

The exact on-chain addresses are listed in the
[Contracts reference](/docs/technical/contracts).

## Primary vs. secondary tracks

Proposals are submitted to one of two voting apps:

- **Primary** — used for higher-impact decisions; typically requires a higher
  support threshold and quorum.
- **Secondary** — used for lower-impact decisions, with lighter thresholds.

Each track has its own **Agent** contract that carries out whatever a passed
proposal authorizes. Splitting powers this way limits the blast radius of any
single track.

## Who can propose and vote

Voting power comes from **staked pool shares**. To create a proposal, an address
must hold (or have delegated to it) at least a governable **proposal threshold**
fraction of the total voting power. Members who do not want to vote directly can
**delegate** their voting power to another address. See [Voting](/docs/voting) for
the proposal lifecycle and the [dashboard attributes](/docs/technical/dashboard-attributes)
for the governable thresholds.

## On-chain execution

Because every step — proposing, voting, and execution — happens on-chain, the DAO
is able to control its own contracts and treasury without a trusted intermediary.
A proposal's `script` encodes the exact calls the Agent will make if the vote
passes and is enacted.
