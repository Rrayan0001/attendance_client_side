import React, { useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { Header } from '../components/Header';
import { DateActions } from '../components/DateActions';
import { StudentAttendanceList } from '../components/StudentAttendanceList';
import { DailySummary } from '../components/DailySummary';
import { AttendanceHistory } from '../components/AttendanceHistory';
import { ExportData } from '../components/ExportData';

export default function AttendancePage() {
  const [activeSection, setActiveSection] = useState('attendance');

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header />
        
        {/* Content Area - Add padding bottom for mobile bottom nav */}
        <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
          {activeSection === 'dashboard' && (
            <div className="p-4 md:p-6">
              <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 md:mb-6">Dashboard</h1>
              <div className="bg-white rounded-lg shadow-sm p-6 md:p-8 text-center">
                <p className="text-gray-600 text-sm md:text-base">Dashboard content coming soon...</p>
              </div>
            </div>
          )}

          {activeSection === 'attendance' && (
            <div className="p-4 md:p-6">
              {/* Mobile: Stack vertically */}
              {/* Desktop: 3-column grid */}
              <div className="space-y-4 md:space-y-0 md:grid md:grid-cols-12 md:gap-6">
                {/* Left Panel - Date & Actions */}
                <div className="md:col-span-3">
                  <DateActions />
                </div>

                {/* Center Panel - Student Attendance */}
                <div className="md:col-span-6">
                  <StudentAttendanceList />
                </div>

                {/* Right Panel - Daily Summary */}
                <div className="md:col-span-3">
                  <DailySummary />
                </div>
              </div>
            </div>
          )}

          {activeSection === 'reports' && (
            <div className="p-4 md:p-6">
              <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 md:mb-6">Attendance Reports</h1>
              <div className="space-y-4 md:space-y-6">
                <AttendanceHistory />
                <ExportData />
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
