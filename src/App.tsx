import { useState } from 'react';
import Dashboard from './components/Dashboard';
import CompaniesTable from './components/CompaniesTable';
import ApplicationsTracker from './components/ApplicationsTracker';
import { masterData } from './data/masterData';

function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'companies' | 'applications'>('dashboard');
  const [applications, setApplications] = useState(() => {
    const saved = localStorage.getItem('applications');
    return saved ? JSON.parse(saved) : [];
  });

  const saveApplications = (newApps: any[]) => {
    setApplications(newApps);
    localStorage.setItem('applications', JSON.stringify(newApps));
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white pb-12">
      <div className="max-w-screen-2xl mx-auto px-6 pt-8">
        {/* Header */}
        <div className="flex justify-between items-end mb-10">
          <div>
            <h1 className="text-5xl font-bold tracking-tighter">IECRM Job Tracker</h1>
            <p className="text-zinc-400 mt-2 text-lg">
              Fort Collins / Northern Colorado • AI & Data Center Priority
            </p>
          </div>
          <div className="text-right text-sm">
            <div className="text-zinc-500">{masterData.length} Companies Loaded</div>
            <div className="text-emerald-400 text-xs">May 2026</div>
          </div>
        </div>

        {/* Modern Tabs */}
        <div className="flex border-b border-zinc-800 mb-10">
          {[
            { id: 'dashboard', label: 'Dashboard' },
            { id: 'companies', label: 'Companies' },
            { id: 'applications', label: 'Applications' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-10 py-4 text-lg font-medium transition-all relative
                ${activeTab === tab.id 
                  ? 'text-white' 
                  : 'text-zinc-400 hover:text-zinc-200'
                }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 rounded" />
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'dashboard' && <Dashboard masterData={masterData} applications={applications} />}
          {activeTab === 'companies' && <CompaniesTable />}
          {activeTab === 'applications' && (
            <ApplicationsTracker 
              applications={applications} 
              saveApplications={saveApplications} 
              companies={masterData} 
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;