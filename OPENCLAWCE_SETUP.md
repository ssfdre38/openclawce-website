# OpenClaw CE Website Setup

## ✅ What's Installed

**Location:** `C:\web-sites\openclawce`

**Technology Stack:**
- ✅ Astro 6.0 (latest)
- ✅ Tailwind CSS v4
- ✅ Velocity Theme (57+ components)
- ✅ TypeScript
- ✅ React Islands (optional interactivity)
- ✅ SEO toolkit built-in

## 🚀 Current Status

**Dev Server:** Running on http://localhost:4321 (shellId: velocity_dev)

The browser should be showing the default Velocity theme demo site.

## 📝 Next Steps to Customize for OpenClaw CE

### 1. Update Site Configuration

**File:** `src/config/site.config.ts`

```typescript
{
  name: 'OpenClaw CE',
  description: 'OpenClaw Community Edition - Open Source AI Agent Platform',
  url: 'https://openclawce.com',
  ogImage: '/og-default.png',
  author: 'OpenClaw CE',
  email: 'contact@openclawce.com',
  // Add social links
  socialLinks: [
    'https://github.com/yourusername/openclawce',
  ],
  branding: {
    logo: {
      alt: 'OpenClaw CE',
    },
    colors: {
      themeColor: '#your-brand-color',
      backgroundColor: '#ffffff',
    },
  },
}
```

### 2. Update Branding Assets

**Replace these files:**
- `src/assets/branding/logo-full.svg` - Full logo with text
- `src/assets/branding/logo-symbol.svg` - Icon/symbol only
- `public/favicon.svg` - Browser favicon

### 3. Update Navigation

**File:** `src/config/nav.config.ts`

Update the menu structure to match your site needs:
- Home
- Features
- Documentation
- Downloads
- Community
- etc.

### 4. Create Custom Pages

**Directory:** `src/pages/`

The Velocity theme includes:
- Landing pages
- Blog system
- Documentation templates
- About pages
- Contact forms
- FAQ sections

You can customize or create new pages as needed.

### 5. Update Content

**Directories:**
- `src/content/blog/` - Blog posts (Markdown/MDX)
- `src/content/pages/` - Static pages
- `src/content/authors/` - Author profiles
- `src/content/faqs/` - FAQ items

## 🎨 Design System

Velocity includes a complete design token system:

**Colors:** OKLCH color space for better color consistency
**Typography:** Fluid typography that scales with viewport
**Themes:** Light and dark mode built-in
**Components:** 57 pre-built, accessible components

## 🛠️ Available Commands

```bash
# Development
pnpm dev          # Start dev server (currently running)

# Building
pnpm build        # Production build
pnpm preview      # Preview production build

# Quality
pnpm check        # Type checking
pnpm lint         # ESLint
pnpm format       # Prettier formatting

# Testing
pnpm test         # Unit tests
pnpm test:e2e     # End-to-end tests
```

## 📦 What You Get

### UI Components (31)
- Buttons, badges, cards
- Forms, inputs, selects
- Modals, dialogs, toasts
- Tables, tabs, accordions
- And more...

### Pattern Components (7)
- Contact forms
- Search inputs
- Stat cards
- Newsletter signup
- And more...

### Layout Components
- Header with navigation
- Footer
- Theme toggle (dark/light)
- Analytics integration

### Blog Components
- Article layouts
- Blog cards
- Share buttons
- Related posts
- Author info

### Landing Page Components
- Hero sections
- Feature showcases
- Credibility indicators
- Tech stack displays
- Call-to-action sections

### SEO Components
- Meta tags
- JSON-LD structured data
- Breadcrumbs
- Auto-generated OG images
- Sitemap
- robots.txt

## 🌍 Deployment Options

Velocity is configured for easy deployment to:
- **Netlify** (netlify.toml included)
- **Vercel** (vercel.json included)
- **Cloudflare Pages** (wrangler.toml included)
- **Any static host**

## 📚 Documentation

**Official Velocity Docs:** https://docs.deployvelocity.com
**Astro Docs:** https://docs.astro.build
**Tailwind CSS v4 Docs:** https://tailwindcss.com

## 🎯 Recommended First Steps

1. **Explore the site** - Check out http://localhost:4321 to see all components
2. **Update branding** - Change colors, logos, and site info
3. **Customize navigation** - Update menu structure
4. **Create landing page** - Use existing components to build your home page
5. **Add content** - Create pages for features, downloads, docs, etc.

## 💡 Tips

- All components are fully typed with TypeScript
- Dark mode works automatically
- SEO is optimized out of the box
- Forms include validation
- Images are optimized automatically
- The site is fast by default (Astro Islands architecture)

## 🚨 Environment Variables

Create `.env` file (copy from `.env.example`):

```env
SITE_URL=http://localhost:4321
# Add other env vars as needed
```

## 📖 Structure Overview

```
C:\web-sites\openclawce/
├── src/
│   ├── components/     # All UI components
│   ├── layouts/        # Page layouts
│   ├── pages/          # Your pages (routes)
│   ├── content/        # Markdown/MDX content
│   ├── config/         # Site configuration
│   ├── styles/         # Global styles
│   └── lib/            # Utilities
├── public/             # Static assets
└── astro.config.mjs    # Astro configuration
```

---

**Ready to customize!** The foundation is set, now make it your own! 🚀
