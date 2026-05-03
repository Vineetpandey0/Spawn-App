# Spawn.dev - AI Application Builder



**Spawn.dev** is a powerful, AI-orchestrated runtime engine that generates fully functional, professionally designed web applications dynamically. Using natural language prompts, the platform leverages the Google Gemini API to structure data and instantly deploy specialized, interactive app templates ranging from SaaS Dashboards and E-commerce Stores to Social Feeds and Job Boards.

No coding required. Just prompt, preview, and deploy.

---

## Table of Contents

1. [Features](#features)
2. [How It Works](#how-it-works)
3. [Supported App Templates](#supported-app-templates)
4. [Getting Started (Local Development)](#getting-started-local-development)
5. [Using the App](#using-the-app)
   - [Providing Your Gemini API Key](#providing-your-gemini-api-key)
   - [Generating an App](#generating-an-app)
6. [Configuration Examples](#configuration-examples)
7. [Upcoming Features](#upcoming-features)
8. [Architecture Overview](#architecture-overview)

---

## Features

- ✨ **Natural Language to App:** Describe your idea in plain English and watch it generate in seconds.
- 🎨 **10+ Premium Templates:** Dynamically renders professional, highly aesthetic layouts tailored to your domain.
- 🔑 **Bring Your Own Key (BYOK):** Seamlessly input your personal Gemini API key directly from the UI to bypass platform rate limits.
- 💾 **Intelligent Caching:** Generated layouts and data are cached in a local database, saving tokens on subsequent visits.
- 📱 **Fully Responsive:** All generated applications are optimized for desktop, tablet, and mobile browsers.
- 🔐 **Authentication Ready:** Integrated securely with Clerk for robust user management.

---

## How It Works

1. **Prompt Engineering:** The user enters a natural language prompt describing their desired app (e.g., *"Create a real estate discovery platform for luxury homes in Miami"*).
2. **AI Orchestration:** The backend queries Google Gemini (using the user's provided API key or a fallback key) to output a strictly typed JSON configuration map.
3. **Dynamic Registry:** The JSON schema determines the required pages (e.g., `/home`, `/listings`, `/dashboard`) and assigns them a UI `type` based on the intent.
4. **Runtime Rendering:** The `AppRenderer` intercepts the route, matches the `type` against the internal Component Registry, and renders the specific Next.js template pre-populated with AI-generated mock data.

---

## Supported App Templates

Our runtime engine dynamically injects one of the following premium components depending on the user's intent:

- `SaaSDashboard`: B2B metrics, charts, and data tables.
- `EcommerceStore`: Product grids, shopping carts, and checkout flows.
- `SocialFeed`: Infinite scrolling timelines and post interactions.
- `JobBoard`: Job listings, filtering, and application modals.
- `CollegeDiscovery`: Educational institution directories and ranking grids.
- `RealEstateExplorer`: Property maps, image galleries, and pricing details.
- `BookingSystem`: Service reservations, calendars, and availability slots.
- `EventTicketing`: Neon-themed concert/event timelines and ticket purchases.
- `BlogPlatform`: Clean typography, rich-text reader views, and author bios.
- `PortfolioGallery`: Minimalist masonry grids for photographers and designers.

---

## Getting Started (Local Development)

### Prerequisites
- Node.js (v18.x or later)
- PostgreSQL Database
- Clerk API Keys
- Google Gemini API Key

### 1. Clone & Install
```bash
git clone https://github.com/Vineetpandey0/App-Builder.git
cd App-Builder
npm install
```

### 2. Environment Variables
Create a `.env` file in the root directory and populate it with your credentials:
```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/spawn_dev"

# Authentication (Clerk)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# AI Configuration (Fallback)
GOOGLE_API_KEY="AIzaSy..."
```

### 3. Database Migration
Initialize the Prisma schema:
```bash
npx prisma db push
```

### 4. Run Development Server
```bash
npm run dev
```
Visit `http://localhost:3000` to access the builder platform.

---

## Using the App

### Providing Your Gemini API Key
To ensure fast generations and avoid platform rate limits, users can provide their own Gemini API key:
1. Log in to the application.
2. Click on your **User Avatar** in the top right corner of the Top Navigation Bar.
3. In the dropdown, paste your API key into the **Gemini API Key** input field.
4. The key is automatically saved securely to your browser cookies and will be used for all future AI generations.

### Generating an App
1. Navigate to the **New App** dashboard.
2. Type your application concept into the main prompt box.
3. Click generate. The engine will communicate with Gemini, structure your database, and redirect you to the live preview window (`/apps/[appId]`).
4. Navigate through the generated pages using the top bar of your newly spawned app!

---

## Configuration Examples

Behind the scenes, `spawn.dev` uses a strictly defined JSON structure to orchestrate routing. If you wish to build an app manually via API or database injection, follow this structure:

```json
{
  "name": "Luxury Miami Real Estate",
  "pages": [
    {
      "path": "/home",
      "type": "landing",
      "entity": "website"
    },
    {
      "path": "/properties",
      "type": "real_estate",
      "entity": "listings"
    },
    {
      "path": "/admin",
      "type": "saas_dashboard",
      "entity": "user"
    }
  ]
}
```
*Note: The `type` property must exactly match a key inside `src/lib/runtime/componentRegistry.ts`.*

---

## Upcoming Features

We are constantly evolving the `spawn.dev` engine. Our upcoming roadmap includes:

- 🚀 **Autonomous Deployment:** One-click seamless deployment of your generated apps directly to Vercel or Netlify via API integration.
- 📦 **GitHub Repository Export:** Export your generated JSON, dynamic templates, and Next.js boilerplate directly to a new GitHub repository on your account.
- 🧩 **Custom Component Injection:** Upload your own React components to the engine registry to create bespoke template sets.
- 🔄 **Persistent State Management:** Moving beyond static mock data by hooking generated apps up to live PostgreSQL instances automatically.
- 🎨 **Theme Customization:** Exposing color palettes, fonts, and border radii settings to the user via an intuitive design side-panel.

---

## Architecture Overview

- **Frontend:** Next.js 14 App Router, React, Tailwind CSS, Shadcn UI
- **Backend:** Next.js Route Handlers, Server Components
- **AI Integration:** `@google/genai` (Gemini 2.5 Flash)
- **Database:** PostgreSQL accessed via Prisma ORM
- **Authentication:** Clerk

Built with ❤️ by the spawn.dev team.
