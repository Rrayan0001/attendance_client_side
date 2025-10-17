import React from 'react';
import { useAttendance } from '../context/AttendanceContext';

export const AttendanceStats: React.FC = () => {
  const { attendanceStats, selectedDate } = useAttendance();

  if (!attendanceStats) {
    return null;
  }

  const isPastDate = new Date(selectedDate) < new Date();
  const isToday = selectedDate === new Date().toISOString().split('T')[0];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">
          Attendance Summary - {new Date(selectedDate).toLocaleDateString('en-US', { 
            weekday: 'long', 
            month: 'short', 
            day: 'numeric' 
          })}
        </h3>
        {isToday && (
          <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
            📅 Today
          </span>
        )}
        {isPastDate && !isToday && (
          <span className="px-3 py-1 bg-orange-100 text-orange-800 text-sm rounded-full">
            📅 Past Date
          </span>
        )}
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg text-center">
          <div className="text-3xl font-bold text-blue-600">{attendanceStats.total_students}</div>
          <div className="text-sm text-gray-600 mt-1">Total Students</div>
          <div className="text-xs text-gray-500 mt-1">📚 Enrolled</div>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg text-center">
          <div className="text-3xl font-bold text-green-600">{attendanceStats.present_count}</div>
          <div className="text-sm text-gray-600 mt-1">Present</div>
          <div className="text-xs text-gray-500 mt-1">✅ Attended</div>
        </div>
        
        <div className="bg-red-50 p-4 rounded-lg text-center">
          <div className="text-3xl font-bold text-red-600">{attendanceStats.absent_count}</div>
          <div className="text-sm text-gray-600 mt-1">Absent</div>
          <div className="text-xs text-gray-500 mt-1">❌ Missed</div>
        </div>
        
        <div className="bg-purple-50 p-4 rounded-lg text-center">
          <div className="text-3xl font-bold text-purple-600">
            {attendanceStats.attendance_percentage.toFixed(1)}%
          </div>
          <div className="text-sm text-gray-600 mt-1">Attendance Rate</div>
          <div className="text-xs text-gray-500 mt-1">
            {attendanceStats.attendance_percentage >= 80 ? '🎉 Excellent' : 
             attendanceStats.attendance_percentage >= 60 ? '👍 Good' : '⚠️ Needs Attention'}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Attendance Progress</span>
          <span>{attendanceStats.attendance_percentage.toFixed(1)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className={`h-3 rounded-full transition-all duration-500 ${
              attendanceStats.attendance_percentage >= 80 ? 'bg-green-500' :
              attendanceStats.attendance_percentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: `${Math.min(attendanceStats.attendance_percentage, 100)}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};
