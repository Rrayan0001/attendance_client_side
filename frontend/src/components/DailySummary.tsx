import React, { useMemo } from 'react';
import { useAttendance } from '../context/AttendanceContext';

export const DailySummary: React.FC = () => {
  const { students, attendance, selectedDate } = useAttendance();

  const formatDate = (date: string) => {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const totalStudents = students.length;
  const presentCount = Object.values(attendance).filter(v => v).length;
  const absentCount = totalStudents - presentCount;
  const attendanceRate = totalStudents > 0 ? Math.round((presentCount / totalStudents) * 100) : 0;

  // Calculate students needing attention
  const studentsNeedingAttention = useMemo(() => {
    // This is a placeholder - in a real app, you'd fetch this from the backend
    // For now, we'll just show students who are absent today
    return students
      .filter(student => !attendance[student.id])
      .slice(0, 2); // Show top 2
  }, [students, attendance]);

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
      <h2 className="text-base md:text-lg font-semibold text-gray-800 mb-3 md:mb-4">
        Daily Summary - {formatDate(selectedDate)}
      </h2>

      <div className="space-y-3 md:space-y-4">
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs md:text-sm font-medium text-gray-700">Total Students:</span>
            <span className="text-sm md:text-base font-bold text-gray-900">{totalStudents}</span>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs md:text-sm font-medium text-gray-700">Present:</span>
            <span className="text-sm md:text-base font-bold text-green-600">
              {presentCount} ({attendanceRate}%)
            </span>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs md:text-sm font-medium text-gray-700">Absent:</span>
            <span className="text-sm md:text-base font-bold text-red-600">
              {absentCount} ({100 - attendanceRate}%)
            </span>
          </div>
        </div>

        <div className="pt-3 md:pt-4 border-t border-gray-200">
          <div className="mb-2">
            <span className="text-xs md:text-sm font-semibold text-gray-800">Attendance Rate:</span>
          </div>
          <div className="text-2xl md:text-3xl font-bold text-gray-900">{attendanceRate}%</div>
        </div>
      </div>

      {studentsNeedingAttention.length > 0 && (
        <div className="mt-4 md:mt-6 pt-4 md:pt-6 border-t border-gray-200">
          <h3 className="text-xs md:text-sm font-semibold text-gray-800 mb-2 md:mb-3">Students Needing Attention</h3>
          <div className="space-y-2">
            {studentsNeedingAttention.map((student) => (
              <div key={student.id} className="text-xs text-gray-600">
                <span className="font-medium text-red-600">{student.name}</span>
                <span className="text-gray-500"> - Absent today</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
