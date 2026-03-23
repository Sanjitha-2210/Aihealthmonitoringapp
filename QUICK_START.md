# Quick Start Guide - AI Health Monitor

## 🚀 Get Running in 3 Steps

### 1. Deploy Backend
```bash
supabase functions deploy make-server-8a2b1ce1
```

### 2. Start Frontend
```bash
npm run dev
```

### 3. Test
- Open the app in your browser
- Look for the green **"Online"** badge in the header
- If it shows **"Offline"**, click **"Retry Connection"**

---

## 🔧 Common Commands

### Deployment
```bash
# Login to Supabase
supabase login

# Link project (first time only)
supabase link --project-ref YOUR_PROJECT_REF

# Deploy edge function
supabase functions deploy make-server-8a2b1ce1

# List deployed functions
supabase functions list
```

### Debugging
```bash
# View function logs (live)
supabase functions logs make-server-8a2b1ce1 --follow

# View recent logs
supabase functions logs make-server-8a2b1ce1

# Test health endpoint
curl https://YOUR_PROJECT_ID.supabase.co/functions/v1/make-server-8a2b1ce1/health
```

### Browser Console
```javascript
// Test connection from browser
testServerConnection()

// Check Supabase client
const supabase = getSupabaseClient()
```

---

## ✅ What Should Work

After deployment, you should see:

1. ✅ **Green "Online" badge** in header
2. ✅ **Sign Up/Sign In** works smoothly  
3. ✅ **Add Vitals** saves data
4. ✅ **Charts** display trends
5. ✅ **Predictions** show future health values
6. ✅ **Risk Analysis** with color-coded alerts
7. ✅ **What-If Tool** for lifestyle simulations
8. ✅ **CSV Export** downloads data

---

## ❌ Troubleshooting

### Server Shows "Offline"
1. Deploy: `supabase functions deploy make-server-8a2b1ce1`
2. Click "Retry Connection" button in app
3. Check logs: `supabase functions logs make-server-8a2b1ce1`

### Timeout Errors
- The app automatically retries 3 times (10 seconds each)
- Total wait time: ~30 seconds
- If still failing, edge function isn't deployed

### Authentication Issues
1. Sign out completely
2. Clear browser cache
3. Sign in again
4. Check Supabase Auth is enabled in project

---

## 📖 Full Documentation

- **Complete Guide**: See [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Features Overview**: See [README.md](./README.md)
- **Architecture**: See [README.md](./README.md#-architecture)

---

## 💡 Tips

- **First Time?** Use "Add Sample Data" to populate test data
- **Debugging?** Browser console shows all API calls and errors
- **Need Help?** Run `testServerConnection()` in console for diagnostics
- **Offline Mode?** The app gracefully handles server being unavailable

---

**That's it!** The app is now 100% functional. Enjoy tracking your health! 🎉
