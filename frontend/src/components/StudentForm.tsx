import React, { useState } from 'react';
import { useAttendance } from '../context/AttendanceContext';

interface StudentFormProps {
  onClose: () => void;
  student?: {
    id: string;
    student_number: string;
    name: string;
    email?: string;
    phone?: string;
    class?: string;
    password: string;
    parent_phone?: string;
    parent_email?: string;
    notes?: string;
  };
  generateStudentNumber?: () => string;
}

export const StudentForm: React.FC<StudentFormProps> = ({ onClose, student, generateStudentNumber }) => {
  const { addStudent, updateStudent } = useAttendance();
  const [formData, setFormData] = useState({
    name: student?.name || '',
    email: student?.email || '',
    phone: student?.phone || '',
    studentClass: student?.class || '',
    studentNumber: student?.student_number || (generateStudentNumber ? generateStudentNumber() : ''),
    password: student?.password || '',
    parentPhone: student?.parent_phone || '',
    parentEmail: student?.parent_email || '',
    notes: student?.notes || ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      alert('Name is required');
      return;
    }

    try {
      if (student) {
        await updateStudent(student.id, {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          class: formData.studentClass,
          student_number: formData.studentNumber,
          password: formData.password,
          parent_phone: formData.parentPhone,
          parent_email: formData.parentEmail,
          notes: formData.notes
        });
      } else {
        await addStudent(
          formData.name, 
          formData.email, 
          formData.phone, 
          formData.studentClass,
          formData.studentNumber,
          formData.password,
          formData.parentPhone,
          formData.parentEmail,
          formData.notes
        );
      }
      onClose();
    } catch (error) {
      console.error('Error saving student:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end md:items-center justify-center z-50 p-0 md:p-4">
      <div className="bg-white rounded-t-2xl md:rounded-lg shadow-xl w-full md:w-96 md:max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-4 md:p-6 border-b border-gray-200 flex items-center justify-between md:block">
          <h2 className="text-lg md:text-xl font-bold text-gray-900">
            {student ? 'Edit Student' : 'Add New Student'}
          </h2>
          <button
            onClick={onClose}
            className="md:hidden p-2 text-gray-400 hover:text-gray-600 active:text-gray-800 transition-colors touch-manipulation"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2.5 md:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-base touch-manipulation"
              required
              placeholder="Enter student name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Student Number *
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={formData.studentNumber}
                onChange={(e) => setFormData({ ...formData, studentNumber: e.target.value })}
                className="flex-1 px-3 py-2.5 md:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-base touch-manipulation font-mono"
                required
                placeholder="STU241234"
              />
              {!student && (
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, studentNumber: generateStudentNumber?.() || '' })}
                  className="px-3 py-2.5 md:py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm"
                >
                  Generate
                </button>
              )}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password *
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-3 py-2.5 md:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-base touch-manipulation"
              required
              placeholder="Student login password"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Class/Grade
            </label>
            <input
              type="text"
              value={formData.studentClass}
              onChange={(e) => setFormData({ ...formData, studentClass: e.target.value })}
              placeholder="e.g., 10A, Grade 10, etc."
              className="w-full px-3 py-2.5 md:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-base touch-manipulation"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Student Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2.5 md:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-base touch-manipulation"
              placeholder="student@example.com"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Student Phone
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-3 py-2.5 md:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-base touch-manipulation"
              placeholder="Student phone number"
            />
          </div>

          <div className="border-t pt-4">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Parent Information</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Parent Email
                </label>
                <input
                  type="email"
                  value={formData.parentEmail}
                  onChange={(e) => setFormData({ ...formData, parentEmail: e.target.value })}
                  className="w-full px-3 py-2.5 md:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-base touch-manipulation"
                  placeholder="parent@example.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Parent Phone
                </label>
                <input
                  type="tel"
                  value={formData.parentPhone}
                  onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
                  className="w-full px-3 py-2.5 md:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-base touch-manipulation"
                  placeholder="Parent phone number"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3 py-2.5 md:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-base touch-manipulation"
              placeholder="Additional notes about the student"
              rows={3}
            />
          </div>
          
          <div className="flex flex-col-reverse md:flex-row justify-end space-y-reverse space-y-2 md:space-y-0 md:space-x-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="w-full md:w-auto px-4 py-2.5 md:py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 active:bg-gray-100 transition-colors touch-manipulation"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full md:w-auto px-4 py-2.5 md:py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 active:bg-blue-800 transition-colors touch-manipulation"
            >
              {student ? 'Update' : 'Add'} Student
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
