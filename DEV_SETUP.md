# Development Setup Guide

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up the database:**
   ```bash
   npm run setup
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

## Environment Configuration

The app is pre-configured for development with SQLite. For production, update `.env`:

```env
# Production Database (PostgreSQL)
DATABASE_URL="postgresql://user:password@localhost:5432/ai_chat"

# Required API Keys
GEMINI_API_KEY="your_actual_gemini_api_key"
GOOGLE_CLIENT_ID="your_google_oauth_client_id"
GOOGLE_CLIENT_SECRET="your_google_oauth_client_secret"
NEXTAUTH_SECRET="your_secure_random_secret"
```

## Troubleshooting

### Database Issues
If you see 500 errors related to database:
```bash
npx prisma generate
npx prisma db push
```

### Missing API Keys
The app will work in development mode without API keys, but with limited functionality.

### Port Already in Use
Change the port in package.json:
```json
"dev": "next dev -p 3001"
```