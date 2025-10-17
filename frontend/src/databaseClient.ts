import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Database helper functions
export const db = {
  // Students
  async getStudents() {
    const response = await api.get('/students')
    return response.data
  },

  async addStudent(name: string, email?: string, phone?: string, studentClass?: string) {
    const response = await api.post('/students', { name, email, phone, class: studentClass })
    return [response.data]
  },

  async updateStudent(id: string, updates: { name?: string; email?: string; phone?: string; class?: string }) {
    const response = await api.put(`/students/${id}`, updates)
    return [response.data]
  },

  async deleteStudent(id: string) {
    await api.delete(`/students/${id}`)
  },

  // Attendance
  async getAttendance(date: string) {
    const response = await api.get(`/attendance/${date}`)
    return response.data
  },

  async saveAttendance(attendanceRecords: Array<{ student_id: string; date: string; is_present: boolean }>) {
    const response = await api.post('/attendance', { attendanceRecords })
    return response.data
  },

  async getAttendanceStats(date: string) {
    const response = await api.get(`/attendance-stats/${date}`)
    return response.data
  }
}