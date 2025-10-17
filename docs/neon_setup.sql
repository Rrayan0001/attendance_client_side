-- =============================================
-- Tuition Attendance Management System
-- Neon Database Setup
-- =============================================

-- Create students table
CREATE TABLE students (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  class TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create attendance table
CREATE TABLE attendance (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  is_present BOOLEAN NOT NULL DEFAULT false,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(student_id, date)
);

-- Create indexes for better performance
CREATE INDEX idx_attendance_date ON attendance(date);
CREATE INDEX idx_attendance_student_id ON attendance(student_id);
CREATE INDEX idx_students_name ON students(name);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_students_updated_at 
  BEFORE UPDATE ON students 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_attendance_updated_at 
  BEFORE UPDATE ON attendance 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data (optional - remove if you don't want sample data)
INSERT INTO students (name, email, phone) VALUES
  ('John Doe', 'john.doe@example.com', '+1234567890'),
  ('Jane Smith', 'jane.smith@example.com', '+1234567891'),
  ('Mike Johnson', 'mike.johnson@example.com', '+1234567892'),
  ('Sarah Wilson', 'sarah.wilson@example.com', '+1234567893'),
  ('David Brown', 'david.brown@example.com', '+1234567894');

-- Insert sample attendance data (optional - remove if you don't want sample data)
INSERT INTO attendance (student_id, date, is_present) 
SELECT 
  s.id,
  CURRENT_DATE - INTERVAL '1 day' as date,
  CASE WHEN random() > 0.3 THEN true ELSE false END as is_present
FROM students s;

-- Create a view for attendance summary
CREATE VIEW attendance_summary AS
SELECT 
  a.date,
  COUNT(*) as total_students,
  COUNT(CASE WHEN a.is_present THEN 1 END) as present_count,
  COUNT(CASE WHEN NOT a.is_present THEN 1 END) as absent_count,
  ROUND(
    (COUNT(CASE WHEN a.is_present THEN 1 END)::DECIMAL / COUNT(*)) * 100, 
    2
  ) as attendance_percentage
FROM attendance a
GROUP BY a.date
ORDER BY a.date DESC;

-- Create a view for student attendance history
CREATE VIEW student_attendance_history AS
SELECT 
  s.id as student_id,
  s.name,
  s.email,
  s.phone,
  a.date,
  a.is_present,
  a.notes,
  a.created_at as attendance_created_at
FROM students s
LEFT JOIN attendance a ON s.id = a.student_id
ORDER BY s.name, a.date DESC;

-- =============================================
-- Setup Complete!
-- =============================================
-- 
-- Your Neon database is now ready with:
-- ✅ Students table with sample data
-- ✅ Attendance table with sample data  
-- ✅ Proper indexes for performance
-- ✅ Automatic timestamp updates
-- ✅ Attendance summary view
-- ✅ Student attendance history view
--
-- Next steps:
-- 1. Get your Neon connection string from the dashboard
-- 2. Create .env.local file with your connection string
-- 3. Start the application!
-- =============================================
