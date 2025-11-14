import { useState } from 'react';

// Icon Components
const PortfolioIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const AllocationIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const ReturnsIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);

const SettingsIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

export function SideNav() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = [
    { icon: PortfolioIcon, label: 'Portfolio', id: 'portfolio' },
    { icon: AllocationIcon, label: 'Allocation', id: 'allocation' },
    { icon: ReturnsIcon, label: 'Returns', id: 'returns' },
    { icon: SettingsIcon, label: 'Settings', id: 'settings' },
  ];

  return (
    <aside
      className={`bg-white border-r border-fidelity transition-all duration-300 ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
      style={{ minHeight: 'calc(100vh - 60px)' }}
    >
      {/* Toggle Button */}
      <div className="flex justify-end p-3 border-b border-fidelity">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 text-fidelity-gray-medium hover:bg-fidelity-gray-light"
          aria-label={isCollapsed ? 'Expand navigation' : 'Collapse navigation'}
        >
          <svg
            className={`w-5 h-5 transition-transform ${isCollapsed ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={isCollapsed ? 'M9 5l7 7-7 7' : 'M15 19l-7-7 7-7'}
            />
          </svg>
        </button>
      </div>

      {/* Navigation Items */}
      <nav className="py-2">
        {navItems.map((item, index) => {
          const isActive = item.id === 'allocation'; // Set active state
          return (
            <div key={item.id}>
              <a
                href="#"
                className={`relative flex items-center px-4 py-3.5 text-fidelity-gray-medium hover:bg-fidelity-gray-light transition-colors ${
                  isCollapsed ? 'justify-center' : ''
                } ${isActive ? 'bg-fidelity-gray-light font-semibold' : ''}`}
                title={isCollapsed ? item.label : undefined}
              >
                {isActive && !isCollapsed && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-fidelity-green" />
                )}
                <span className="flex-shrink-0" style={{ minWidth: '24px' }}>
                  <item.icon />
                </span>
                {!isCollapsed && (
                  <span className={`ml-3 text-sm ${isActive ? 'font-semibold text-fidelity-gray-dark' : 'font-medium'}`}>
                    {item.label}
                  </span>
                )}
              </a>
              {index < navItems.length - 1 && (
                <div className="border-b border-fidelity mx-4" />
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}

