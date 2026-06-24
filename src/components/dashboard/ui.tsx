/**
 * Shared presentational primitives for the dashboard cards: the card shell with a
 * refresh control, stat rows, loading skeletons and an inline error box. Kept here
 * (alongside the cards) so every card renders loading / error / refresh
 * consistently per the spec.
 */
import type { ReactNode } from 'react';
import clsx from 'clsx';
import styles from './ui.module.css';

export function Card({
  title,
  onRefresh,
  refreshing,
  children,
}: {
  title: string;
  onRefresh?: () => void;
  refreshing?: boolean;
  children: ReactNode;
}) {
  return (
    <section className={styles.card}>
      <header className={styles.cardHeader}>
        <h3 className={styles.cardTitle}>{title}</h3>
        {onRefresh && (
          <button
            type="button"
            className={styles.refreshButton}
            onClick={onRefresh}
            disabled={refreshing}
            aria-label={`Refresh ${title}`}
            title="Refresh"
          >
            <span className={clsx(refreshing && styles.spinning)} aria-hidden>
              ↻
            </span>
          </button>
        )}
      </header>
      {children}
    </section>
  );
}

export function StatRow({
  label,
  value,
}: {
  label: ReactNode;
  value: ReactNode;
}) {
  return (
    <div className={styles.statRow}>
      <span className={styles.statLabel}>{label}</span>
      <span className={styles.statValue}>{value}</span>
    </div>
  );
}

export function Hero({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div>
      <div className={styles.heroLabel}>{label}</div>
      <div className={styles.hero}>{value}</div>
    </div>
  );
}

/** A single shimmering placeholder line. `width` is any CSS length. */
export function Skeleton({ width = '100%' }: { width?: string }) {
  return <div className={styles.skeleton} style={{ width }} aria-hidden />;
}

export function SkeletonRows({ rows = 3 }: { rows?: number }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} width={`${90 - i * 12}%`} />
      ))}
    </div>
  );
}

export function ErrorBox({ error }: { error: Error }) {
  return (
    <div className={styles.error} role="alert">
      <div className={styles.errorTitle}>Couldn’t load on-chain data</div>
      <div>
        {error.message || 'The RPC request failed.'} Try refreshing — if it keeps
        failing the RPC endpoint may be rate-limited or unreachable.
      </div>
    </div>
  );
}

export { styles as uiStyles };
