import type { ReactNode } from "react";
import clsx from "clsx";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import Heading from "@theme/Heading";

import styles from "./index.module.css";

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx("hero hero--primary", styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link className="button button--secondary button--lg" to="/dashboard">
            Live dashboard →
          </Link>
          <Link
            className="button button--outline button--secondary button--lg"
            to="/docs/intro"
            style={{ marginLeft: "0.75rem" }}
          >
            Read the docs
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home(): ReactNode {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={siteConfig.title}
      description="Documentation and a live on-chain dashboard for the Api3 DAO staking pool."
    >
      <HomepageHeader />
      <main className="container margin-vert--xl">
        <div className="row">
          <div className="col col--6 margin-bottom--lg">
            <Heading as="h2">Documentation</Heading>
            <p>
              Reference for the Api3 DAO: governance, staking, rewards, voting
              and the on-chain contracts behind it all.
            </p>
            <Link to="/docs/intro">Start reading →</Link>
          </div>
          <div className="col col--6 margin-bottom--lg">
            <Heading as="h2">Live dashboard</Heading>
            <p>
              Current epoch, APR, total staked, token supply and a per-address
              stake lookup — read straight from Ethereum mainnet, no wallet
              required.
            </p>
            <Link to="/dashboard">Open the dashboard →</Link>
          </div>
        </div>
      </main>
    </Layout>
  );
}
