# AI-Based Vitals Tracking and Lifestyle Disease Prediction System

## Overview
A comprehensive full-stack health monitoring web application built with React, TypeScript, Tailwind CSS, and Supabase. This application enables users to track vital signs, predict future health trends using AI/ML algorithms, and receive personalized health recommendations.

## 🎯 Key Features

### 1. **Authentication System**
- Secure user signup and login using Supabase Auth
- Session management with automatic token refresh
- User profile with personalized dashboard

### 2. **Vitals Input Form**
Clean, intuitive form for recording:
- Age, Gender, Weight, Height
- Heart Rate (bpm)
- Blood Pressure (Systolic/Diastolic)
- Blood Sugar Level (mg/dL)
- Daily Steps
- Sleep Hours

### 3. **Data Visualization & Trends**
Interactive charts showing historical trends for:
- Heart Rate over time
- Blood Pressure (Systolic & Diastolic)
- Blood Sugar levels
- Uses Recharts library for responsive, beautiful charts

### 4. **AI-Powered Predictions**
- **Machine Learning Engine**: Simple linear regression algorithm
- Predicts future blood pressure and blood sugar levels
- Confidence scoring based on data quantity
- Trend analysis using historical data points

### 5. **Comprehensive Risk Analysis**
Analyzes multiple health metrics:
- **Blood Pressure Risk**: Detects hypertension (>140/90)
- **Blood Sugar Risk**: Identifies hyperglycemia (>180 mg/dL)
- **Heart Rate Risk**: Monitors tachycardia/bradycardia
- **BMI Risk**: Calculates and assesses body mass index
- **Lifestyle Risk**: Evaluates sleep and activity levels

Color-coded risk levels:
- 🟢 **Low Risk** (Green)
- 🟡 **Medium Risk** (Yellow)  
- 🔴 **High Risk** (Red)

### 6. **Smart Alert System**
- Real-time health alerts for abnormal values
- Visual indicators with color-coded badges
- Detailed risk breakdown by category
- Persistent notifications using Sonner toast library

### 7. **Health Recommendations**
Personalized suggestions based on risk analysis:
- High BP → Reduce salt, exercise regularly
- High Sugar → Lower carb intake, walk after meals
- Poor Sleep → Sleep hygiene tips
- Low Activity → Step goals and movement suggestions

### 8. **What-If Simulation** ⭐
Interactive lifestyle simulator:
- **Adjustable Sliders**: Modify steps and sleep hours
- **Real-time Predictions**: See instant impact on health metrics
- **Impact Visualization**: Shows projected improvements
- **Actionable Insights**: Encourages positive lifestyle changes

Example: Increasing daily steps from 5,000 to 10,000 shows predicted reduction in BP and blood sugar!

### 9. **Modern Dashboard UI**
- **4-Tab Navigation**:
  1. Overview - Summary cards & predictions
  2. Add Vitals - Input form
  3. Trends - Historical charts
  4. Risk Analysis - Detailed health assessment
- Responsive design (mobile & desktop)
- Gradient backgrounds and smooth animations
- Clean card-based layout

### 10. **Data Export**
- Export all vitals to CSV format
- Timestamp-based file naming
- Compatible with Excel/Google Sheets
- Perfect for sharing with healthcare providers

### 11. **Sample Data Generator**
- One-click demo data creation
- Generates 10 realistic vitals entries
- Simulates improving health trends
- Perfect for testing and demonstration

## 🛠 Technical Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS v4** for styling
- **Radix UI** components (shadcn/ui)
- **Recharts** for data visualization
- **Lucide React** for icons
- **Sonner** for toast notifications
- **date-fns** for date formatting

### Backend
- **Supabase** for authentication & database
- **Hono** web framework (Deno edge function)
- **Key-Value Store** for persistent data
- RESTful API endpoints

### Machine Learning
- Custom linear regression implementation
- Trend analysis algorithm
- Multi-factor prediction model
- Confidence scoring system

## 📊 API Endpoints

### Authentication
- `POST /make-server-8a2b1ce1/signup` - Create new user account

### Vitals Management
- `POST /make-server-8a2b1ce1/vitals` - Save vitals entry
- `GET /make-server-8a2b1ce1/vitals` - Fetch user's vitals history
- `DELETE /make-server-8a2b1ce1/vitals/:timestamp` - Delete specific entry

## 🎨 UI/UX Highlights

- **Color-Coded Health Metrics**: Visual indicators for each vital sign
- **Responsive Grid Layouts**: Adapts to screen sizes
- **Loading States**: Skeleton loaders and spinners
- **Empty States**: Helpful prompts when no data exists
- **Smooth Animations**: Gradient transitions and hover effects
- **Accessibility**: Proper labels and ARIA attributes

## 🔒 Security & Privacy

⚠️ **Important**: This is a demonstration application. 
- Data is stored securely in Supabase
- Not intended for actual medical use
- Do not use for real health decisions
- Consult healthcare professionals for medical advice

## 🚀 How to Use

1. **Sign Up**: Create an account with email and password
2. **Add Vitals**: Record your first health measurements
3. **View Dashboard**: See summary cards and initial analysis
4. **Explore Trends**: Add more entries to see charts and predictions
5. **Try What-If**: Adjust sliders to simulate lifestyle changes
6. **Export Data**: Download CSV for your records

## 💡 ML Prediction Algorithm

The prediction engine uses:
- **Linear Regression**: Calculates trend slopes from historical data
- **Multi-Factor Analysis**: Considers steps and sleep impact
- **Confidence Scoring**: Higher with more data points (max 90%)
- **What-If Modeling**: Simulates lifestyle changes in real-time

Formula example:
```
Predicted BP = Current BP + Trend + (Steps Impact × Steps Difference) + (Sleep Impact × Sleep Difference)
```

## 🎯 Use Cases

- Personal health tracking
- Fitness goal monitoring
- Diabetes management support
- Hypertension awareness
- Lifestyle improvement planning
- Health data visualization
- Medical appointment preparation

## 🌟 Future Enhancements

Potential additions:
- More vital signs (oxygen saturation, temperature)
- Advanced ML models (Random Forest, Neural Networks)
- Medication tracking
- Doctor appointment scheduling
- PDF report generation
- Multi-language support
- Dark mode toggle
- Mobile app version
- Social features (share progress)
- Integration with wearables (Fitbit, Apple Watch)

## 📝 Data Model

```typescript
interface VitalsData {
  age: number;
  gender: 'male' | 'female' | 'other';
  weight: number; // kg
  height: number; // cm
  heartRate: number; // bpm
  systolicBP: number; // mmHg
  diastolicBP: number; // mmHg
  bloodSugar: number; // mg/dL
  steps: number;
  sleepHours: number;
  timestamp?: string;
  userId?: string;
}
```

## 🏆 Project Highlights

✅ Full-stack architecture with authentication  
✅ Real machine learning predictions  
✅ Interactive data visualization  
✅ Comprehensive health risk analysis  
✅ What-if simulation for lifestyle changes  
✅ Export functionality  
✅ Sample data for testing  
✅ Responsive modern UI  
✅ Type-safe with TypeScript  
✅ Production-ready code structure  

---

**Built with ❤️ using React, TypeScript, and Supabase**
