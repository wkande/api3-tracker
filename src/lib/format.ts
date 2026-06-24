/**
 * Formatting helpers for on-chain values. All API3 token amounts are 18-decimal
 * fixed-point bigints; all percentages from the pool use the convention
 * `1e18 = 100%`.
 */
import { formatUnits } from 'viem';

const API3_DECIMALS = 18;

/** 1e18 = 100% per the pool's StateUtils convention. */
const HUNDRED_PERCENT = 10n ** 18n;

/** Epochs per year — used to derive a per-epoch reward from the annual APR. */
export const EPOCHS_PER_YEAR = 52;

/**
 * Format an 18-decimal API3 amount as a human-readable token figure, e.g.
 * `formatApi3(1234567890000000000000n)` -> "1,234.57".
 */
export function formatApi3(value: bigint, maximumFractionDigits = 2): string {
  const asNumber = Number(formatUnits(value, API3_DECIMALS));
  return asNumber.toLocaleString('en-US', { maximumFractionDigits });
}

/** Format an 18-decimal amount as a compact figure, e.g. "12.3M". */
export function formatApi3Compact(value: bigint): string {
  const asNumber = Number(formatUnits(value, API3_DECIMALS));
  return asNumber.toLocaleString('en-US', {
    notation: 'compact',
    maximumFractionDigits: 2,
  });
}

/**
 * Convert a `1e18 = 100%` value to a percentage number (not string).
 * e.g. `2.5e17` -> 25.
 */
export function toPercentNumber(value: bigint): number {
  // Scale by 1e6 before dividing to retain precision, then back down.
  return Number((value * 1_000_000n) / HUNDRED_PERCENT) / 1_000_000 * 100;
}

/** Format a `1e18 = 100%` value as a percent string, e.g. "25.00%". */
export function formatPercent(value: bigint, maximumFractionDigits = 2): string {
  return `${toPercentNumber(value).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits,
  })}%`;
}

/** Ratio of two 18-decimal amounts as a percent number (e.g. staked / target). */
export function ratioPercent(numerator: bigint, denominator: bigint): number {
  if (denominator === 0n) return 0;
  return Number((numerator * 1_000_000n) / denominator) / 1_000_000 * 100;
}
