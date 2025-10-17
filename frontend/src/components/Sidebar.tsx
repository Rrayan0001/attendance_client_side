import React from 'react';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeSection, onSectionChange }) => {
  const menuItems = [
    { id: 'dashboard', icon: '⚙️', label: 'Dashboard' },
    { id: 'attendance', icon: '👥', label: 'Attendance' },
    { id: 'reports', icon: '📊', label: 'Reports' },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex w-24 bg-[#2c3e50] text-white flex-col items-center py-6 space-y-6">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onSectionChange(item.id)}
            className={`flex flex-col items-center justify-center w-16 h-16 rounded-lg transition-colors ${
              activeSection === item.id
                ? 'bg-[#34495e] text-white'
                : 'text-gray-300 hover:bg-[#34495e] hover:text-white'
            }`}
            title={item.label}
          >
            <span className="text-2xl mb-1">{item.icon}</span>
            <span className="text-[10px] text-center leading-tight">{item.label}</span>
          </button>
        ))}
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#2c3e50] text-white border-t border-gray-700 z-50 safe-area-inset-bottom">
        <div className="flex justify-around items-center h-16">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                activeSection === item.id
                  ? 'bg-[#34495e] text-white'
                  : 'text-gray-300 active:bg-[#34495e]'
              }`}
            >
              <span className="text-xl mb-1">{item.icon}</span>
              <span className="text-[9px] text-center leading-tight">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
};
