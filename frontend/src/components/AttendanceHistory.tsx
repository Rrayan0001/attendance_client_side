import React, { useState, useEffect } from 'react';
import { useAttendance } from '../context/AttendanceContext';

interface AttendanceRecord {
  date: string;
  is_present: boolean;
  notes?: string;
}

export const AttendanceHistory: React.FC = () => {
  const { students } = useAttendance();
  const [selectedStudent, setSelectedStudent] = useState<string>('');
  const [attendanceHistory, setAttendanceHistory] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const fetchAttendanceHistory = async (studentId: string) => {
    if (!studentId) return;
    
    setLoading(true);
    try {
      // TODO: Implement backend endpoint for attendance history
      // For now, show empty history for production deployment
      setAttendanceHistory([]);
    } catch (error) {
      console.error('Error fetching attendance history:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStudentSelect = (studentId: string) => {
    setSelectedStudent(studentId);
    if (studentId) {
      fetchAttendanceHistory(studentId);
      setShowHistory(true);
    }
  };

  const calculateAttendanceRate = () => {
    if (attendanceHistory.length === 0) return 0;
    const presentCount = attendanceHistory.filter(record => record.is_present).length;
    return (presentCount / attendanceHistory.length) * 100;
  };

  const selectedStudentData = students.find(s => s.id === selectedStudent);

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Attendance History</h3>
          {showHistory && (
            <button
              onClick={() => setShowHistory(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {!showHistory ? (
        <div className="p-6">
          <div className="mb-4">
            <label htmlFor="student-select" className="block text-sm font-medium text-gray-700 mb-2">
              Select Student to View History
            </label>
            <select
              id="student-select"
              value={selectedStudent}
              onChange={(e) => handleStudentSelect(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Choose a student...</option>
              {students.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      ) : (
        <div className="p-6">
          {selectedStudentData && (
            <div className="mb-6">
              <h4 className="text-lg font-medium text-gray-900 mb-2">
                {selectedStudentData.name}
              </h4>
              {selectedStudentData.email && (
                <p className="text-sm text-gray-600">{selectedStudentData.email}</p>
              )}
            </div>
          )}

          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <>
              {/* Summary Stats */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 p-3 rounded-lg text-center">
                  <div className="text-lg font-bold text-blue-600">{attendanceHistory.length}</div>
                  <div className="text-xs text-gray-600">Total Days</div>
                </div>
                <div className="bg-green-50 p-3 rounded-lg text-center">
                  <div className="text-lg font-bold text-green-600">
                    {attendanceHistory.filter(r => r.is_present).length}
                  </div>
                  <div className="text-xs text-gray-600">Present</div>
                </div>
                <div className="bg-purple-50 p-3 rounded-lg text-center">
                  <div className="text-lg font-bold text-purple-600">
                    {calculateAttendanceRate().toFixed(1)}%
                  </div>
                  <div className="text-xs text-gray-600">Rate</div>
                </div>
              </div>

              {/* History List */}
              <div className="space-y-2">
                <h5 className="font-medium text-gray-900 mb-3">Recent Attendance</h5>
                {attendanceHistory.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No attendance records found.</p>
                ) : (
                  attendanceHistory.map((record, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <span className={`w-3 h-3 rounded-full ${
                          record.is_present ? 'bg-green-500' : 'bg-red-500'
                        }`}></span>
                        <span className="text-sm font-medium">
                          {new Date(record.date).toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        record.is_present 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {record.is_present ? 'Present' : 'Absent'}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};
