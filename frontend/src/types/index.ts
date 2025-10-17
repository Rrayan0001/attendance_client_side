export interface Student {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  class?: string;
  created_at: string;
  updated_at: string;
}

export interface Attendance {
  id: string;
  student_id: string;
  date: string;
  is_present: boolean;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface AttendanceRecord {
  student: Student;
  attendance: Attendance;
}

export interface AttendanceStats {
  total_students: number;
  present_count: number;
  absent_count: number;
  attendance_percentage: number;
}
