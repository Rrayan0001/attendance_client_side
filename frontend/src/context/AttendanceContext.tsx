import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { db } from '../databaseClient';
import { Student, Attendance, AttendanceStats } from '../types';

interface ToastNotification {
  message: string;
  type: 'success' | 'error' | 'info';
}

interface AttendanceContextType {
  students: Student[];
  attendance: { [key: string]: boolean };
  selectedDate: string;
  attendanceStats: AttendanceStats | null;
  loading: boolean;
  error: string | null;
  toast: ToastNotification | null;
  
  // Actions
  setSelectedDate: (date: string) => void;
  updateAttendance: (studentId: string, isPresent: boolean) => void;
  loadStudents: () => Promise<void>;
  loadAttendance: (date: string) => Promise<void>;
  saveAttendance: () => Promise<void>;
  addStudent: (name: string, email?: string, phone?: string) => Promise<void>;
  updateStudent: (id: string, updates: Partial<Student>) => Promise<void>;
  deleteStudent: (id: string) => Promise<void>;
  showToast: (message: string, type: 'success' | 'error' | 'info') => void;
  hideToast: () => void;
}

const AttendanceContext = createContext<AttendanceContextType | undefined>(undefined);

export const useAttendance = () => {
  const context = useContext(AttendanceContext);
  if (!context) {
    throw new Error('useAttendance must be used within an AttendanceProvider');
  }
  return context;
};

interface AttendanceProviderProps {
  children: ReactNode;
}

export const AttendanceProvider: React.FC<AttendanceProviderProps> = ({ children }) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<{ [key: string]: boolean }>({});
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceStats, setAttendanceStats] = useState<AttendanceStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastNotification | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
  };

  const hideToast = () => {
    setToast(null);
  };

  const loadStudents = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await db.getStudents();
      setStudents(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  const loadAttendance = async (date: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await db.getAttendance(date);
      const stats = await db.getAttendanceStats(date);

      const attendanceMap: { [key: string]: boolean } = {};
      data?.forEach((record: any) => {
        attendanceMap[record.student_id] = record.is_present;
      });

      setAttendance(attendanceMap);
      setAttendanceStats(stats);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load attendance');
    } finally {
      setLoading(false);
    }
  };

  const updateAttendance = (studentId: string, isPresent: boolean) => {
    setAttendance(prev => ({ ...prev, [studentId]: isPresent }));
  };

  const saveAttendance = async () => {
    try {
      setLoading(true);
      setError(null);

      const attendanceRecords = Object.entries(attendance).map(([studentId, isPresent]) => ({
        student_id: studentId,
        date: selectedDate,
        is_present: isPresent
      }));

      await db.saveAttendance(attendanceRecords);

      // Reload attendance to get updated stats
      await loadAttendance(selectedDate);
      
      // Show success toast
      showToast('Your changes have been saved', 'success');
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to save attendance';
      setError(errorMsg);
      showToast(errorMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const addStudent = async (name: string, email?: string, phone?: string, studentClass?: string) => {
    try {
      setLoading(true);
      setError(null);

      const data = await db.addStudent(name, email, phone, studentClass);
      setStudents(prev => [...prev, data[0]]);
      showToast(`${name} has been added successfully`, 'success');
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to add student';
      setError(errorMsg);
      showToast(errorMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const updateStudent = async (id: string, updates: Partial<Student>) => {
    try {
      setLoading(true);
      setError(null);

      const data = await db.updateStudent(id, updates);
      setStudents(prev => prev.map(student => 
        student.id === id ? data[0] : student
      ));
      showToast('Student updated successfully', 'success');
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to update student';
      setError(errorMsg);
      showToast(errorMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const deleteStudent = async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      await db.deleteStudent(id);
      setStudents(prev => prev.filter(student => student.id !== id));
      showToast('Student deleted successfully', 'success');
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to delete student';
      setError(errorMsg);
      showToast(errorMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  useEffect(() => {
    if (students.length > 0) {
      loadAttendance(selectedDate);
    }
  }, [selectedDate, students]);

  const value: AttendanceContextType = {
    students,
    attendance,
    selectedDate,
    attendanceStats,
    loading,
    error,
    toast,
    setSelectedDate,
    updateAttendance,
    loadStudents,
    loadAttendance,
    saveAttendance,
    addStudent,
    updateStudent,
    deleteStudent,
    showToast,
    hideToast
  };

  return (
    <AttendanceContext.Provider value={value}>
      {children}
    </AttendanceContext.Provider>
  );
};
