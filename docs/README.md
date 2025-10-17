# Tuition Attendance Management System

A modern, full-stack attendance management system built with React, TypeScript, Express.js, and Neon Database.

## 🚀 Features

- ✅ **Student Management** - Add, edit, delete students
- ✅ **Daily Attendance Tracking** - Mark present/absent for any date
- ✅ **Real-time Statistics** - Attendance percentages and counts
- ✅ **Modern UI** - Responsive design with Tailwind CSS
- ✅ **TypeScript** - Full type safety
- ✅ **REST API** - Express.js backend with Neon Database

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Neon Database account

## 🛠️ Setup Instructions

### 1. Clone and Install Dependencies

```bash
# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

### 2. Neon Database Setup

✅ **Database is already configured!** Your Neon database is set up and ready to use.

**Connection Details:**
- Database: `neondb`
- Host: `ep-dawn-wildflower-adhz6523-pooler.c-2.us-east-1.aws.neon.tech`
- Status: ✅ Connected and configured

### 3. Environment Configuration

#### Backend (.env file in backend folder):
✅ **Already configured!** The backend is using your Neon connection string.

#### Frontend (.env.local file in frontend folder):
✅ **Already configured!** The frontend is set to connect to the backend API.

### 4. Start the Application

#### Terminal 1 - Backend Server:
```bash
cd backend
npm run dev
```

#### Terminal 2 - Frontend:
```bash
cd frontend
npm run dev
```

The application will be available at:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001/api

## 📁 Project Structure

```
attendance_managment_client/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/      # UI components
│   │   ├── context/         # State management
│   │   ├── pages/          # Page components
│   │   ├── types/          # TypeScript definitions
│   │   └── databaseClient.ts # API client
│   ├── package.json
│   └── README.md
├── backend/                 # Express.js API server
│   ├── server.js           # Main server file
│   ├── package.json
│   └── env.example
├── neon_setup.sql          # Database setup SQL
└── README.md               # This file
```

## 🔧 API Endpoints

### Students
- `GET /api/students` - Get all students
- `POST /api/students` - Create new student
- `PUT /api/students/:id` - Update student
- `DELETE /api/students/:id` - Delete student

### Attendance
- `GET /api/attendance/:date` - Get attendance for date
- `POST /api/attendance` - Save attendance records
- `GET /api/attendance-stats/:date` - Get attendance statistics

### Health Check
- `GET /api/health` - Server health check

## 🗄️ Database Schema

### Students Table
```sql
CREATE TABLE students (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

### Attendance Table
```sql
CREATE TABLE attendance (
  id UUID PRIMARY KEY,
  student_id UUID REFERENCES students(id),
  date DATE NOT NULL,
  is_present BOOLEAN DEFAULT false,
  notes TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  UNIQUE(student_id, date)
);
```

## 🚀 Deployment

### Frontend (Vercel/Netlify)
1. Build the frontend: `npm run build`
2. Deploy the `dist` folder
3. Set environment variable: `VITE_API_URL=your-backend-url`

### Backend (Railway/Render/Heroku)
1. Deploy the backend folder
2. Set environment variables:
   - `DATABASE_URL` - Your Neon connection string
   - `PORT` - Server port (usually auto-assigned)

## 🔒 Security Notes

- The current setup uses basic CORS and no authentication
- For production, consider adding:
  - Authentication middleware
  - Rate limiting
  - Input validation
  - HTTPS enforcement

## 📝 Available Scripts

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Backend
- `npm run dev` - Start with nodemon (development)
- `npm start` - Start production server

## 🆘 Troubleshooting

### Common Issues:

1. **Database Connection Error**
   - Check your Neon connection string
   - Ensure the database is accessible
   - Verify SSL settings

2. **CORS Errors**
   - Make sure backend is running on port 3001
   - Check CORS configuration in server.js

3. **Build Errors**
   - Clear node_modules and reinstall
   - Check Node.js version (v16+)

## 📞 Support

For issues and questions:
1. Check the Neon documentation
2. Verify environment variables
3. Check server logs for errors

---

**Ready to use!** 🎉 Your attendance management system is now set up with Neon Database!
