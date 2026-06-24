/**
 * Contract addresses (Ethereum mainnet) and the minimal ABI fragments actually
 * used by the dashboard. We deliberately hand-write narrow `as const` fragments
 * here (rather than importing the full vendored JSON in `./abi`) so that viem can
 * fully infer argument and return types for every read. The full ABIs are kept in
 * `./abi/*.json` for reference / future use.
 */

export type Address = `0x${string}`;

export const ADDRESSES = {
  /** Api3Pool.sol — staking pool, APR/epoch/stake state. */
  pool: '0x6dd655f10d4b9e242ae186d9050b68f725c76d76',
  /** API3 ERC-20 token. */
  token: '0x0b38210ea11411557c13457D4dA7dC6ea731B88a',
  /** API3 Supply — circulating / locked breakdowns. */
  supply: '0xcD34bC5B03C954268d27c9Bc165a623c318bD0a8',
  /** Convenience — aggregates most dashboard reads into one call. */
  convenience: '0x95087266018b9637aff3d76d4e0cad7e52c19636',
} as const satisfies Record<string, Address>;

/**
 * Convenience.getUserStakingData(address) returns pool-wide figures (apr,
 * api3Supply, totalStake, totalShares, stakeTarget) plus per-user figures in a
 * single eth_call. Passing the zero address yields the pool-wide figures with the
 * per-user fields all zero, which is how the non-user cards source their data.
 */
export const convenienceAbi = [
  {
    type: 'function',
    name: 'getUserStakingData',
    stateMutability: 'view',
    inputs: [{ name: 'userAddress', type: 'address' }],
    outputs: [
      { name: 'apr', type: 'uint256' },
      { name: 'api3Supply', type: 'uint256' },
      { name: 'totalStake', type: 'uint256' },
      { name: 'totalShares', type: 'uint256' },
      { name: 'stakeTarget', type: 'uint256' },
      { name: 'userApi3Balance', type: 'uint256' },
      { name: 'userStaked', type: 'uint256' },
      { name: 'userUnstaked', type: 'uint256' },
      { name: 'userVesting', type: 'uint256' },
      { name: 'userUnstakeAmount', type: 'uint256' },
      { name: 'userUnstakeShares', type: 'uint256' },
      { name: 'userUnstakeScheduledFor', type: 'uint256' },
      { name: 'userLocked', type: 'uint256' },
    ],
  },
] as const;

export const supplyAbi = [
  {
    type: 'function',
    name: 'getCirculatingSupply',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ type: 'uint256' }],
  },
  {
    type: 'function',
    name: 'getLockedByGovernance',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ type: 'uint256' }],
  },
  {
    type: 'function',
    name: 'getLockedRewards',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ type: 'uint256' }],
  },
  {
    type: 'function',
    name: 'getLockedVestings',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ type: 'uint256' }],
  },
  {
    type: 'function',
    name: 'getTotalLocked',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ type: 'uint256' }],
  },
] as const;

export const tokenAbi = [
  {
    type: 'function',
    name: 'totalSupply',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ type: 'uint256' }],
  },
] as const;

export const poolAbi = [
  {
    type: 'function',
    name: 'EPOCH_LENGTH',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ type: 'uint256' }],
  },
  {
    type: 'function',
    name: 'genesisEpoch',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ type: 'uint256' }],
  },
  {
    type: 'function',
    name: 'userShares',
    stateMutability: 'view',
    inputs: [{ name: 'userAddress', type: 'address' }],
    outputs: [{ type: 'uint256' }],
  },
  {
    type: 'function',
    name: 'userVotingPower',
    stateMutability: 'view',
    inputs: [{ name: 'userAddress', type: 'address' }],
    outputs: [{ type: 'uint256' }],
  },
] as const;
