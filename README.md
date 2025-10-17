# 📚 Attendance Management System

A modern, full-stack attendance management system built with React, Express.js, and Neon PostgreSQL database. Perfect for schools, tuition centers, and educational institutions.

![Attendance System](https://img.shields.io/badge/Status-Production%20Ready-green)
![React](https://img.shields.io/badge/React-18-blue)
![Express](https://img.shields.io/badge/Express.js-4.x-lightgrey)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-blue)

## 🚀 Features

### ✨ Core Functionality
- **Student Management**: Add, edit, delete students with class information
- **Attendance Tracking**: Mark attendance for today and past dates (no future dates)
- **Real-time Statistics**: Live attendance percentages and summaries
- **Class Organization**: Organize students by class/grade

### 🎨 Enhanced User Interface
- **Search & Filter**: Find students by name, email, phone, or class
- **Bulk Actions**: Mark all present/absent with one click
- **Mobile Responsive**: Works perfectly on all devices
- **Modern Design**: Clean, intuitive interface with Tailwind CSS

### 📊 Data Management
- **Export Data**: Download attendance reports as CSV or JSON
- **Attendance History**: View past attendance records
- **Clean Database**: No fake data - production ready
- **Real-time Updates**: Instant data synchronization

### 🔒 Production Ready
- **Secure Database**: Neon PostgreSQL with SSL
- **Environment Variables**: Secure configuration management
- **Error Handling**: Comprehensive error management
- **Clean Codebase**: Well-organized, documented code

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Axios** for API calls

### Backend
- **Express.js** REST API
- **Node.js** runtime
- **PostgreSQL** with Neon database
- **CORS** enabled for cross-origin requests

### Database
- **Neon PostgreSQL** (serverless)
- **SSL** encrypted connections
- **Optimized queries** for performance

## 📦 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Neon PostgreSQL database account

### 1. Clone the Repository
```bash
git clone https://github.com/Rrayan0001/attendance_client_side.git
cd attendance_client_side
```

### 2. Install Dependencies
```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install
```

### 3. Database Setup
1. Create a Neon PostgreSQL database
2. Copy `backend/env.example` to `backend/.env`
3. Update the `DATABASE_URL` in `.env` with your Neon connection string
4. Run the database setup script:
```bash
cd backend
node setup-db.js
```

### 4. Environment Configuration
Create environment files:

**Backend** (`backend/.env`):
```env
DATABASE_URL=your_neon_database_url
PORT=3001
```

**Frontend** (`frontend/.env`):
```env
VITE_API_URL=http://localhost:3001/api
```

### 5. Start the Application
```bash
# Start both frontend and backend
npm start

# Or start individually:
npm run backend  # Backend on port 3001
npm run frontend # Frontend on port 5173
```

## 🎯 Usage

### For Teachers
1. **Add Students**: Click "Add Student" to register new students
2. **Mark Attendance**: Select today's date and mark present/absent
3. **View Statistics**: See real-time attendance percentages
4. **Export Data**: Download reports for parents/administration

### For Administrators
1. **Student Management**: Edit student information and classes
2. **Attendance History**: View past attendance records
3. **Data Export**: Generate CSV/JSON reports
4. **System Monitoring**: Check system health and performance

## 📁 Project Structure

```
attendance_client_side/
├── backend/                 # Express.js API server
│   ├── server.js           # Main server file
│   ├── package.json        # Backend dependencies
│   └── .env               # Environment variables
├── frontend/               # React application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── context/        # State management
│   │   ├── pages/          # Page components
│   │   └── types/          # TypeScript interfaces
│   ├── package.json        # Frontend dependencies
│   └── .env               # Frontend environment
├── docs/                   # Documentation
├── scripts/                # Utility scripts
└── README.md              # This file
```

## 🔧 API Endpoints

### Students
- `GET /api/students` - Get all students
- `POST /api/students` - Add new student
- `PUT /api/students/:id` - Update student
- `DELETE /api/students/:id` - Delete student

### Attendance
- `GET /api/attendance/:date` - Get attendance for date
- `POST /api/attendance` - Save attendance records
- `GET /api/attendance-stats/:date` - Get attendance statistics

### Health
- `GET /api/health` - Server health check

## 🚀 Deployment

### Backend Deployment
1. Deploy to platforms like Railway, Render, or Heroku
2. Set environment variables in your hosting platform
3. Ensure database connection is configured

### Frontend Deployment
1. Build the frontend: `npm run build`
2. Deploy to Vercel, Netlify, or similar
3. Update `VITE_API_URL` to your backend URL

### Database
- Uses Neon PostgreSQL (already configured)
- No additional setup required for database

## 📊 Database Schema

### Students Table
```sql
CREATE TABLE students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  class TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Attendance Table
```sql
CREATE TABLE attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  is_present BOOLEAN NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(student_id, date)
);
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in this repository
- Check the documentation in the `docs/` folder
- Review the setup guides and troubleshooting docs

## 🎉 Acknowledgments

- Built with modern web technologies
- Designed for educational institutions
- Production-ready and scalable
- Clean, maintainable codebase

---

**Ready to manage attendance efficiently? Start using the system today!** 🚀