# Quick Deployment Instructions

## What You Need to Do

### 1. Deploy Backend to Railway (5 minutes)

1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Create new project → Connect your GitHub repo
4. Railway auto-detects Node.js and builds automatically
5. Set environment variable: `JWT_SECRET=your-secure-random-key`
6. Copy your Railway backend URL (e.g., `https://tesla-api-prod.up.railway.app`)

### 2. Deploy Frontend to Vercel (5 minutes)

1. Go to [vercel.com](https://vercel.com)  
2. Sign in with GitHub
3. Import your project
4. Set environment variable: `NEXT_PUBLIC_API_URL=https://your-railway-url.up.railway.app`
5. Click Deploy
6. Your frontend URL will be something like `https://your-app.vercel.app`

### 3. Test Communication

1. Open your Vercel frontend URL
2. Try registering an account
3. Check the Railway logs to see requests coming in
4. Verify you can log in

That's it! Your app is live with frontend and backend communicating.

## Important Notes

- **NEXT_PUBLIC_API_URL** must point to your Railway backend URL
- **JWT_SECRET** should be a long random string in production
- The frontend can be accessed at your Vercel URL
- The backend API is accessed by the frontend (not directly by you)

## Environment Variables Summary

### Backend (.env on Railway)
```
PORT=5000
JWT_SECRET=your-super-secret-key-that-is-at-least-32-characters-long
```

### Frontend (.env.production on Vercel)
```
NEXT_PUBLIC_API_URL=https://your-railway-backend-url.up.railway.app
```

## Updating After Initial Deploy

If you make changes:
1. Push code to GitHub
2. Railway auto-redeploys backend
3. Vercel auto-redeploys frontend
4. No manual steps needed!

## Troubleshooting

**"Failed to connect to server" error:**
- Verify NEXT_PUBLIC_API_URL is correct in Vercel
- Check Railway backend is running (look at logs)
- Make sure URL starts with https://

**Backend not receiving requests:**
- Check the NEXT_PUBLIC_API_URL environment variable in Vercel
- Look at Railway logs to see if requests are arriving
- Verify no typos in the URL

**Can't log in:**
- Try registering a new account
- Check Railway logs for error messages
- Verify JWT_SECRET is set in Railway

## What Happens Next

- Your users can access the app at your Vercel URL
- The app communicates with the backend on Railway
- Database is stored in a JSON file (for small deployments)
- For production with many users, consider adding a real database

## Support

- Railway docs: [railway.app/docs](https://railway.app/docs)
- Vercel docs: [vercel.com/docs](https://vercel.com/docs)
- Check deployment logs if something fails
