# 🔧 Login/Register Not Working - Fix Guide

## Problem: Login and Register not working after deployment

This happens because **backend is not connected** to frontend properly.

---

## ✅ Solution: Complete Deployment Checklist

### Step 1: Deploy Backend First (Must Do!)

#### Via Vercel Dashboard:

1. Go to https://vercel.com/new
2. Import repo: `Yash11778/Collab_Board-Updated`
3. **Settings:**
   - Project Name: `collab-board-backend`
   - **Root Directory**: `backend` ⚠️ **VERY IMPORTANT!**
   - Framework: Other
   - Build Command: (leave empty)
   - Install Command: `npm install`

4. **Environment Variables** (MUST ADD):
   ```
   MONGODB_URI = mongodb+srv://username:password@cluster.mongodb.net/collabboard
   JWT_SECRET = your-super-secret-key-12345
   NODE_ENV = production
   ```

5. Click **Deploy**

6. **Test Backend**: Visit `https://your-backend.vercel.app/api/test`
   - Should show: `{"message":"API is working"}`
   - If not, check deployment logs!

7. **📋 COPY YOUR BACKEND URL**: Example: `https://collab-board-backend.vercel.app`

---

### Step 2: Update Frontend Environment Variable

#### In Vercel Dashboard:

1. Go to your **FRONTEND project** (not backend!)
2. Go to **Settings** → **Environment Variables**
3. Click **Add**
   ```
   Name: VITE_SERVER_URL
   Value: https://your-backend-url.vercel.app
   ```
   (Use the backend URL from Step 1, WITHOUT trailing slash!)

4. Click **Save**

5. Go to **Deployments** → Latest deployment → **Redeploy**

---

### Step 3: Update CORS in Backend

After both deployments are done:

1. Edit `backend/server.js` (line 22):
   ```javascript
   app.use(cors({
     origin: [
       'http://localhost:5173',
       'http://localhost:5174',
       'https://your-frontend.vercel.app'  // Add your actual frontend URL
     ],
     methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
     credentials: true
   }));
   ```

2. Also update Socket.io CORS (line 44):
   ```javascript
   const io = new Server(server, {
     cors: {
       origin: [
         'http://localhost:5173',
         'http://localhost:5174',
         'https://your-frontend.vercel.app'  // Add your actual frontend URL
       ],
       methods: ['GET', 'POST'],
       credentials: true
     },
   });
   ```

3. Commit and push:
   ```bash
   git add .
   git commit -m "Update CORS for production"
   git push
   ```

Backend will auto-redeploy!

---

## 🧪 Test Your Deployment

### 1. Check Backend Status:
- Visit: `https://your-backend.vercel.app/api/test`
- Should see: `{"message":"API is working"}`

### 2. Check Frontend:
- Open your frontend URL
- Look for **Backend Status** widget in bottom-left corner
- Should show: ✅ Backend Connected!

### 3. Test Login/Register:
- Try creating an account
- Try logging in
- Should work now!

---

## 🐛 Still Not Working?

### Check These:

#### 1. Backend URL Correct?
```bash
# In your terminal, check what's deployed:
echo $VITE_SERVER_URL
```

Should match your backend Vercel URL!

#### 2. MongoDB Connected?
- Check backend deployment logs
- Should see: "Connected to MongoDB successfully"
- If not, check `MONGODB_URI` is correct

#### 3. Environment Variables Set?
Frontend needs:
- ✅ `VITE_SERVER_URL` = backend URL

Backend needs:
- ✅ `MONGODB_URI` = MongoDB connection string
- ✅ `JWT_SECRET` = any secret key
- ✅ `NODE_ENV` = production

#### 4. CORS Errors in Console?
- Open browser DevTools (F12)
- Check Console for errors
- If CORS error, update `backend/server.js` with frontend URL

---

## 🎯 Quick Commands

### Test Backend Locally:
```bash
cd backend
npm install
npm start
# Visit http://localhost:5000/api/test
```

### Test Frontend Locally with Production Backend:
```bash
cd hackathon
# Create .env file:
echo VITE_SERVER_URL=https://your-backend.vercel.app > .env
npm install
npm run dev
# Try login/register
```

---

## 📋 Deployment URLs Template:

Fill these in:

- **Backend**: `https://___________________.vercel.app`
- **Frontend**: `https://___________________.vercel.app`
- **MongoDB**: `mongodb+srv://___________________`

### Environment Variables:

**Backend Project:**
```
MONGODB_URI = mongodb+srv://...
JWT_SECRET = my-secret-key-123
NODE_ENV = production
```

**Frontend Project:**
```
VITE_SERVER_URL = https://your-backend.vercel.app
```

---

## ✅ Final Checklist:

- [ ] Backend deployed with correct root directory (`backend`)
- [ ] Backend environment variables added (3 variables)
- [ ] Backend URL tested and working (`/api/test`)
- [ ] Frontend `VITE_SERVER_URL` set to backend URL
- [ ] Frontend redeployed after adding env var
- [ ] CORS updated in backend with frontend URL
- [ ] Backend redeployed after CORS update
- [ ] Login/Register tested and working

---

## 💡 Pro Tip:

If Socket.io real-time features don't work on Vercel, deploy backend on **Railway.app** instead:

1. Go to https://railway.app
2. Deploy from GitHub
3. Set root to `backend`
4. Add same env vars
5. Use Railway URL in frontend's `VITE_SERVER_URL`

Railway handles WebSocket connections better than Vercel!

---

**Need help?** Check deployment logs in Vercel dashboard for specific errors! 🚀
