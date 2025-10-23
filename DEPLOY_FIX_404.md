# 🚀 DEPLOY GUIDE - Fix 404 Error

## ⚠️ Problem: 404 Error on Vercel

The 404 error happens because Vercel's monorepo support with serverless functions is tricky. 

## ✅ SOLUTION: Deploy Frontend & Backend Separately

Deploy them as **2 separate Vercel projects** pointing to the same GitHub repo but different root directories.

---

## 📦 Step 1: Deploy Backend

### Via Vercel Dashboard:

1. Go to https://vercel.com/new
2. Import your repo: `Yash11778/Collab_Board-Updated`
3. **Project Settings:**
   - Project Name: `collab-board-backend`
   - **Root Directory**: `backend` ✅ (Click Edit → Select backend folder)
   - Framework: Other
   - Build Command: (leave empty)
   - Output Directory: (leave empty)
   - Install Command: `npm install`

4. **Environment Variables:**
   ```
   MONGODB_URI = your_mongodb_connection_string
   JWT_SECRET = your_secret_key
   NODE_ENV = production
   ```

5. Click **Deploy**

6. **📋 SAVE YOUR BACKEND URL**: `https://collab-board-backend.vercel.app`

---

## 📦 Step 2: Deploy Frontend

### Via Vercel Dashboard:

1. Go to https://vercel.com/new **again**
2. Import **SAME repo**: `Yash11778/Collab_Board-Updated`
3. **Project Settings:**
   - Project Name: `collab-board`
   - **Root Directory**: `hackathon` ✅ (Click Edit → Select hackathon folder)
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

4. **Environment Variable:**
   ```
   VITE_SERVER_URL = https://your-backend-url.vercel.app
   ```
   (Use the backend URL from Step 1)

5. Click **Deploy**

6. **📋 SAVE YOUR FRONTEND URL**: `https://collab-board.vercel.app`

---

## 📦 Step 3: Update CORS in Backend

After both are deployed, update CORS in backend:

1. Edit `backend/server.js` (line 22 & 44)
2. Replace `origin: '*'` with:
   ```javascript
   origin: [
     'http://localhost:5173',
     'http://localhost:5174', 
     'https://your-frontend-url.vercel.app'  // Your actual frontend URL
   ]
   ```

3. Commit and push:
   ```bash
   git add .
   git commit -m "Update CORS for production"
   git push
   ```

Vercel will auto-redeploy backend!

---

## ✅ Why This Works:

- **Separate deployments** = Clean routing
- **No 404 errors** = Each project has its own domain
- **Backend URL** is used by frontend via `VITE_SERVER_URL`
- **CORS configured** properly for cross-origin requests

---

## 🎯 Final URLs:

- **Frontend**: `https://collab-board.vercel.app` (Share this!)
- **Backend API**: `https://collab-board-backend.vercel.app/api/...`
- **Backend Socket**: `https://collab-board-backend.vercel.app/socket.io/...`

---

## 🐛 Still Getting Issues?

### Option: Deploy Backend on Railway.app

If Socket.io doesn't work on Vercel:

1. Go to https://railway.app
2. New Project → Deploy from GitHub
3. Select repo, set root to `backend`
4. Add environment variables
5. Deploy!
6. Use Railway URL in frontend's `VITE_SERVER_URL`

Railway is better for WebSocket/Socket.io connections!

---

## 🎉 Success!

Once both are deployed:
- Frontend loads at your Vercel URL
- API calls go to backend
- Real-time collaboration works
- No 404 errors!

**Remember**: Deploy as 2 SEPARATE projects, not one! 🚀
