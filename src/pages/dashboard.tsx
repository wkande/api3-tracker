import Layout from '@theme/Layout';
import CurrentEpochCard from '@site/src/components/dashboard/CurrentEpochCard';
import StakingStatsCard from '@site/src/components/dashboard/StakingStatsCard';
import TokenSupplyCard from '@site/src/components/dashboard/TokenSupplyCard';
import MyStakeLookup from '@site/src/components/dashboard/MyStakeLookup';
import styles from './dashboard.module.css';

export default function Dashboard() {
  return (
    <Layout
      title="Live dashboard"
      description="Live on-chain state of the API3 DAO staking pool, read directly from Ethereum mainnet."
    >
      <main className="container margin-vert--lg">
        <header className={styles.intro}>
          <h1>API3 DAO live dashboard</h1>
          <p>
            Current on-chain state of the API3 staking pool, read directly from
            Ethereum mainnet in your browser. No wallet connection — enter any
            address to look up its stake. Figures update when you refresh.
          </p>
        </header>

        <div className={styles.grid}>
          <CurrentEpochCard />
          <StakingStatsCard />
          <TokenSupplyCard />
          <div className={styles.wide}>
            <MyStakeLookup />
          </div>
        </div>
      </main>
    </Layout>
  );
}
