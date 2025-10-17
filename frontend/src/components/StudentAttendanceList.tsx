import React, { useState } from 'react';
import { useAttendance } from '../context/AttendanceContext';
import { StudentManagementModal } from './StudentManagementModal';

export const StudentAttendanceList: React.FC = () => {
  const { students, attendance, updateAttendance, saveAttendance, loading } = useAttendance();
  const [searchTerm, setSearchTerm] = useState('');
  const [showManageModal, setShowManageModal] = useState(false);

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (student.class && student.class.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSave = async () => {
    await saveAttendance();
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-4 md:p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <h2 className="text-base md:text-lg font-semibold text-gray-800">Student Attendance</h2>
            <button
              onClick={() => setShowManageModal(true)}
              className="px-2 py-1 md:px-3 text-xs md:text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 active:bg-gray-300 transition-colors touch-manipulation"
            >
              Manage
            </button>
          </div>
          
          <div className="relative">
            <input
              type="text"
              placeholder="Search Student by Name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 md:pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
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

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Grade
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                    No students found
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => {
                  const isPresent = attendance[student.id] || false;
                  return (
                    <tr key={student.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="text-sm font-medium text-gray-900">{student.name}</span>
                          {student.notes && (
                            <span className="ml-2 text-xs text-red-500" title={student.notes}>
                              ⚠️
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-700">{student.class || 'N/A'}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => updateAttendance(student.id, !isPresent)}
                          className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                          style={{
                            backgroundColor: isPresent ? '#10b981' : '#ef4444'
                          }}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              isPresent ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden divide-y divide-gray-200">
          {filteredStudents.length === 0 ? (
            <div className="p-8 text-center text-gray-500 text-sm">
              No students found
            </div>
          ) : (
            filteredStudents.map((student) => {
              const isPresent = attendance[student.id] || false;
              return (
                <div key={student.id} className="p-4 active:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0 mr-3">
                      <div className="flex items-center">
                        <h3 className="text-sm font-medium text-gray-900 truncate">
                          {student.name}
                        </h3>
                        {student.notes && (
                          <span className="ml-2 text-xs text-red-500" title={student.notes}>
                            ⚠️
                          </span>
                        )}
                      </div>
                      {student.class && (
                        <p className="text-xs text-blue-600 font-medium mt-1">{student.class}</p>
                      )}
                    </div>
                    <button
                      onClick={() => updateAttendance(student.id, !isPresent)}
                      className="relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none active:scale-95 touch-manipulation flex-shrink-0"
                      style={{
                        backgroundColor: isPresent ? '#10b981' : '#ef4444'
                      }}
                    >
                      <span
                        className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                          isPresent ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="p-4 md:p-6 border-t border-gray-200 flex justify-center">
          <button
            onClick={handleSave}
            disabled={loading}
            className="w-full md:w-auto px-6 md:px-8 py-2.5 md:py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm md:text-base touch-manipulation"
          >
            {loading ? 'Saving...' : 'Save Attendance'}
          </button>
        </div>
      </div>
      
      {showManageModal && (
        <StudentManagementModal onClose={() => setShowManageModal(false)} />
      )}
    </>
  );
};
