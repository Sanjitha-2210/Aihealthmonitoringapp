# Deployment Guide - AI Health Monitor

This guide will help you get the AI Health Monitor up and running with 100% functionality.

## ✅ Pre-Deployment Checklist

Before deploying, ensure you have:
- [x] Supabase project created
- [x] Supabase CLI installed (`npm install -g supabase`)
- [x] Node.js 18+ installed
- [x] Project dependencies installed (`npm install`)

## 🚀 Deployment Steps

### Step 1: Verify Supabase Configuration

1. **Check your Supabase project URL and keys**
   - Go to your Supabase project settings
   - Copy your Project URL (looks like: `https://xbxxoklhyuqxqelzykjr.supabase.co`)
   - Copy your `anon` (public) key
   - Copy your `service_role` (secret) key

2. **Verify environment variables are set**
   ```bash
   # These should be automatically configured in the Figma Make environment
   echo $SUPABASE_URL
   echo $SUPABASE_ANON_KEY
   echo $SUPABASE_SERVICE_ROLE_KEY
   ```

### Step 2: Deploy the Edge Function

The backend server is a Supabase Edge Function that needs to be deployed:

```bash
# Login to Supabase (if not already logged in)
supabase login

# Link your project (replace with your project reference)
supabase link --project-ref YOUR_PROJECT_REF

# Deploy the edge function
supabase functions deploy make-server-8a2b1ce1

# Verify deployment
supabase functions list
```

**Expected Output:**
```
┌──────────────────────┬─────────┬─────────────────────┐
│ NAME                 │ VERSION │ CREATED AT          │
├──────────────────────┼─────────┼─────────────────────┤
│ make-server-8a2b1ce1 │ 1       │ 2026-03-21 15:00:00 │
└──────────────────────┴─────────┴─────────────────────┘
```

### Step 3: Test the Backend

After deployment, test that the backend is working:

**Option 1: Use the built-in test utility**
1. Open your app in the browser
2. Open browser console (F12)
3. Run: `testServerConnection()`
4. You should see: `✅ Server is online!`

**Option 2: Test with curl**
```bash
curl https://YOUR_PROJECT_ID.supabase.co/functions/v1/make-server-8a2b1ce1/health
```

**Expected Response:**
```json
{
  "status": "ok",
  "timestamp": "2026-03-21T15:00:00.000Z",
  "message": "AI Health Monitor API is running"
}
```

### Step 4: Start the Frontend

```bash
npm run dev
```

The application should now be running and accessible in your browser.

### Step 5: Verify Everything Works

1. **Sign Up**
   - Go to the "Sign Up" tab
   - Create a new account
   - You should see a success message

2. **Sign In**
   - Switch to "Sign In" tab
   - Use the credentials you just created
   - You should be redirected to the dashboard

3. **Check Server Status**
   - Look for the green "Online" badge in the top right
   - If it shows "Offline", the edge function isn't deployed correctly

4. **Add Sample Data**
   - Click "Add Sample Data" button
   - Wait for confirmation
   - You should see charts and statistics populate

5. **Test Features**
   - Add manual vitals entry
   - View charts
   - Check risk analysis
   - Try what-if simulation
   - Export CSV

## 🐛 Troubleshooting

### Issue: "Server Offline" Warning

**Symptoms:**
- Red "Offline" badge in header
- Yellow warning banner with deployment instructions
- Timeout errors in console
- No data loading

**Solution:**
```bash
# Ensure you're logged in
supabase login

# Link to your project (if not already linked)
supabase link --project-ref YOUR_PROJECT_REF

# Re-deploy the function
supabase functions deploy make-server-8a2b1ce1

# Check function logs for errors
supabase functions logs make-server-8a2b1ce1

# In the app, click "Retry Connection" button or refresh the page
```

**Additional Troubleshooting:**
- The app now retries 3 times with exponential backoff (10 seconds per attempt)
- If still failing, check your project ID in `/utils/supabase/info.tsx`
- Verify the edge function is listed: `supabase functions list`
- Check Supabase dashboard for function deployment status

### Issue: "Multiple GoTrueClient instances" Warning

**Symptoms:**
- Console warnings about multiple GoTrueClient instances

**Solution:**
This has been fixed with singleton pattern. If you still see it:
1. Clear browser cache completely
2. Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
3. Verify all components use `getSupabaseClient()` from `/src/app/utils/supabase.ts`

### Issue: Authentication Errors

**Symptoms:**
- Can't sign up or sign in
- "Unauthorized" errors

**Solution:**
1. Check Supabase Auth is enabled in your project
2. Verify email confirmation is disabled (or handle email verification)
3. Check browser console for specific error messages
4. Verify `SUPABASE_URL` and `SUPABASE_ANON_KEY` are correct

### Issue: Failed to Fetch Vitals

**Symptoms:**
- "Failed to fetch vitals" error
- Empty dashboard even with data

**Solution:**
1. Verify edge function is deployed: `supabase functions list`
2. Check function logs: `supabase functions logs make-server-8a2b1ce1`
3. Test health endpoint directly (see Step 3)
4. Verify access token is valid (sign out and sign in again)

### Issue: Edge Function Deployment Fails

**Symptoms:**
- Error during `supabase functions deploy`
- Import/syntax errors

**Solution:**
```bash
# Ensure Deno imports are correct (they should use npm: or jsr: prefixes)
# Check the /supabase/functions/server/index.tsx file

# Try deploying with verbose output
supabase functions deploy make-server-8a2b1ce1 --debug

# If all else fails, check Supabase status
# https://status.supabase.com
```

## 🔍 Debugging Tips

### Enable Detailed Logging

The app includes comprehensive logging. Check:

1. **Browser Console** - All API calls and errors are logged
2. **Network Tab** - Inspect request/response details
3. **Edge Function Logs**:
   ```bash
   supabase functions logs make-server-8a2b1ce1 --follow
   ```

### Test Connection Manually

Use the browser console to test:
```javascript
// Test health endpoint
await fetch('https://YOUR_PROJECT_ID.supabase.co/functions/v1/make-server-8a2b1ce1/health')
  .then(r => r.json())
  .then(console.log);

// Test with authentication
const token = 'YOUR_ACCESS_TOKEN'; // Get from localStorage or Supabase client
await fetch('https://YOUR_PROJECT_ID.supabase.co/functions/v1/make-server-8a2b1ce1/vitals', {
  headers: { 'Authorization': `Bearer ${token}` }
}).then(r => r.json()).then(console.log);
```

### Check Environment Variables

In the edge function, add temporary logging:
```typescript
console.log('SUPABASE_URL:', Deno.env.get('SUPABASE_URL'));
console.log('Has SERVICE_ROLE_KEY:', !!Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'));
```

Then check logs: `supabase functions logs make-server-8a2b1ce1`

## ✨ Post-Deployment

Once everything is working:

1. **Test all features** - Go through each tab and verify functionality
2. **Add real data** - Input your actual health vitals
3. **Explore predictions** - Check the ML predictions and what-if tool
4. **Export data** - Test the CSV export feature
5. **Monitor performance** - Keep an eye on edge function logs

## 📊 Expected Behavior

### When Everything Works:

- ✅ Green "Online" badge in header
- ✅ No error messages in console (except deprecation warnings which are normal)
- ✅ Smooth authentication flow
- ✅ Data persists across sessions
- ✅ Charts and graphs display correctly
- ✅ Predictions update based on data
- ✅ CSV export downloads successfully

### Normal Console Messages:

These messages are **expected and OK**:
```
Server health check: {status: "ok", ...}
💡 Tip: Run testServerConnection() in console to check server status
```

These messages are **NOT OK**:
```
Server health check error: ...
Failed to fetch vitals ...
Error saving vitals: ...
```

## 🎯 Success Criteria

Your deployment is successful when:

1. [ ] App loads without errors
2. [ ] Green "Online" status indicator shows
3. [ ] Can create account and sign in
4. [ ] Can add vitals and see them saved
5. [ ] Charts display historical data
6. [ ] Predictions show in overview
7. [ ] Risk analysis displays correctly
8. [ ] CSV export works
9. [ ] No error messages in console
10. [ ] Data persists after refresh

## 🆘 Still Having Issues?

If you've followed all steps and still have problems:

1. **Check Supabase Dashboard**
   - Go to your project's Edge Functions section
   - Verify function is listed and has recent invocations
   - Check logs for errors

2. **Verify Project Configuration**
   - Ensure Auth is enabled
   - Check that the KV store table exists
   - Verify CORS settings allow your domain

3. **Review Code**
   - Check `/supabase/functions/server/index.tsx` for syntax errors
   - Verify imports use correct prefixes (npm:, jsr:)
   - Ensure all routes are properly defined

4. **Contact Support**
   - Provide error messages from console
   - Include edge function logs
   - Share network request details (without sensitive tokens)

---

**Remember:** The most common issue is forgetting to deploy the edge function. Always check the "Online/Offline" indicator first!