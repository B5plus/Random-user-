# Project Structure Overview

## 📁 Complete File Structure

```
Random User/
│
├── 📄 README.md                    # Full documentation
├── 📄 QUICK_START.md              # Quick setup guide
├── 📄 PROJECT_STRUCTURE.md        # This file
├── 📄 supabase-schema.sql         # Database schema
│
├── 📂 frontend/                   # React Application
│   ├── 📂 src/
│   │   ├── 📂 components/
│   │   │   ├── UserForm.jsx      # Main form component
│   │   │   └── UserForm.css      # Form styling
│   │   ├── App.jsx               # Main app component
│   │   ├── App.css               # App styling
│   │   ├── index.css             # Global styles
│   │   └── main.jsx              # Entry point
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
└── 📂 backend/                    # Node.js Server
    ├── index.js                   # Express server & API routes
    ├── .env                       # Environment variables (add your credentials)
    ├── .env.example              # Environment template
    └── package.json

```

## 🔄 Application Flow

```
User fills form → React Frontend (Port 5173)
                        ↓
                  HTTP POST Request
                        ↓
              Node.js Backend (Port 3000)
                        ↓
                  Validates Data
                        ↓
              Supabase Client Library
                        ↓
              Supabase Database (PostgreSQL)
                        ↓
                  Returns Response
                        ↓
              Success/Error Message
                        ↓
              Displayed to User
```

## 🗄️ Database Schema

**Table: users**

| Column          | Type      | Description                    |
|----------------|-----------|--------------------------------|
| id             | UUID      | Primary key (auto-generated)   |
| name           | VARCHAR   | User's full name               |
| whatsapp_phone | VARCHAR   | WhatsApp phone number          |
| department     | VARCHAR   | User's department              |
| created_at     | TIMESTAMP | Record creation time           |
| updated_at     | TIMESTAMP | Last update time (auto-update) |

**Indexes:**
- `idx_users_created_at` - For sorting by date
- `idx_users_department` - For filtering by department

**Features:**
- Row Level Security (RLS) enabled
- Auto-updating `updated_at` trigger
- View for department statistics

## 🛠️ Key Technologies

### Frontend
- **React 18** - UI library
- **Vite** - Build tool & dev server
- **CSS3** - Custom styling with animations

### Backend
- **Express.js** - Web framework
- **@supabase/supabase-js** - Supabase client
- **cors** - Cross-origin resource sharing
- **dotenv** - Environment variables
- **nodemon** - Auto-restart on changes

### Database
- **Supabase** - PostgreSQL database
- **Row Level Security** - Data protection
- **Triggers** - Auto-update timestamps

## 📡 API Endpoints

| Method | Endpoint                        | Description              |
|--------|--------------------------------|--------------------------|
| POST   | /api/users                     | Create new user          |
| GET    | /api/users                     | Get all users            |
| GET    | /api/users/department/:dept    | Get users by department  |
| GET    | /api/health                    | Health check             |

## 🎨 Form Fields

1. **Name** (Text Input)
   - Required field
   - Full name of the user

2. **WhatsApp Phone Number** (Tel Input)
   - Required field
   - International format supported
   - Validation: Must be valid phone format

3. **Department** (Select Dropdown)
   - Required field
   - Options: Sales, Marketing, Engineering, HR, Finance, Support, Operations, Other

## 🔐 Environment Variables

**Backend (.env):**
```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
PORT=3000
```

## 🚀 Running the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

## 📦 Dependencies

### Frontend
- react
- react-dom
- vite

### Backend
- express
- @supabase/supabase-js
- cors
- dotenv
- nodemon (dev)

## ✨ Features Implemented

✅ Responsive form design
✅ Real-time validation
✅ Success/error messaging
✅ Loading states
✅ Phone number validation
✅ Department selection
✅ RESTful API
✅ Database integration
✅ Auto-updating timestamps
✅ CORS enabled
✅ Environment configuration
✅ Error handling
✅ Clean UI/UX

