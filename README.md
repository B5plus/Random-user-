# Random User - Player Registration & Room Management System

A full-stack web application for player registration and room management with admin dashboard.

## 🎯 Features

### Player Registration

- ✅ Register players with name, WhatsApp phone number, and department
- ✅ Dark theme with maroon accents
- ✅ Full-screen responsive design
- ✅ Real-time form validation
- ✅ Success/Error messages

### Admin Dashboard

- ✅ View all registered users
- ✅ Select random 50 users
- ✅ Create rooms and add users to rooms
- ✅ Auto-generated room names (Room 1, Room 2, etc.)

### Rooms Management

- ✅ View all created rooms
- ✅ See complete player list for each room
- ✅ Delete rooms with confirmation
- ✅ Real-time data updates

## Tech Stack

**Frontend:**

- React (with Vite)
- CSS3 (Custom styling)

**Backend:**

- Node.js
- Express.js
- Supabase Client

**Database:**

- Supabase (PostgreSQL)

## Project Structure

```
.
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── UserForm.jsx
│   │   │   └── UserForm.css
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
├── backend/               # Node.js backend
│   ├── index.js          # Express server
│   ├── .env.example      # Environment variables template
│   └── package.json
│
└── supabase-schema.sql   # Database schema
```

## Setup Instructions

### 1. Supabase Setup

1. Go to [Supabase](https://supabase.com) and create a new project
2. Once your project is created, go to the SQL Editor
3. Copy the contents of `supabase-schema.sql` and run it in the SQL Editor
4. Get your project credentials:
   - Go to Project Settings → API
   - Copy the `Project URL` (SUPABASE_URL)
   - Copy the `anon/public` key (SUPABASE_ANON_KEY)

### 2. Backend Setup

1. Navigate to the backend directory:

   ```bash
   cd backend
   ```

2. Create a `.env` file (copy from `.env.example`):

   ```bash
   cp .env.example .env
   ```

3. Edit `.env` and add your Supabase credentials:

   ```env
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   PORT=3000
   ```

4. Install dependencies (already done if you followed the setup):

   ```bash
   npm install
   ```

5. Start the backend server:

   ```bash
   npm run dev
   ```

   The server will run on `http://localhost:3000`

### 3. Frontend Setup

1. Open a new terminal and navigate to the frontend directory:

   ```bash
   cd frontend
   ```

2. Install dependencies (already done if you followed the setup):

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

   The app will run on `http://localhost:5173`

## API Endpoints

### POST /api/users

Create a new user

**Request Body:**

```json
{
  "name": "John Doe",
  "whatsapp_phone": "+1234567890",
  "department": "Engineering"
}
```

**Response:**

```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "id": "uuid",
    "name": "John Doe",
    "whatsapp_phone": "+1234567890",
    "department": "Engineering",
    "created_at": "2026-01-20T...",
    "updated_at": "2026-01-20T..."
  }
}
```

### GET /api/users

Get all users

### GET /api/users/department/:department

Get users by department

### GET /api/health

Health check endpoint

## Database Schema

The `users` table includes:

- `id` (UUID, Primary Key)
- `name` (VARCHAR)
- `whatsapp_phone` (VARCHAR)
- `department` (VARCHAR)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

See `supabase-schema.sql` for the complete schema with indexes and triggers.

## Usage

1. Make sure both backend and frontend servers are running
2. Open `http://localhost:5173` in your browser
3. Fill in the form with:
   - Your full name
   - WhatsApp phone number (with country code)
   - Select a department
4. Click Submit
5. You'll see a success message if the data is saved successfully

## Development

- Frontend runs on port 5173 with hot reload
- Backend runs on port 3000 with nodemon for auto-restart
- Make sure to set up your Supabase credentials before running

## Notes

- The phone number validation accepts international format
- All fields are required
- The form includes client-side and server-side validation
- CORS is enabled for local development
