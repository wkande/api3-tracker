/**
 * Current staking epoch: epoch index, current APR, and the implied per-epoch
 * reward (APR / 52). Reads from the pool via the Convenience contract.
 */
import { useCurrentEpoch } from '@site/src/lib/hooks';
import { EPOCHS_PER_YEAR, formatPercent, toPercentNumber } from '@site/src/lib/format';
import { Card, ErrorBox, Hero, SkeletonRows, StatRow } from './ui';

export default function CurrentEpochCard() {
  const { data, loading, error, refetch } = useCurrentEpoch();

  return (
    <Card title="Current epoch" onRefresh={refetch} refreshing={loading}>
      {/* Skeleton/error only on the initial load; keep content mounted on refresh
          so the card height stays fixed and the page doesn't shift. */}
      {error && !data ? (
        <ErrorBox error={error} />
      ) : !data ? (
        <SkeletonRows rows={3} />
      ) : (
        <>
          <Hero label="Current APR" value={formatPercent(data.apr)} />
          <StatRow label="Epoch index" value={`#${data.epochIndex.toString()}`} />
          <StatRow
            label="Epoch reward (APR / 52)"
            value={`${(toPercentNumber(data.apr) / EPOCHS_PER_YEAR).toFixed(3)}%`}
          />
          <StatRow
            label="Genesis epoch"
            value={`#${data.genesisEpoch.toString()}`}
          />
        </>
      )}
    </Card>
  );
}
