# AI Chat Application Setup

This AI chat application is now configured with Gemini AI and Google OAuth authentication.

## Features

- ✅ **Gemini AI Integration**: Powered by Google's Gemini AI model
- ✅ **Google OAuth Authentication**: Secure sign-in with Google accounts
- ✅ **Rate Limiting**: Anonymous users get 3 free messages per day
- ✅ **Unlimited Access**: Authenticated users have unlimited conversations
- ✅ **Real-time Chat**: Responsive chat interface with typing indicators
- ✅ **Session Management**: Persistent chat sessions with smart titles

## Quick Setup

1. **Install dependencies and setup database:**
   ```bash
   cd ai-chat
   npm run setup
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Configuration Details

### Environment Variables

The following environment variables have been configured in `.env`:

```env
# Database
DATABASE_URL=postgresql://...

# Gemini AI API
GEMINI_API_KEY=AIzaSyCJfX98EXL9WDu68jMaL0D_4GrU1AA7u1E

# Google OAuth
GOOGLE_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.com
GOOGLE_CLIENT_SECRET=vvvvvvvvvvvvvvvvv
# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=a-very-xxxxxxxxxxxxxxxning

# Rate Limiting
ANONYMOUS_REQUEST_LIMIT=3
```

### Database Schema

The application uses PostgreSQL with the following key tables:
- `User` - User accounts and profiles
- `Account` - OAuth account linking
- `Session` - NextAuth sessions
- `ChatSession` - Chat conversation sessions
- `Message` - Individual chat messages
- `AnonymousRequest` - Rate limiting for anonymous users

### Authentication Flow

1. **Anonymous Users**: Can send up to 3 messages per day
2. **Authenticated Users**: Unlimited messages after signing in with Google
3. **Rate Limiting**: Based on IP address for anonymous users
4. **Session Persistence**: Chat sessions are saved and can be resumed

## Manual Setup (Alternative)

If you prefer to set up manually:

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Generate Prisma client:**
   ```bash
   npx prisma generate
   ```

3. **Push database schema:**
   ```bash
   npx prisma db push
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

## Production Deployment

For production deployment:

1. **Update environment variables:**
   - Set `NEXTAUTH_URL` to your production domain
   - Generate a secure `NEXTAUTH_SECRET`
   - Update database URL for production

2. **Build the application:**
   ```bash
   npm run build
   ```

3. **Start production server:**
   ```bash
   npm start
   ```

## Troubleshooting

### Common Issues

1. **Database Connection Error:**
   - Verify your `DATABASE_URL` is correct
   - Ensure your database is running and accessible

2. **Gemini API Error:**
   - Check that your `GEMINI_API_KEY` is valid
   - Verify API quotas and billing in Google Cloud Console

3. **OAuth Error:**
   - Ensure your Google OAuth credentials are correct
   - Check that your redirect URIs are configured in Google Cloud Console

4. **Rate Limiting Issues:**
   - Anonymous users are limited to 3 messages per day
   - Sign in with Google for unlimited access

### Support

If you encounter any issues, check the browser console and server logs for detailed error messages.