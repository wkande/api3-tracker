import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const sidebars: SidebarsConfig = {
  docsSidebar: [
    "intro",
    "prompt",
    "governance",
    "staking",
    "rewards",
    "voting",
    {
      type: "category",
      label: "Technical",
      items: [
        "technical/contracts",
        "technical/pool",
        "technical/dashboard-attributes",
        "technical/distribution",
      ],
    },
    {
      type: "link",
      label: "Live dashboard",
      href: "/dashboard",
    },
  ],
};

export default sidebars;
