import React, { useState } from 'react';
import { useAttendance } from '../context/AttendanceContext';

export const ExportData: React.FC = () => {
  const { students, attendance, selectedDate, attendanceStats } = useAttendance();
  const [exportFormat, setExportFormat] = useState<'csv' | 'json'>('csv');
  const [isExporting, setIsExporting] = useState(false);

  const exportToCSV = () => {
    const headers = ['Student Name', 'Class', 'Email', 'Phone', 'Status', 'Date'];
    const csvContent = [
      headers.join(','),
      ...students.map(student => [
        `"${student.name}"`,
        `"${student.class || ''}"`,
        `"${student.email || ''}"`,
        `"${student.phone || ''}"`,
        `"${attendance[student.id] ? 'Present' : 'Absent'}"`,
        `"${selectedDate}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `attendance_${selectedDate}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToJSON = () => {
    const exportData = {
      date: selectedDate,
      summary: attendanceStats,
      students: students.map(student => ({
        id: student.id,
        name: student.name,
        class: student.class,
        email: student.email,
        phone: student.phone,
        status: attendance[student.id] ? 'Present' : 'Absent'
      }))
    };

    const jsonContent = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `attendance_${selectedDate}.json`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      if (exportFormat === 'csv') {
        exportToCSV();
      } else {
        exportToJSON();
      }
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4">Export Attendance Data</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Export Format
          </label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                value="csv"
                checked={exportFormat === 'csv'}
                onChange={(e) => setExportFormat(e.target.value as 'csv')}
                className="mr-2"
              />
              CSV (Excel compatible)
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="json"
                checked={exportFormat === 'json'}
                onChange={(e) => setExportFormat(e.target.value as 'json')}
                className="mr-2"
              />
              JSON (Structured data)
            </label>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">Export Preview</h4>
          <div className="text-sm text-gray-600 space-y-1">
            <p><strong>Date:</strong> {new Date(selectedDate).toLocaleDateString()}</p>
            <p><strong>Total Students:</strong> {students.length}</p>
            <p><strong>Present:</strong> {attendanceStats?.present_count || 0}</p>
            <p><strong>Absent:</strong> {attendanceStats?.absent_count || 0}</p>
            <p><strong>Attendance Rate:</strong> {attendanceStats?.attendance_percentage.toFixed(1) || 0}%</p>
          </div>
        </div>

        <button
          onClick={handleExport}
          disabled={isExporting || students.length === 0}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
        >
          {isExporting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Exporting...
            </>
          ) : (
            <>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export {exportFormat.toUpperCase()}
            </>
          )}
        </button>

        {students.length === 0 && (
          <p className="text-sm text-gray-500 text-center">
            Add students first to export attendance data.
          </p>
        )}
      </div>
    </div>
  );
};
