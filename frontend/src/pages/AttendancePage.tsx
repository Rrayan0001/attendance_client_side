import React, { useState } from 'react';
import { useAttendance } from '../context/AttendanceContext';
import { AttendanceStats } from '../components/AttendanceStats';
import { StudentList } from '../components/StudentList';
import { AttendanceHistory } from '../components/AttendanceHistory';
import { ExportData } from '../components/ExportData';

export default function AttendancePage() {
  const { 
    selectedDate, 
    setSelectedDate, 
    saveAttendance, 
    loading, 
    error 
  } = useAttendance();
  
  const [activeTab, setActiveTab] = useState<'attendance' | 'history' | 'export'>('attendance');

  const handleSaveAttendance = async () => {
    await saveAttendance();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-4 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Tuition Attendance Management
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mb-4">
            Track and manage student attendance for your tuition classes
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">
                    Teacher Tip: Mark Attendance for Classes
                  </h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <p>You can mark attendance for classes by:</p>
                    <ul className="list-disc list-inside mt-1 space-y-1">
                      <li>Selecting today or any previous date using the date picker</li>
                      <li>Using the quick buttons (Today, Yesterday, Last Week)</li>
                      <li>Marking students as present/absent for that date</li>
                      <li>Saving the attendance to update records</li>
                    </ul>
                  </div>
                </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            {error}
          </div>
        )}

        <div className="mb-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex flex-col space-y-4">
              <div className="flex flex-col space-y-4">
                <div className="flex-1">
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                    Select Class Date
                  </label>
                  <input
                    type="date"
                    id="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    max={new Date().toISOString().split('T')[0]}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    You can mark attendance for today or previous class dates
                  </p>
                </div>
                
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}
                    className="px-3 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors text-sm touch-manipulation"
                  >
                    Today
                  </button>
                  <button
                    onClick={() => {
                      const yesterday = new Date();
                      yesterday.setDate(yesterday.getDate() - 1);
                      setSelectedDate(yesterday.toISOString().split('T')[0]);
                    }}
                    className="px-3 py-2 bg-purple-100 text-purple-700 rounded-md hover:bg-purple-200 transition-colors text-sm touch-manipulation"
                  >
                    Yesterday
                  </button>
                  <button
                    onClick={() => {
                      const lastWeek = new Date();
                      lastWeek.setDate(lastWeek.getDate() - 7);
                      setSelectedDate(lastWeek.toISOString().split('T')[0]);
                    }}
                    className="px-3 py-2 bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors text-sm touch-manipulation"
                  >
                    Last Week
                  </button>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center pt-4 border-t border-gray-200 space-y-3 sm:space-y-0">
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Selected Date:</span> {new Date(selectedDate).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </div>
                
                <button
                  onClick={handleSaveAttendance}
                  disabled={loading}
                  className="w-full sm:w-auto px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors touch-manipulation"
                >
                  {loading ? 'Saving...' : 'Save Attendance'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-2 sm:space-x-8 overflow-x-auto">
              <button
                onClick={() => setActiveTab('attendance')}
                className={`py-2 px-2 sm:px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap touch-manipulation ${
                  activeTab === 'attendance'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                📅 Mark Attendance
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`py-2 px-2 sm:px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap touch-manipulation ${
                  activeTab === 'history'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                📊 View History
              </button>
              <button
                onClick={() => setActiveTab('export')}
                className={`py-2 px-2 sm:px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap touch-manipulation ${
                  activeTab === 'export'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                📤 Export Data
              </button>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'attendance' && (
          <>
            <AttendanceStats />
            <StudentList />
          </>
        )}
        {activeTab === 'history' && <AttendanceHistory />}
        {activeTab === 'export' && <ExportData />}
      </div>
    </div>
  );
}