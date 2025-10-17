import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import postgres from 'postgres';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize database connection
const sql = postgres(process.env.DATABASE_URL, {
  ssl: 'require',
  max: 1,
  idle_timeout: 20,
  connect_timeout: 10,
  prepare: false, // Disable prepared statements to avoid cached plan issues
});

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Students endpoints
app.get('/api/students', async (req, res) => {
  try {
    const students = await sql`SELECT * FROM students ORDER BY name`;
    res.json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ error: 'Failed to fetch students' });
  }
});

app.post('/api/students', async (req, res) => {
  try {
    const { name, email, phone, class: studentClass } = req.body;
    const student = await sql`
      INSERT INTO students (name, email, phone, class) 
      VALUES (${name}, ${email || null}, ${phone || null}, ${studentClass || null})
      RETURNING *
    `;
    res.status(201).json(student[0]);
  } catch (error) {
    console.error('Error creating student:', error);
    res.status(500).json({ error: 'Failed to create student' });
  }
});

app.put('/api/students/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, class: studentClass } = req.body;
    const student = await sql`
      UPDATE students 
      SET name = COALESCE(${name || null}, name),
          email = COALESCE(${email || null}, email),
          phone = COALESCE(${phone || null}, phone),
          class = COALESCE(${studentClass || null}, class),
          updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;
    
    if (student.length === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }
    
    res.json(student[0]);
  } catch (error) {
    console.error('Error updating student:', error);
    res.status(500).json({ error: 'Failed to update student' });
  }
});

app.delete('/api/students/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await sql`DELETE FROM students WHERE id = ${id}`;
    
    if (result.count === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }
    
    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    console.error('Error deleting student:', error);
    res.status(500).json({ error: 'Failed to delete student' });
  }
});

// Attendance endpoints
app.get('/api/attendance/:date', async (req, res) => {
  try {
    const { date } = req.params;
    const attendance = await sql`
      SELECT a.*, s.name as student_name 
      FROM attendance a 
      JOIN students s ON a.student_id = s.id 
      WHERE a.date = ${date}
    `;
    res.json(attendance);
  } catch (error) {
    console.error('Error fetching attendance:', error);
    res.status(500).json({ error: 'Failed to fetch attendance' });
  }
});

app.post('/api/attendance', async (req, res) => {
  try {
    const { attendanceRecords } = req.body;
    
    if (!attendanceRecords || attendanceRecords.length === 0) {
      return res.status(400).json({ error: 'Attendance records are required' });
    }

    const date = attendanceRecords[0].date;
    
    // Delete existing attendance for the date
    await sql`DELETE FROM attendance WHERE date = ${date}`;

    // Insert new attendance records
    if (attendanceRecords.length > 0) {
      const result = await sql`
        INSERT INTO attendance (student_id, date, is_present) 
        VALUES ${sql(attendanceRecords.map(record => [record.student_id, record.date, record.is_present]))}
        RETURNING *
      `;
      res.status(201).json(result);
    } else {
      res.status(201).json([]);
    }
  } catch (error) {
    console.error('Error saving attendance:', error);
    res.status(500).json({ error: 'Failed to save attendance' });
  }
});

app.get('/api/attendance-stats/:date', async (req, res) => {
  try {
    const { date } = req.params;
    const result = await sql`
      SELECT 
        COUNT(*) as total_students,
        COUNT(CASE WHEN a.is_present THEN 1 END) as present_count,
        COUNT(CASE WHEN NOT a.is_present THEN 1 END) as absent_count
      FROM attendance a
      WHERE a.date = ${date}
    `;
    
    const stats = result[0];
    const attendancePercentage = stats.total_students > 0 
      ? (stats.present_count / stats.total_students) * 100 
      : 0;

    res.json({
      total_students: Number(stats.total_students),
      present_count: Number(stats.present_count),
      absent_count: Number(stats.absent_count),
      attendance_percentage: Number(attendancePercentage.toFixed(1))
    });
  } catch (error) {
    console.error('Error fetching attendance stats:', error);
    res.status(500).json({ error: 'Failed to fetch attendance stats' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});
