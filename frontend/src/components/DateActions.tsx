import React from 'react';
import { useAttendance } from '../context/AttendanceContext';

export const DateActions: React.FC = () => {
  const { selectedDate, setSelectedDate, students, updateAttendance } = useAttendance();

  const formatDate = (date: string) => {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  const setToday = () => {
    setSelectedDate(new Date().toISOString().split('T')[0]);
  };

  const setYesterday = () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    setSelectedDate(yesterday.toISOString().split('T')[0]);
  };

  const setLastWeek = () => {
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);
    setSelectedDate(lastWeek.toISOString().split('T')[0]);
  };

  const markAllPresent = () => {
    students.forEach(student => {
      updateAttendance(student.id, true);
    });
  };

  const markAllAbsent = () => {
    students.forEach(student => {
      updateAttendance(student.id, false);
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
      <h2 className="text-base md:text-lg font-semibold text-gray-800 mb-3 md:mb-4">Date & Actions</h2>
      
      <div className="mb-4 md:mb-6">
        <div className="flex items-center justify-center bg-blue-600 text-white rounded-lg p-3 md:p-4 space-x-2 md:space-x-3">
          <svg className="w-5 h-5 md:w-6 md:h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            max={new Date().toISOString().split('T')[0]}
            className="bg-transparent border-none text-white text-sm md:text-base font-medium focus:outline-none cursor-pointer w-full"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-4 md:mb-6 md:grid-cols-1 md:space-y-2">
        <button
          onClick={setToday}
          className="px-2 py-2 md:px-4 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 active:bg-gray-300 transition-colors text-xs md:text-sm font-medium"
        >
          Today
        </button>
        <button
          onClick={setYesterday}
          className="px-2 py-2 md:px-4 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 active:bg-gray-300 transition-colors text-xs md:text-sm font-medium"
        >
          Yesterday
        </button>
        <button
          onClick={setLastWeek}
          className="px-2 py-2 md:px-4 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 active:bg-gray-300 transition-colors text-xs md:text-sm font-medium"
        >
          Last Week
        </button>
      </div>

      <div className="space-y-2">
        <button
          onClick={markAllPresent}
          className="w-full px-3 py-2 md:px-4 md:py-3 bg-green-500 text-white rounded-md hover:bg-green-600 active:bg-green-700 transition-colors font-medium text-sm md:text-base touch-manipulation"
        >
          Mark All Present
        </button>
        <button
          onClick={markAllAbsent}
          className="w-full px-3 py-2 md:px-4 md:py-3 bg-red-500 text-white rounded-md hover:bg-red-600 active:bg-red-700 transition-colors font-medium text-sm md:text-base touch-manipulation"
        >
          Mark All Absent
        </button>
      </div>

      <div className="mt-4 md:mt-6 pt-4 md:pt-6 border-t border-gray-200">
        <p className="text-xs text-gray-500 mb-1">Attendance for:</p>
        <p className="text-xs md:text-sm font-medium text-gray-700">{formatDate(selectedDate)}</p>
      </div>
    </div>
  );
};
