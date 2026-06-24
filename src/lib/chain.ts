/**
 * The single typed entry point for all on-chain reads.
 *
 * Components never call viem (or `fetch`) directly — they consume the React hooks
 * in `./hooks`, which in turn call the typed `fetch*` functions here. Keeping every
 * RPC read behind this module is what makes a future API-backed data source a
 * drop-in swap: only the bodies of these functions would change.
 */
import {
  createPublicClient,
  http,
  isAddress,
  getAddress,
  type PublicClient,
} from 'viem';
import { mainnet } from 'viem/chains';
import {
  ADDRESSES,
  convenienceAbi,
  poolAbi,
  supplyAbi,
  type Address,
} from './contracts';

/**
 * Public, no-key default RPC. Overridable at build time via the `API3_RPC_URL`
 * env var (wired through `docusaurus.config.ts` -> `customFields.rpcUrl`). Never
 * put a secret key here — anything in client-side code is public.
 */
export const DEFAULT_RPC_URL = 'https://ethereum-rpc.publicnode.com';

/** The all-zero address — used to fetch pool-wide figures with no user scope. */
export const ZERO_ADDRESS: Address =
  '0x0000000000000000000000000000000000000000';

// One client per RPC URL, created lazily so nothing touches the network at import.
const clientCache = new Map<string, PublicClient>();

function getPublicClient(rpcUrl: string): PublicClient {
  const url = rpcUrl || DEFAULT_RPC_URL;
  let client = clientCache.get(url);
  if (!client) {
    client = createPublicClient({
      chain: mainnet,
      transport: http(url, { batch: true }),
    });
    clientCache.set(url, client);
  }
  return client;
}

/** Pool-wide + (optionally) per-user staking figures from the Convenience contract. */
export interface StakingData {
  /** Annual percentage rate, `1e18 = 100%`. */
  apr: bigint;
  /** Total API3 token supply, as the pool sees it. */
  api3Supply: bigint;
  /** Total API3 currently staked in the pool. */
  totalStake: bigint;
  /** Total pool shares outstanding. */
  totalShares: bigint;
  /** Governable staking target (in API3). */
  stakeTarget: bigint;
  userApi3Balance: bigint;
  userStaked: bigint;
  userUnstaked: bigint;
  userVesting: bigint;
  userUnstakeAmount: bigint;
  userUnstakeShares: bigint;
  userUnstakeScheduledFor: bigint;
  userLocked: bigint;
}

async function readStakingData(
  rpcUrl: string,
  userAddress: Address,
): Promise<StakingData> {
  const result = await getPublicClient(rpcUrl).readContract({
    address: ADDRESSES.convenience,
    abi: convenienceAbi,
    functionName: 'getUserStakingData',
    args: [userAddress],
  });
  const [
    apr,
    api3Supply,
    totalStake,
    totalShares,
    stakeTarget,
    userApi3Balance,
    userStaked,
    userUnstaked,
    userVesting,
    userUnstakeAmount,
    userUnstakeShares,
    userUnstakeScheduledFor,
    userLocked,
  ] = result;
  return {
    apr,
    api3Supply,
    totalStake,
    totalShares,
    stakeTarget,
    userApi3Balance,
    userStaked,
    userUnstaked,
    userVesting,
    userUnstakeAmount,
    userUnstakeShares,
    userUnstakeScheduledFor,
    userLocked,
  };
}

/** Pool-wide staking figures (no user scope). */
export function fetchStakingData(rpcUrl: string): Promise<StakingData> {
  return readStakingData(rpcUrl, ZERO_ADDRESS);
}

export interface EpochInfo {
  /** Current epoch index = floor(blockTimestamp / EPOCH_LENGTH). */
  epochIndex: bigint;
  /** Epoch index in which the pool launched. */
  genesisEpoch: bigint;
  /** Epoch length in seconds (604800 = 1 week). */
  epochLength: bigint;
  /** Annual percentage rate, `1e18 = 100%`. */
  apr: bigint;
}

/** Current epoch index, genesis epoch, epoch length and current APR. */
export async function fetchEpochInfo(rpcUrl: string): Promise<EpochInfo> {
  const client = getPublicClient(rpcUrl);
  const [epochLength, genesisEpoch, block, staking] = await Promise.all([
    client.readContract({
      address: ADDRESSES.pool,
      abi: poolAbi,
      functionName: 'EPOCH_LENGTH',
    }),
    client.readContract({
      address: ADDRESSES.pool,
      abi: poolAbi,
      functionName: 'genesisEpoch',
    }),
    client.getBlock(),
    readStakingData(rpcUrl, ZERO_ADDRESS),
  ]);
  const epochIndex = block.timestamp / epochLength;
  return { epochIndex, genesisEpoch, epochLength, apr: staking.apr };
}

export interface TokenSupply {
  /** Total API3 supply. */
  total: bigint;
  circulating: bigint;
  lockedByGovernance: bigint;
  lockedRewards: bigint;
  lockedVestings: bigint;
  totalLocked: bigint;
}

/** Total / circulating / locked supply breakdowns from the Supply contract. */
export async function fetchTokenSupply(rpcUrl: string): Promise<TokenSupply> {
  const client = getPublicClient(rpcUrl);
  const supply = { address: ADDRESSES.supply, abi: supplyAbi } as const;
  const [
    circulating,
    lockedByGovernance,
    lockedRewards,
    lockedVestings,
    totalLocked,
    staking,
  ] = await Promise.all([
    client.readContract({ ...supply, functionName: 'getCirculatingSupply' }),
    client.readContract({ ...supply, functionName: 'getLockedByGovernance' }),
    client.readContract({ ...supply, functionName: 'getLockedRewards' }),
    client.readContract({ ...supply, functionName: 'getLockedVestings' }),
    client.readContract({ ...supply, functionName: 'getTotalLocked' }),
    readStakingData(rpcUrl, ZERO_ADDRESS),
  ]);
  return {
    total: staking.api3Supply,
    circulating,
    lockedByGovernance,
    lockedRewards,
    lockedVestings,
    totalLocked,
  };
}

export interface UserStake {
  address: Address;
  /** API3 currently staked by the user. */
  staked: bigint;
  /** Pool shares held by the user. */
  shares: bigint;
  /** Voting power held by the user (own + delegated). */
  votingPower: bigint;
  /** Unstaked-but-still-in-pool balance. */
  unstaked: bigint;
  /** Amount locked (cannot yet be withdrawn). */
  locked: bigint;
}

/**
 * Per-user stake, shares and voting power. `address` must already be validated;
 * use {@link normalizeAddress} first.
 */
export async function fetchUserStake(
  rpcUrl: string,
  address: Address,
): Promise<UserStake> {
  const client = getPublicClient(rpcUrl);
  const [staking, shares, votingPower] = await Promise.all([
    readStakingData(rpcUrl, address),
    client.readContract({
      address: ADDRESSES.pool,
      abi: poolAbi,
      functionName: 'userShares',
      args: [address],
    }),
    client.readContract({
      address: ADDRESSES.pool,
      abi: poolAbi,
      functionName: 'userVotingPower',
      args: [address],
    }),
  ]);
  return {
    address,
    staked: staking.userStaked,
    shares,
    votingPower,
    unstaked: staking.userUnstaked,
    locked: staking.userLocked,
  };
}

/**
 * Validate and checksum a user-entered address. Returns the checksummed address
 * or `null` if the input is not a valid Ethereum address.
 */
export function normalizeAddress(input: string): Address | null {
  const trimmed = input.trim();
  if (!isAddress(trimmed)) return null;
  return getAddress(trimmed);
}
