/**
 * API3 token supply breakdown from the Supply contract: total and circulating
 * supply, plus tokens locked by governance, locked as pending rewards, and locked
 * in vestings.
 */
import { useTokenSupply } from '@site/src/lib/hooks';
import { formatApi3 } from '@site/src/lib/format';
import { Card, ErrorBox, Hero, SkeletonRows, StatRow } from './ui';

export default function TokenSupplyCard() {
  const { data, loading, error, refetch } = useTokenSupply();

  return (
    <Card title="Token supply" onRefresh={refetch} refreshing={loading}>
      {/* Skeleton/error only on the initial load; keep content mounted on refresh
          so the card height stays fixed and the page doesn't shift. */}
      {error && !data ? (
        <ErrorBox error={error} />
      ) : !data ? (
        <SkeletonRows rows={4} />
      ) : (
        <>
          <Hero label="Total supply (API3)" value={formatApi3(data.total, 0)} />
          <StatRow label="Circulating" value={`${formatApi3(data.circulating, 0)} API3`} />
          <StatRow
            label="Locked by governance"
            value={`${formatApi3(data.lockedByGovernance, 0)} API3`}
          />
          <StatRow
            label="Locked rewards"
            value={`${formatApi3(data.lockedRewards, 0)} API3`}
          />
          <StatRow
            label="Locked vestings"
            value={`${formatApi3(data.lockedVestings, 0)} API3`}
          />
        </>
      )}
    </Card>
  );
}
