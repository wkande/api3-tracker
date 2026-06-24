/**
 * Pool staking totals. The pool's stake target is a *percentage of total supply*
 * (`1e18 = 100%`), not a token amount: the contract compares
 * `totalStake * 100% / totalSupply` against `stakeTarget` each epoch and raises APR
 * when below target / lowers it when above. We mirror that comparison here.
 */
import clsx from 'clsx';
import { useStakingStats } from '@site/src/lib/hooks';
import { formatApi3, ratioPercent, toPercentNumber } from '@site/src/lib/format';
import { Card, ErrorBox, Hero, SkeletonRows, StatRow, uiStyles } from './ui';

export default function StakingStatsCard() {
  const { data, loading, error, refetch } = useStakingStats();

  // Staked share of total supply vs. the target share.
  const stakedShare = data ? ratioPercent(data.totalStake, data.api3Supply) : 0;
  const targetShare = data ? toPercentNumber(data.stakeTarget) : 0;
  const targetMet = stakedShare >= targetShare;
  const progress = targetShare > 0 ? (stakedShare / targetShare) * 100 : 0;
  const fillWidth = `${Math.min(progress, 100).toFixed(1)}%`;

  return (
    <Card title="Staking" onRefresh={refetch} refreshing={loading}>
      {error ? (
        <ErrorBox error={error} />
      ) : loading || !data ? (
        <SkeletonRows rows={4} />
      ) : (
        <>
          <Hero label="Total staked (API3)" value={formatApi3(data.totalStake, 0)} />
          <StatRow
            label="Staked share of supply"
            value={
              <>
                {stakedShare.toFixed(2)}%{' '}
                <span
                  className={clsx(
                    uiStyles.badge,
                    targetMet ? uiStyles.badgeMet : uiStyles.badgeBelow,
                  )}
                >
                  {targetMet ? 'Target met' : 'Below target'}
                </span>
              </>
            }
          />
          <StatRow label="Stake target" value={`${targetShare.toFixed(2)}% of supply`} />
          <div
            className={uiStyles.targetBar}
            role="progressbar"
            aria-valuenow={Math.round(progress)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Progress toward stake target"
          >
            <span className={uiStyles.targetBarFill} style={{ width: fillWidth }} />
          </div>
          <p className={uiStyles.note}>
            {targetMet
              ? 'Staked supply is at or above target, so APR trends downward each epoch toward the target.'
              : 'Staked supply is below target, so APR increases each epoch until the target is met.'}
          </p>
        </>
      )}
    </Card>
  );
}
