/**
 * React data hooks for the dashboard. Components consume these and never touch
 * viem directly — this is the seam where a future API-backed data source could be
 * swapped in without changing any component.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {
  DEFAULT_RPC_URL,
  fetchEpochInfo,
  fetchStakingData,
  fetchTokenSupply,
  fetchUserStake,
  normalizeAddress,
  type EpochInfo,
  type StakingData,
  type TokenSupply,
  type UserStake,
} from './chain';

/** Read the build-time RPC URL from Docusaurus customFields, with a fallback. */
function useRpcUrl(): string {
  const { siteConfig } = useDocusaurusContext();
  const url = siteConfig.customFields?.rpcUrl;
  return typeof url === 'string' && url.length > 0 ? url : DEFAULT_RPC_URL;
}

export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

/**
 * Run an async fetch on mount and on demand, tracking loading/error state and
 * guarding against state updates after unmount or out-of-order responses.
 */
function useAsync<T>(fetcher: (rpcUrl: string) => Promise<T>): AsyncState<T> {
  const rpcUrl = useRpcUrl();
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Bumped on each run; only the latest run is allowed to commit results.
  const runId = useRef(0);
  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const run = useCallback(() => {
    const id = ++runId.current;
    setLoading(true);
    setError(null);
    fetcher(rpcUrl)
      .then((result) => {
        if (!mounted.current || id !== runId.current) return;
        setData(result);
        setLoading(false);
      })
      .catch((err: unknown) => {
        if (!mounted.current || id !== runId.current) return;
        setError(err instanceof Error ? err : new Error(String(err)));
        setLoading(false);
      });
  }, [fetcher, rpcUrl]);

  useEffect(() => {
    run();
  }, [run]);

  return { data, loading, error, refetch: run };
}

export function useCurrentEpoch(): AsyncState<EpochInfo> {
  return useAsync(fetchEpochInfo);
}

export function useStakingStats(): AsyncState<StakingData> {
  return useAsync(fetchStakingData);
}

export function useTokenSupply(): AsyncState<TokenSupply> {
  return useAsync(fetchTokenSupply);
}

export type StakeLookupStatus =
  | 'idle'
  | 'invalid'
  | 'loading'
  | 'success'
  | 'error';

export interface StakeLookupState {
  status: StakeLookupStatus;
  data: UserStake | null;
  error: Error | null;
  /** Validate `input`, then fetch. Sets status to `invalid` for bad addresses. */
  lookup: (input: string) => void;
  reset: () => void;
}

/**
 * On-demand per-address lookup. Unlike the cards above this does not auto-fetch;
 * the component drives it via `lookup(address)`.
 */
export function useStakeLookup(): StakeLookupState {
  const rpcUrl = useRpcUrl();
  const [status, setStatus] = useState<StakeLookupStatus>('idle');
  const [data, setData] = useState<UserStake | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const runId = useRef(0);

  const lookup = useCallback(
    (input: string) => {
      const address = normalizeAddress(input);
      if (!address) {
        setStatus('invalid');
        setData(null);
        setError(null);
        return;
      }
      const id = ++runId.current;
      setStatus('loading');
      setError(null);
      fetchUserStake(rpcUrl, address)
        .then((result) => {
          if (id !== runId.current) return;
          setData(result);
          setStatus('success');
        })
        .catch((err: unknown) => {
          if (id !== runId.current) return;
          setError(err instanceof Error ? err : new Error(String(err)));
          setStatus('error');
        });
    },
    [rpcUrl],
  );

  const reset = useCallback(() => {
    runId.current++;
    setStatus('idle');
    setData(null);
    setError(null);
  }, []);

  return { status, data, error, lookup, reset };
}
