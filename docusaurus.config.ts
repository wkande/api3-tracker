import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'API3 DAO Tracker',
  tagline: 'Docs & live on-chain dashboard for the API3 DAO',
  favicon: 'img/favicon.ico',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Deployed to GitHub Pages as a project site at wkande/api3-tracker:
  //   https://wkande.github.io/api3-tracker/
  // For a project site, baseUrl must be '/<repo>/' so assets resolve correctly.
  url: 'https://wkande.github.io',
  baseUrl: '/api3-tracker/',

  // Used by `docusaurus deploy` and the GitHub Pages Actions workflow.
  organizationName: 'wkande', // GitHub user/org that owns the repo
  projectName: 'api3-tracker', // repo name
  deploymentBranch: 'gh-pages',

  onBrokenLinks: 'throw',
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  // Build-time configuration exposed to client code via siteConfig.customFields.
  // The RPC URL defaults to a public, no-key endpoint; override at build time with
  // the API3_RPC_URL env var. Never put a secret key here — client code is public.
  customFields: {
    // `||` (not `??`) so an empty env var falls back to the default.
    rpcUrl: process.env.API3_RPC_URL || 'https://ethereum-rpc.publicnode.com',
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          // Drop the "edit this page" links until a real repo URL is set.
          editUrl: undefined,
        },
        // No blog in this phase.
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/docusaurus-social-card.jpg',
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'API3 DAO Tracker',
      logo: {
        alt: 'API3 DAO Tracker',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docsSidebar',
          position: 'left',
          label: 'Docs',
        },
        {to: '/dashboard', label: 'Dashboard', position: 'left'},
        {
          href: 'https://github.com/api3dao/api3-tracker',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {label: 'Introduction', to: '/docs/intro'},
            {label: 'Governance', to: '/docs/governance'},
            {label: 'Contracts', to: '/docs/technical/contracts'},
          ],
        },
        {
          title: 'Live',
          items: [{label: 'Dashboard', to: '/dashboard'}],
        },
        {
          title: 'More',
          items: [
            {label: 'API3 DAO Docs', href: 'https://dao-docs.api3.org/'},
            {label: 'GitHub', href: 'https://github.com/api3dao/api3-tracker'},
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} API3 DAO Tracker. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
