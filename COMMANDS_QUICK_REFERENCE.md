# Shopify App Commands - Quick Reference

## 🚀 Initial Setup

```bash
# Install Shopify CLI
npm install -g @shopify/cli @shopify/theme

# Login to Shopify
shopify auth login

# Create new app
shopify app generate

# Install dependencies
npm install

# Start development server
shopify app dev
```

## 📦 Project Management

```bash
# Generate extension
shopify app generate extension

# Generate theme extension
shopify app generate extension --type=theme

# Generate function
shopify app generate function

# Generate webhook
shopify app generate webhook

# Generate route
shopify app generate route

# Generate page
shopify app generate page

# Generate component
shopify app generate component
```

## 🏗️ Build & Deploy

```bash
# Build app
shopify app build

# Deploy app
shopify app deploy

# Deploy to specific environment
shopify app deploy --environment=production

# Build for production
npm run build
```

## 🔍 App Management

```bash
# List apps
shopify app list

# Get app info
shopify app info

# Open app
shopify app open

# View logs
shopify app logs

# Validate app
shopify app validate
```

## 🧪 Testing & Development

```bash
# Run tests
npm test

# Run linter
npm run lint

# Run in debug mode
DEBUG=* shopify app dev

# Test GraphQL query
shopify app query "query { shop { name } }"
```

## 🎨 Theme Development (if needed)

```bash
# Pull theme
shopify theme pull

# Push theme
shopify theme push

# Watch theme changes
shopify theme dev

# List themes
shopify theme list
```

## 🔗 Webhooks

```bash
# Create webhook
shopify webhook create

# List webhooks
shopify webhook list

# Delete webhook
shopify webhook delete
```

## 📝 Git Commands

```bash
# Initialize repository
git init

# Add files
git add .

# Commit
git commit -m "message"

# Push to remote
git push origin main
```

## 🗄️ Database (if using)

```bash
# Run migrations
npm run migrate

# Seed database
npm run seed

# Reset database
npm run db:reset
```
