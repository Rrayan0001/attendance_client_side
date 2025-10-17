# 🗄️ Database Access Guide

## ✅ **Your Neon Database is Connected!**

**Connection String:**
```
postgresql://neondb_owner:npg_lixbdvLD7OW5@ep-dawn-wildflower-adhz6523-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

## 🚀 **How to Access Your Database**

### **Option 1: Interactive Database Console**
```bash
npm run db
```
This opens an interactive session where you can run commands like:
- `students` - Show all students
- `attendance` - Show attendance records  
- `stats` - Show attendance statistics
- `sql SELECT * FROM students` - Run custom SQL
- `exit` - Disconnect

### **Option 2: Direct SQL Queries**
```bash
npm run sql "SELECT * FROM students"
npm run sql "SELECT COUNT(*) FROM students"
npm run sql "SELECT * FROM attendance WHERE date = '2025-10-17'"
```

### **Option 3: Install psql (PostgreSQL Client)**
If you want to use the traditional `psql` command:

**On macOS:**
```bash
brew install postgresql
```

**Then connect:**
```bash
psql 'postgresql://neondb_owner:npg_lixbdvLD7OW5@ep-dawn-wildflower-adhz6523-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require'
```

## 📊 **Current Database Status**

✅ **Tables Created:**
- `students` - Student information
- `attendance` - Daily attendance records
- `attendance_summary` - View for statistics
- `student_attendance_history` - View for history

✅ **Sample Data Loaded:**
- 5 students ready for testing
- Database indexes created for performance
- Triggers set up for automatic timestamp updates

## 🔍 **Useful Queries**

### **View All Students:**
```sql
SELECT * FROM students ORDER BY name;
```

### **View Attendance for Today:**
```sql
SELECT a.*, s.name as student_name 
FROM attendance a 
JOIN students s ON a.student_id = s.id 
WHERE a.date = CURRENT_DATE;
```

### **Get Attendance Statistics:**
```sql
SELECT 
  date,
  COUNT(*) as total_students,
  COUNT(CASE WHEN is_present THEN 1 END) as present_count,
  COUNT(CASE WHEN NOT is_present THEN 1 END) as absent_count,
  ROUND(
    (COUNT(CASE WHEN is_present THEN 1 END)::DECIMAL / COUNT(*)) * 100, 
    2
  ) as attendance_percentage
FROM attendance 
GROUP BY date 
ORDER BY date DESC;
```

### **Add a New Student:**
```sql
INSERT INTO students (name, email, phone) 
VALUES ('New Student', 'new@example.com', '+1234567890');
```

### **Mark Attendance:**
```sql
INSERT INTO attendance (student_id, date, is_present) 
VALUES ('student-uuid-here', '2025-10-17', true);
```

## 🛠️ **Database Management**

### **Reset Database (if needed):**
```sql
DROP TABLE IF EXISTS attendance CASCADE;
DROP TABLE IF EXISTS students CASCADE;
-- Then re-run the setup script
```

### **Backup Database:**
```bash
pg_dump 'postgresql://neondb_owner:npg_lixbdvLD7OW5@ep-dawn-wildflower-adhz6523-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require' > backup.sql
```

## 📱 **Application Status**

- ✅ **Backend API**: Running on http://localhost:3001
- ✅ **Frontend App**: Running on http://localhost:5173
- ✅ **Database**: Connected and operational
- ✅ **Sample Data**: 5 students loaded

## 🎯 **Quick Start**

1. **View Students**: `npm run sql "SELECT * FROM students"`
2. **Open App**: http://localhost:5173
3. **Interactive DB**: `npm run db`

Your attendance management system is fully operational! 🎉
