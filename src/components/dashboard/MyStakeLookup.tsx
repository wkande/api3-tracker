/**
 * Look up an arbitrary address's stake, shares and voting power. The address is a
 * plain text input validated (and checksummed) client-side before any RPC call —
 * no wallet connection. Read-only.
 */
import { useState, type FormEvent } from 'react';
import { useStakeLookup } from '@site/src/lib/hooks';
import { formatApi3 } from '@site/src/lib/format';
import { Card, ErrorBox, StatRow, uiStyles } from './ui';
import styles from './MyStakeLookup.module.css';

export default function MyStakeLookup() {
  const [input, setInput] = useState('');
  const { status, data, error, lookup } = useStakeLookup();

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    lookup(input);
  }

  const hasStake = data && (data.staked > 0n || data.shares > 0n);

  return (
    <Card title="Look up an address">
      <form className={styles.form} onSubmit={onSubmit}>
        <input
          className={styles.input}
          type="text"
          inputMode="text"
          autoComplete="off"
          spellCheck={false}
          placeholder="0x… Ethereum address"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          aria-label="Ethereum address"
        />
        <button
          className={styles.button}
          type="submit"
          disabled={status === 'loading' || input.trim().length === 0}
        >
          {status === 'loading' ? 'Looking up…' : 'Look up'}
        </button>
      </form>

      {status === 'invalid' && (
        <p className={uiStyles.note} role="alert">
          That doesn’t look like a valid Ethereum address.
        </p>
      )}

      {status === 'error' && error && <ErrorBox error={error} />}

      {status === 'success' && data && (
        <>
          <p className={uiStyles.note}>
            {data.address.slice(0, 6)}…{data.address.slice(-4)}
          </p>
          {hasStake ? (
            <>
              <StatRow label="Staked" value={`${formatApi3(data.staked)} API3`} />
              <StatRow label="Pool shares" value={formatApi3(data.shares)} />
              <StatRow
                label="Voting power"
                value={`${formatApi3(data.votingPower)}`}
              />
              <StatRow label="Unstaked (in pool)" value={`${formatApi3(data.unstaked)} API3`} />
              <StatRow label="Locked" value={`${formatApi3(data.locked)} API3`} />
            </>
          ) : (
            <p className={uiStyles.note}>
              No stake found for this address in the API3 pool.
            </p>
          )}
        </>
      )}
    </Card>
  );
}
