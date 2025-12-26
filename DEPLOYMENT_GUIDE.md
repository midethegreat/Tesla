# Tesla Investment Platform - Deployment Guide

This guide explains how to deploy both the frontend and backend of your Tesla Investment Platform.

## Overview

Your application consists of:
- **Frontend**: Next.js application (React with TypeScript)
- **Backend**: Express.js REST API server

## Part 1: Deploy Backend to Railway (Recommended)

### Step 1: Prepare Your Repository

1. Ensure your project is on GitHub
2. Make sure all code is committed and pushed
3. Create a `.env.production` file in the root (if not already present)

### Step 2: Set Up Railway

1. Go to [https://railway.app](https://railway.app)
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Railway will auto-detect it's a Node.js project

### Step 3: Configure Environment Variables

1. In the Railway project dashboard, go to **Variables**
2. Add these environment variables:

```
PORT=5000
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters
```

3. Railway automatically uses `npm start` (which runs `node server.mjs`)

### Step 4: Deploy

1. Click "Deploy" - Railway will build and deploy automatically
2. Wait for the deployment to complete (usually 2-3 minutes)
3. Copy your backend URL from the Railway dashboard (e.g., `https://my-backend-prod.up.railway.app`)

## Part 2: Deploy Frontend to Vercel

### Step 1: Connect Vercel

1. Go to [https://vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "Add New" → "Project"
4. Import your GitHub repository
5. Framework will auto-detect as "Next.js"

### Step 2: Configure Environment Variables

1. In the Vercel project settings, go to **Environment Variables**
2. Add this variable (replace with your Railway backend URL):

```
NEXT_PUBLIC_API_URL=https://your-backend-url.up.railway.app
```

For example:
```
NEXT_PUBLIC_API_URL=https://tesla-backend-prod.up.railway.app
```

### Step 3: Deploy

1. Click "Deploy"
2. Vercel will build and deploy automatically (usually 1-2 minutes)
3. You'll get a URL like `https://your-app-name.vercel.app`

## Part 3: Verify Communication

Once both are deployed:

1. **Test the frontend**: Open your Vercel URL in a browser
2. **Test registration**: Try to create a new account
3. **Check backend logs**: Go to Railway dashboard → Logs tab to verify requests are received
4. **Test login**: Verify you can log in with the account you created

## Updating Configuration

If you need to change your backend URL later:

1. In Vercel dashboard, go to **Settings** → **Environment Variables**
2. Update `NEXT_PUBLIC_API_URL`
3. Redeploy by pushing to GitHub or clicking "Redeploy" in Vercel

## Troubleshooting

### "Failed to connect to server" Error

This means the frontend can't reach the backend. Check:

1. Backend URL is correct in \`NEXT_PUBLIC_API_URL\`
2. Backend is running and deployed on Railway
3. CORS is enabled on backend (it is - we have `cors()` middleware)
4. No typos in the URL

### Backend Not Receiving Requests

1. Check Railway logs for errors
2. Verify `NEXT_PUBLIC_API_URL` environment variable is set in Vercel
3. Check that the URL includes `https://` (not `http://`)

### Database/Login Issues

1. Backend uses JSON file database (`data/db.json`) which is recreated on each Railway deployment
2. To persist data, consider migrating to a proper database:
   - Railway offers free PostgreSQL
   - Or use Supabase for managed PostgreSQL

## Alternative Deployment Options

### Deploy to Render

1. Go to [https://render.com](https://render.com)
2. Create new **Web Service**
3. Connect GitHub repository
4. Settings:
   - Build command: \`npm install\`
   - Start command: \`npm start\`
5. Add environment variables
6. Deploy

### Deploy to Heroku

1. Install Heroku CLI: \`npm install -g heroku\`
2. \`heroku login\`
3. \`heroku create your-app-name\`
4. \`heroku config:set JWT_SECRET=your-secret-key\`
5. \`git push heroku main\`
6. Get URL: \`heroku apps:info\`

## Database Persistence

Currently, the backend uses a JSON file (`data/db.json`) for data storage. This works but:

- Data is lost when Railway restarts (usually weekly)
- Not suitable for production with concurrent users

To use a persistent database:

1. **Add PostgreSQL on Railway**:
   - In Railway dashboard, click "Add" → "PostgreSQL"
   - Update backend to use PostgreSQL connection string

2. **Or use Supabase**:
   - Create account at [https://supabase.com](https://supabase.com)
   - Get PostgreSQL connection string
   - Update backend database code

## Security Checklist

- [ ] Change JWT_SECRET to a secure random string
- [ ] Use HTTPS URLs (should be automatic with Railway/Vercel)
- [ ] Environment variables not committed to Git
- [ ] CORS properly configured for your domain
- [ ] Add rate limiting for production
- [ ] Consider adding authentication to admin endpoints

## Next Steps

1. Deploy backend to Railway
2. Deploy frontend to Vercel with correct API URL
3. Test end-to-end flow
4. Monitor logs for any issues
5. Plan database migration if needed
6. Set up monitoring/alerts

## Support

If you encounter issues:

1. Check Railway logs for backend errors
2. Check Vercel deployment logs
3. Use browser DevTools → Network tab to see actual API requests
4. Check if API URL matches between environment variables and actual requests
