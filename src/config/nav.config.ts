/**
 * Navigation Configuration
 *
 * Defines which pages appear in the site navigation and their display order.
 * Astro handles routing via the filesystem — this only controls nav menus.
 */

export interface NavItem {
  label: string;
  href: string;
  order: number;
}

export const navItems: NavItem[] = [
  { label: 'Features', href: '/features', order: 1 },
  { label: 'Integrations', href: '/integrations', order: 2 },
  { label: 'Ollama CE', href: '/ollama-ce', order: 3 },
  { label: 'Documentation', href: '/docs', order: 4 },
  { label: 'Downloads', href: '/downloads', order: 5 },
  { label: 'About', href: '/about', order: 6 },
  { label: 'Community', href: '/community', order: 7 },
  { label: 'Blog', href: '/blog', order: 8 },
];

/**
 * Get navigation items sorted by order
 */
export function getNavItems(): NavItem[] {
  return [...navItems].sort((a, b) => a.order - b.order);
}
