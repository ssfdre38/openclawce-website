import { SITE_URL, GOOGLE_SITE_VERIFICATION, BING_SITE_VERIFICATION } from 'astro:env/server';

export interface SiteConfig {
  name: string;
  description: string;
  url: string;
  ogImage: string;
  author: string;
  email: string;
  phone?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  socialLinks: string[];
  twitter?: {
    site: string;
    creator: string;
  };
  verification?: {
    google?: string;
    bing?: string;
  };
  /**
   * Branding configuration
   * Logo files: Replace SVGs in src/assets/branding/
   * Favicon: Replace in public/favicon.svg
   */
  branding: {
    /** Logo alt text for accessibility */
    logo: {
      alt: string;
    };
    /** Favicon path (lives in public/) */
    favicon: {
      svg: string;
    };
    /** Theme colors for manifest and browser UI */
    colors: {
      /** Browser toolbar color (hex) */
      themeColor: string;
      /** PWA splash screen background (hex) */
      backgroundColor: string;
    };
  };
}

const siteConfig: SiteConfig = {
  name: 'OpenClaw CE',
  description: 'OpenClaw Community Edition - Open Source AI Agent Platform for developers building intelligent automation solutions',
  url: SITE_URL || 'https://openclawce.com',
  ogImage: '/og-default.png',
  author: 'OpenClaw CE',
  email: 'hello@openclawce.com',
  socialLinks: [
    'https://github.com/ssfdre38/openclaw-community-edition',
  ],
  verification: {
    google: GOOGLE_SITE_VERIFICATION,
    bing: BING_SITE_VERIFICATION,
  },
  // Branding: Logo files live in src/assets/branding/
  // Replace the SVG files there with your own branding
  branding: {
    logo: {
      alt: 'OpenClaw CE - Open Source AI Agent Platform',
    },
    favicon: {
      svg: '/favicon.svg',
    },
    colors: {
      themeColor: '#3B82F6',
      backgroundColor: '#ffffff',
    },
  },
};

export default siteConfig;
