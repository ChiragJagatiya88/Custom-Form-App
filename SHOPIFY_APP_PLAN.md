# Shopify App Development Plan

## Overview
This document outlines the complete plan and commands for building a Shopify app.

## Technology Stack Options

### Option 1: Shopify CLI + Node.js/Express (Recommended)
- **Backend**: Node.js with Express
- **Frontend**: React/Next.js
- **Database**: PostgreSQL or MongoDB
- **Authentication**: Shopify OAuth

### Option 2: Shopify CLI + Ruby on Rails
- **Backend**: Ruby on Rails
- **Frontend**: Embedded app with React
- **Database**: PostgreSQL

### Option 3: Shopify CLI + PHP
- **Backend**: PHP with Laravel
- **Frontend**: React/Vue.js
- **Database**: MySQL/PostgreSQL

---

## Prerequisites & Initial Setup Commands

### 1. Install Required Tools
```bash
# Install Node.js (if not installed)
# Download from: https://nodejs.org/

# Install Shopify CLI
npm install -g @shopify/cli @shopify/theme

# Verify installation
shopify version

# Login to Shopify
shopify auth login

# Or login to specific partner account
shopify auth login --store=your-store.myshopify.com
```

### 2. Create Shopify Partner Account
- Go to: https://partners.shopify.com/
- Create account and create a new app

---

## Project Setup Commands

### Option A: Using Shopify CLI (Recommended)

```bash
# Create new Shopify app
shopify app generate

# Follow prompts:
# - Choose app template (Node.js, Ruby, PHP)
# - Enter app name
# - Select app type (public, custom, or theme app extension)

# Navigate to project directory
cd your-app-name

# Install dependencies
npm install
# OR
yarn install

# Start development server
shopify app dev

# Open app in browser (will auto-open)
# Or manually: https://your-app-url.ngrok.io
```

### Option B: Manual Setup

```bash
# Initialize Node.js project
npm init -y

# Install Shopify dependencies
npm install @shopify/shopify-api
npm install express
npm install dotenv
npm install --save-dev @shopify/cli

# Install React (if using frontend)
npm install react react-dom
npm install --save-dev @vitejs/plugin-react vite

# Create project structure
mkdir -p src/{routes,controllers,models,middleware}
mkdir -p public
mkdir -p config
```

---

## Development Commands

### Daily Development Workflow

```bash
# Start development server (with ngrok tunnel)
shopify app dev

# Run in specific port
shopify app dev --port=3000

# Generate app extension
shopify app generate extension

# Generate theme app extension
shopify app generate extension --type=theme

# Generate function (backendless function)
shopify app generate function

# Generate webhook
shopify app generate webhook

# Generate API route
shopify app generate route

# Generate page
shopify app generate page

# Generate component
shopify app generate component
```

### Testing Commands

```bash
# Run tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run linter
npm run lint

# Run type checking (TypeScript)
npm run type-check

# Run all checks
npm run check
```

### Database Commands

```bash
# Run migrations (if using database)
npm run migrate

# Rollback migrations
npm run rollback

# Seed database
npm run seed

# Reset database
npm run db:reset
```

---

## Shopify-Specific Commands

### App Management

```bash
# List all apps
shopify app list

# Get app info
shopify app info

# Open app in browser
shopify app open

# Deploy app
shopify app deploy

# Deploy to specific environment
shopify app deploy --reset

# View app logs
shopify app logs

# Generate app URL
shopify app generate url
```

### Theme Development (if needed)

```bash
# Pull theme
shopify theme pull

# Push theme changes
shopify theme push

# Watch for changes
shopify theme dev

# List themes
shopify theme list

# Open theme editor
shopify theme open
```

### Webhook Management

```bash
# Register webhook
shopify webhook create

# List webhooks
shopify webhook list

# Delete webhook
shopify webhook delete
```

---

## Build & Deployment Commands

### Build Commands

```bash
# Build for production
npm run build

# Build app extensions
shopify app build

# Build specific extension
shopify app build --only=extension-name

# Preview build
npm run preview
```

### Deployment Commands

```bash
# Deploy to Shopify
shopify app deploy

# Deploy with version
shopify app deploy --version=1.0.0

# Deploy to staging
shopify app deploy --environment=staging

# Deploy to production
shopify app deploy --environment=production

# Verify deployment
shopify app info
```

---

## Environment Setup Commands

### Environment Variables

```bash
# Create .env file
touch .env

# Add to .env:
# SHOPIFY_API_KEY=your_api_key
# SHOPIFY_API_SECRET=your_api_secret
# SCOPES=read_products,write_products
# HOST=your-app-url.ngrok.io
# DATABASE_URL=your_database_url
```

### Git Commands

```bash
# Initialize git repository
git init

# Create .gitignore
echo "node_modules/
.env
.DS_Store
dist/
build/" > .gitignore

# Add files
git add .

# Commit
git commit -m "Initial commit"

# Create GitHub repository and push
git remote add origin https://github.com/yourusername/your-app.git
git push -u origin main
```

---

## Common Development Tasks Commands

### API Development

```bash
# Test GraphQL query
shopify app query "query { shop { name } }"

# Test REST API
curl -X GET "https://your-store.myshopify.com/admin/api/2024-01/products.json" \
  -H "X-Shopify-Access-Token: your_token"

# Generate GraphQL types
npm run generate:types
```

### Database Operations

```bash
# Connect to database
psql your_database_name

# Run SQL migrations
psql -d your_database -f migrations/001_initial.sql

# Backup database
pg_dump your_database > backup.sql
```

---

## Project Structure

```
your-app/
├── app/                    # Main app code
│   ├── api/               # API routes
│   ├── components/        # React components
│   ├── pages/             # App pages
│   └── utilities/         # Helper functions
├── extensions/            # App extensions
│   ├── theme-app-extension/
│   └── function/
├── web/                   # Web frontend
├── config/                # Configuration files
├── .env                   # Environment variables
├── .gitignore
├── package.json
├── shopify.app.toml       # Shopify app config
└── README.md
```

---

## Key Shopify API Commands

### GraphQL Admin API

```bash
# Example: Get products
shopify app query "
  query {
    products(first: 10) {
      edges {
        node {
          id
          title
          priceRange {
            minVariantPrice {
              amount
            }
          }
        }
      }
    }
  }
"

# Example: Create product
shopify app query "
  mutation productCreate($input: ProductInput!) {
    productCreate(input: $input) {
      product {
        id
        title
      }
    }
  }
" --variables='{"input": {"title": "New Product"}}'
```

---

## Testing & Debugging Commands

```bash
# Run in debug mode
DEBUG=* shopify app dev

# Check app configuration
shopify app info

# Validate app
shopify app validate

# Check for errors
shopify app check

# View app logs
shopify app logs --follow

# Test webhooks locally
shopify app dev --webhook-port=3001
```

---

## Useful NPM Scripts (package.json)

```json
{
  "scripts": {
    "dev": "shopify app dev",
    "build": "shopify app build",
    "deploy": "shopify app deploy",
    "test": "jest",
    "lint": "eslint .",
    "type-check": "tsc --noEmit",
    "check": "npm run lint && npm run type-check && npm test"
  }
}
```

---

## Next Steps

1. **Choose your tech stack** (Node.js recommended)
2. **Run initial setup commands**
3. **Create your app using Shopify CLI**
4. **Set up environment variables**
5. **Start development server**
6. **Build your app features**
7. **Test thoroughly**
8. **Deploy to Shopify**

---

## Resources

- Shopify CLI Docs: https://shopify.dev/docs/apps/tools/cli
- Shopify App Development: https://shopify.dev/docs/apps
- Shopify API Reference: https://shopify.dev/docs/api
- Partner Dashboard: https://partners.shopify.com/

---

## Quick Start Checklist

- [ ] Install Node.js
- [ ] Install Shopify CLI: `npm install -g @shopify/cli`
- [ ] Login: `shopify auth login`
- [ ] Create app: `shopify app generate`
- [ ] Install dependencies: `npm install`
- [ ] Start dev server: `shopify app dev`
- [ ] Configure .env file
- [ ] Build first feature
- [ ] Test app
- [ ] Deploy: `shopify app deploy`
