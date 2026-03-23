# AI Health Monitor

A full-stack AI-powered health monitoring web application built with React, TypeScript, Tailwind CSS, and Supabase.

## 🌟 Features

### Core Functionality
- **Vital Signs Tracking**: Record age, gender, weight, height, heart rate, blood pressure, blood sugar, steps, and sleep hours
- **Data Persistence**: All data stored securely in Supabase with user authentication
- **Historical Trends**: Interactive charts showing health metrics over time using Recharts
- **Machine Learning Predictions**: Predict future health values using linear regression models
- **Risk Analysis**: Color-coded risk alerts (green/yellow/red) with personalized health recommendations
- **What-If Simulation**: Interactive tool to see how lifestyle changes affect future health predictions
- **CSV Export**: Download your health data for external analysis

### User Experience
- **Authentication**: Secure sign-up and sign-in with Supabase Auth
- **4-Tab Dashboard**: 
  - Overview - Summary cards and predictions
  - Add Vitals - Input form for daily health data
  - Trends - Historical charts and visualizations
  - Risk Analysis - Detailed health risk assessment
- **Sample Data Generation**: One-click generation of test data for demo purposes
- **Real-time Server Status**: Visual indicator showing backend connectivity
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## 🏗️ Architecture

### Frontend (`/src/app/`)
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS v4 with custom design tokens
- **Charts**: Recharts for data visualization
- **UI Components**: Radix UI primitives with custom styling
- **State Management**: React hooks (useState, useEffect)
- **Routing**: Single-page application with tab navigation

### Backend (`/supabase/functions/server/`)
- **Runtime**: Deno edge function
- **Framework**: Hono web framework
- **Database**: Supabase key-value store
- **Auth**: Supabase Auth with JWT tokens
- **API Endpoints**:
  - `GET /health` - Health check
  - `POST /signup` - Create new user account
  - `POST /vitals` - Save vital signs data
  - `GET /vitals` - Retrieve user's vital history
  - `DELETE /vitals/:timestamp` - Delete specific vital record

### Data Storage
- **KV Store**: User vitals stored as `vitals:{userId}:{timestamp}`
- **Schema**: JSON objects with all vital signs + metadata
- **Sorting**: Automatic timestamp-based ordering (newest first)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- Supabase CLI installed (`npm install -g supabase`)
- Supabase project set up

### Installation

1. **Clone and Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Supabase**
   - The project uses Supabase environment variables
   - Make sure `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are configured

3. **Deploy the Edge Function**
   ```bash
   supabase functions deploy make-server-8a2b1ce1
   ```

4. **Run the Development Server**
   ```bash
   npm run dev
   ```

5. **Access the Application**
   - Open your browser to the development URL
   - Create an account or sign in
   - Start tracking your health!

## 📊 Machine Learning Models

The application uses simple but effective linear regression models to predict future values:

- **Heart Rate Prediction**: Based on historical heart rate trends
- **Blood Pressure Prediction**: Analyzes systolic/diastolic patterns
- **Blood Sugar Prediction**: Forecasts glucose levels
- **Weight Prediction**: Projects weight changes over time

All predictions include confidence intervals and trend indicators (↑ improving, ↓ concerning, → stable).

## 🔐 Security

- **Authentication**: Supabase Auth with automatic email confirmation
- **Authorization**: JWT token validation on all API endpoints
- **Data Isolation**: Users can only access their own vitals data
- **Service Role Key**: Protected backend-only credential, never exposed to frontend
- **CORS**: Configured for secure cross-origin requests

## 🎨 Design System

The application uses a cohesive design system with:
- **Primary Colors**: Blue (600) for branding, Green (500) for success
- **Risk Colors**: Red (danger), Yellow (warning), Green (safe)
- **Typography**: Clear hierarchy with semantic HTML elements
- **Spacing**: Consistent padding and margins using Tailwind utilities
- **Animations**: Smooth transitions and loading states

## 🐛 Troubleshooting

### "Server Offline" Warning
If you see this warning:
1. Ensure the Supabase edge function is deployed
2. Run: `supabase functions deploy make-server-8a2b1ce1`
3. Refresh the page

### "Multiple GoTrueClient instances" Warning
This has been resolved with singleton pattern implementation. If you still see it:
- Clear browser cache and reload
- Check that all components use `getSupabaseClient()` from `/src/app/utils/supabase.ts`

### Failed to Fetch Errors
- Check that edge function is deployed and running
- Verify Supabase project credentials are correct
- Check browser console for detailed error messages

## 📁 Project Structure

```
/src/app/
  ├── App.tsx                 # Main app entry point
  ├── components/
  │   ├── AuthPage.tsx        # Sign in/sign up page
  │   ├── Dashboard.tsx       # Main dashboard with tabs
  │   ├── VitalsInputForm.tsx # Data input form
  │   ├── VitalsSummaryCards.tsx # Summary metrics display
  │   ├── VitalsCharts.tsx    # Historical trend charts
  │   ├── RiskAnalysisCard.tsx # Risk assessment display
  │   ├── PredictionCard.tsx  # ML predictions & what-if tool
  │   └── ui/                 # Reusable UI components
  ├── types/
  │   └── vitals.ts          # TypeScript type definitions
  ├── utils/
  │   ├── supabase.ts        # Supabase client singleton
  │   ├── predictions.ts     # ML prediction algorithms
  │   └── sampleData.ts      # Sample data generator
  └── styles/
      ├── fonts.css          # Font imports
      └── theme.css          # Design tokens & variables

/supabase/functions/server/
  ├── index.tsx              # Main server entry point
  └── kv_store.tsx          # KV store utilities (protected)
```

## 🔄 Future Enhancements

Potential features for future development:
- Advanced ML models (neural networks, ensemble methods)
- Multiple user profiles (family accounts)
- Health goal tracking and reminders
- Integration with wearable devices
- AI-powered health insights and recommendations
- Social features for accountability
- Healthcare provider sharing

## 📝 License

This is a demo application for educational purposes. Not intended for real medical use.

## 🙏 Credits

Built with:
- React & TypeScript
- Tailwind CSS
- Supabase
- Recharts
- Radix UI
- Lucide React Icons
