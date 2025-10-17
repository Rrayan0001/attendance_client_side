import postgres from 'postgres'

const connectionString = import.meta.env.VITE_NEON_DATABASE_URL

export const sql = postgres(connectionString, {
  ssl: 'require',
  max: 1,
  idle_timeout: 20,
  connect_timeout: 10,
})

// Database helper functions
export const db = {
  // Students
  async getStudents() {
    return await sql`SELECT * FROM students ORDER BY name`
  },

  async addStudent(name: string, email?: string, phone?: string) {
    return await sql`
      INSERT INTO students (name, email, phone) 
      VALUES (${name}, ${email || null}, ${phone || null})
      RETURNING *
    `
  },

  async updateStudent(id: string, updates: { name?: string; email?: string; phone?: string }) {
    return await sql`
      UPDATE students 
      SET name = COALESCE(${updates.name || null}, name),
          email = COALESCE(${updates.email || null}, email),
          phone = COALESCE(${updates.phone || null}, phone),
          updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `
  },

  async deleteStudent(id: string) {
    return await sql`DELETE FROM students WHERE id = ${id}`
  },

  // Attendance
  async getAttendance(date: string) {
    return await sql`
      SELECT a.*, s.name as student_name 
      FROM attendance a 
      JOIN students s ON a.student_id = s.id 
      WHERE a.date = ${date}
    `
  },

  async saveAttendance(attendanceRecords: Array<{ student_id: string; date: string; is_present: boolean }>) {
    // Delete existing attendance for the date
    const date = attendanceRecords[0]?.date
    if (date) {
      await sql`DELETE FROM attendance WHERE date = ${date}`
    }

    // Insert new attendance records
    if (attendanceRecords.length > 0) {
      return await sql`
        INSERT INTO attendance (student_id, date, is_present) 
        VALUES ${sql(attendanceRecords)}
        RETURNING *
      `
    }
  },

  async getAttendanceStats(date: string) {
    const result = await sql`
      SELECT 
        COUNT(*) as total_students,
        COUNT(CASE WHEN a.is_present THEN 1 END) as present_count,
        COUNT(CASE WHEN NOT a.is_present THEN 1 END) as absent_count
      FROM attendance a
      WHERE a.date = ${date}
    `
    
    const stats = result[0]
    const attendancePercentage = stats.total_students > 0 
      ? (stats.present_count / stats.total_students) * 100 
      : 0

    return {
      total_students: Number(stats.total_students),
      present_count: Number(stats.present_count),
      absent_count: Number(stats.absent_count),
      attendance_percentage: Number(attendancePercentage.toFixed(1))
    }
  }
}