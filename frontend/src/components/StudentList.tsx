import React, { useState, useMemo } from 'react';
import { useAttendance } from '../context/AttendanceContext';
import { StudentForm } from './StudentForm';

export const StudentList: React.FC = () => {
  const { students, attendance, updateAttendance, deleteStudent, loading, selectedDate } = useAttendance();
  const [showForm, setShowForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'present' | 'absent'>('all');

  const handleEditStudent = (student: any) => {
    setEditingStudent(student);
    setShowForm(true);
  };

  const handleDeleteStudent = async (studentId: string, studentName: string) => {
    if (window.confirm(`Are you sure you want to delete ${studentName}?`)) {
      await deleteStudent(studentId);
    }
  };

  const isPastDate = new Date(selectedDate) < new Date();
  const isToday = selectedDate === new Date().toISOString().split('T')[0];

  // Filter and search students
  const filteredStudents = useMemo(() => {
    return students.filter(student => {
      const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (student.email && student.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
                           (student.phone && student.phone.includes(searchTerm)) ||
                           (student.class && student.class.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const isPresent = attendance[student.id] || false;
      const matchesFilter = filterStatus === 'all' || 
                           (filterStatus === 'present' && isPresent) ||
                           (filterStatus === 'absent' && !isPresent);
      
      return matchesSearch && matchesFilter;
    });
  }, [students, searchTerm, filterStatus, attendance]);

  // Bulk actions
  const markAllPresent = () => {
    students.forEach(student => {
      if (!attendance[student.id]) {
        updateAttendance(student.id, true);
      }
    });
  };

  const markAllAbsent = () => {
    students.forEach(student => {
      if (attendance[student.id]) {
        updateAttendance(student.id, false);
      }
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col space-y-4">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">Students ({filteredStudents.length} of {students.length})</h3>
            {isToday && (
              <p className="text-sm text-green-600 mt-1">
                📅 Marking attendance for today
              </p>
            )}
            {isPastDate && !isToday && (
              <p className="text-sm text-orange-600 mt-1">
                📅 Updating attendance for past date: {new Date(selectedDate).toLocaleDateString()}
              </p>
            )}
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Add Student
            </button>
          </div>

          {/* Search and Filter Controls */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search students by name, email, phone, or class..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Filter */}
            <div className="flex gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as 'all' | 'present' | 'absent')}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Students</option>
                <option value="present">Present Only</option>
                <option value="absent">Absent Only</option>
              </select>
            </div>
          </div>

          {/* Bulk Actions */}
          {students.length > 0 && (
            <div className="flex gap-2">
              <button
                onClick={markAllPresent}
                className="px-3 py-1 bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors text-sm"
              >
                Mark All Present
              </button>
              <button
                onClick={markAllAbsent}
                className="px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors text-sm"
              >
                Mark All Absent
              </button>
            </div>
          )}
        </div>
      </div>
      
      <div className="divide-y divide-gray-200">
        {students.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No students found. Add your first student to get started.
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No students match your search criteria. Try adjusting your search or filter.
          </div>
        ) : (
          filteredStudents.map((student) => (
            <div key={student.id} className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
              <div className="flex items-center space-x-4">
                <input
                  type="checkbox"
                  checked={attendance[student.id] || false}
                  onChange={(e) => updateAttendance(student.id, e.target.checked)}
                  className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded touch-manipulation"
                />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 truncate">{student.name}</div>
                  {student.class && (
                    <div className="text-sm text-blue-600 font-medium">{student.class}</div>
                  )}
                  {student.email && (
                    <div className="text-sm text-gray-500 truncate">{student.email}</div>
                  )}
                  {student.phone && (
                    <div className="text-sm text-gray-500">{student.phone}</div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center justify-between sm:justify-end space-x-2">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  attendance[student.id] 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {attendance[student.id] ? 'Present' : 'Absent'}
                </span>
                
                <div className="flex space-x-1">
                  <button
                    onClick={() => handleEditStudent(student)}
                    className="p-2 text-gray-400 hover:text-blue-600 transition-colors touch-manipulation"
                    title="Edit student"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  
                  <button
                    onClick={() => handleDeleteStudent(student.id, student.name)}
                    className="p-2 text-gray-400 hover:text-red-600 transition-colors touch-manipulation"
                    title="Delete student"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      
      {showForm && (
        <StudentForm
          onClose={() => {
            setShowForm(false);
            setEditingStudent(null);
          }}
          student={editingStudent}
        />
      )}
    </div>
  );
};
