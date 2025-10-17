import React, { useState } from 'react';
import { useAttendance } from '../context/AttendanceContext';
import { StudentForm } from './StudentForm';

export const StudentManagementModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { students, deleteStudent } = useAttendance();
  const [showForm, setShowForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (student.class && student.class.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleEditStudent = (student: any) => {
    setEditingStudent(student);
    setShowForm(true);
  };

  const handleDeleteStudent = async (studentId: string, studentName: string) => {
    if (window.confirm(`Are you sure you want to delete ${studentName}?`)) {
      await deleteStudent(studentId);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingStudent(null);
  };

  if (showForm) {
    return <StudentForm onClose={handleCloseForm} student={editingStudent} />;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end md:items-center justify-center z-50 p-0 md:p-4">
      <div className="bg-white rounded-t-2xl md:rounded-lg shadow-xl w-full md:max-w-4xl max-h-[90vh] md:max-h-[85vh] overflow-hidden flex flex-col">
        <div className="p-4 md:p-6 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
          <h2 className="text-lg md:text-xl font-semibold text-gray-800">Manage Students</h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowForm(true)}
              className="px-3 py-1.5 md:px-4 md:py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 active:bg-blue-800 transition-colors text-xs md:text-sm touch-manipulation"
            >
              Add Student
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 active:text-gray-800 transition-colors touch-manipulation"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-4 md:p-6 border-b border-gray-200 flex-shrink-0">
          <div className="relative">
            <input
              type="text"
              placeholder="Search students by name or grade..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 md:pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
            />
            <svg
              className="absolute left-3 top-2.5 h-4 w-4 md:h-5 md:w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        <div className="overflow-y-auto flex-1">
          {filteredStudents.length === 0 ? (
            <div className="p-8 text-center text-gray-500 text-sm md:text-base">
              {students.length === 0 ? 'No students found. Add your first student to get started.' : 'No students match your search.'}
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredStudents.map((student) => (
                <div key={student.id} className="p-4 hover:bg-gray-50 active:bg-gray-100 flex items-center justify-between">
                  <div className="flex-1 min-w-0 mr-4">
                    <div className="font-medium text-gray-900 text-sm md:text-base truncate">{student.name}</div>
                    <div className="flex flex-wrap items-center gap-2 md:gap-4 mt-1">
                      {student.class && (
                        <span className="text-xs md:text-sm text-blue-600 font-medium">{student.class}</span>
                      )}
                      {student.email && (
                        <span className="text-xs md:text-sm text-gray-500 truncate">{student.email}</span>
                      )}
                      {student.phone && (
                        <span className="text-xs md:text-sm text-gray-500">{student.phone}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 flex-shrink-0">
                    <button
                      onClick={() => handleEditStudent(student)}
                      className="p-2 text-blue-600 hover:bg-blue-50 active:bg-blue-100 rounded transition-colors touch-manipulation"
                      title="Edit student"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDeleteStudent(student.id, student.name)}
                      className="p-2 text-red-600 hover:bg-red-50 active:bg-red-100 rounded transition-colors touch-manipulation"
                      title="Delete student"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
