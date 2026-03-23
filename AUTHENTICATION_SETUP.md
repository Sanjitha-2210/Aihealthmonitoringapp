# Authentication Setup Guide

## Quick Start

Your app now uses **direct Supabase Authentication** - no Edge Function deployment required!

## Important: Disable Email Confirmation

For the best demo experience, disable email confirmation in your Supabase project:

### Steps:

1. Go to your [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Navigate to **Authentication** → **Providers** → **Email**
4. Find **"Confirm email"** setting
5. **Toggle it OFF** (disable)
6. Click **Save**

![Disable Email Confirmation](https://supabase.com/docs/img/auth-email-confirm.png)

## Why Disable Email Confirmation?

✅ **Instant signup** - Users can sign up and immediately sign in  
✅ **No email required** - No need to configure SMTP/email service  
✅ **Demo-ready** - Perfect for prototypes and demos  
✅ **Better UX** - Smooth onboarding without email interruption  

## Authentication Flow

### With Email Confirmation DISABLED (Recommended):
1. User fills signup form → Account created ✅
2. User automatically switched to Sign In tab with pre-filled credentials
3. User clicks "Sign In" → Logged in immediately ✅
4. Dashboard loads with empty state

### With Email Confirmation ENABLED (Default):
1. User fills signup form → Account created ✅
2. User sees: "Please check your email to confirm"
3. User must check email and click confirmation link
4. User returns to app and signs in manually
5. Dashboard loads

## Current Implementation

### Sign Up (Client-Side)
```typescript
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password123',
  options: {
    data: {
      name: 'John Doe'
    }
  }
});
```

### Sign In (Client-Side)
```typescript
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123'
});
```

### Session Check (Auto-Login)
```typescript
const { data: { session } } = await supabase.auth.getSession();
if (session) {
  // User is already logged in
}
```

### Logout (Client-Side)
```typescript
await supabase.auth.signOut();
```

## Features

✅ **Auto-fill credentials** after signup  
✅ **Auto-switch to Sign In tab** after signup  
✅ **Session persistence** - Users stay logged in  
✅ **Proper error handling** with toast notifications  
✅ **Loading states** during auth operations  
✅ **Form validation** (email format, password min length)  

## User Data Storage

User metadata (name) is stored in:
```
supabase.auth.user.user_metadata.name
```

Vitals data is stored in:
```
kv_store_8a2b1ce1 table with key pattern: vitals:{userId}:{timestamp}
```

## Security

🔒 **Passwords hashed** by Supabase Auth  
🔒 **Session tokens** managed by Supabase  
🔒 **Row Level Security** (RLS) can be enabled on tables  
🔒 **User isolation** - Each user only sees their own vitals  

## Troubleshooting

### "Email not confirmed" error?
→ Disable email confirmation in Supabase Dashboard (see above)

### "Invalid login credentials"?
→ Check that you're using the correct email/password  
→ If you just signed up, make sure email confirmation is disabled

### Session not persisting?
→ Check that cookies are enabled in your browser  
→ Check that you're not in incognito/private mode

### User data not loading?
→ Check browser console for errors  
→ Verify Supabase credentials in `/utils/supabase/info.tsx`  
→ Make sure the `kv_store_8a2b1ce1` table exists

## Testing

### Test Accounts
Create test accounts with any email (doesn't need to be real if email confirmation is disabled):

```
Email: test@example.com
Password: test123456
Name: Test User
```

### Demo Workflow
1. Sign Up with test account
2. Automatically switched to Sign In
3. Click "Sign In" (credentials pre-filled)
4. Dashboard loads
5. Click "Add Sample Data" to populate 10 days of vitals
6. Explore all 4 tabs: Overview, Add Vitals, Trends, Risk Analysis
7. Test CSV export
8. Logout and sign in again

## Next Steps

- ✅ Authentication works without backend deployment
- ✅ Data storage works with direct Supabase client
- ✅ All ML features work client-side
- ⚠️ Consider adding password reset flow (optional)
- ⚠️ Consider adding social auth (Google, GitHub) (optional)
- ⚠️ Enable Row Level Security (RLS) for production (optional)
