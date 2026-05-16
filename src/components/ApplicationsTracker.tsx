import { useState, useEffect } from 'react';
import { masterData, Company } from '../data/masterData';
import { Plus, Trash2, Edit2, Download, Upload } from 'lucide-react';
import { format } from 'date-fns';

interface Application {
  id: string;
  companyRow: number;
  companyName: string;
  jobTitle: string;
  appliedDate: string;
  status: 'Applied' | 'Screened' | 'Interview' | 'Offer' | 'Rejected' | 'Withdrawn';
  recruiter: string;
  notes: string;
  link: string;
}

interface Props {
  applications: Application[];
  saveApplications: (apps: Application[]) => void;
  companies: Company[];
}

export default function ApplicationsTracker({ applications, saveApplications, companies }: Props) {
  const [newApp, setNewApp] = useState<Partial<Application>>({
    appliedDate: new Date().toISOString().split('T')[0],
    status: 'Applied'
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  // ==================== AUTO SAVE TO JSON FILE ====================
  useEffect(() => {
    if (applications.length > 0) {
      const dataStr = JSON.stringify(applications, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', 'applications.json');
      linkElement.click();
    }
  }, [applications]);

  const exportData = () => {
    const dataStr = JSON.stringify(applications, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const link = document.createElement('a');
    link.href = dataUri;
    link.download = 'applications.json';
    link.click();
  };

  const importData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string);
        saveApplications(imported);
        alert('✅ Applications imported successfully!');
      } catch (err) {
        alert('❌ Invalid JSON file');
      }
    };
    reader.readAsText(file);
  };

  // ==================== FORM FUNCTIONS ====================
  const addOrUpdateApplication = () => {
    if (!newApp.companyName || !newApp.jobTitle) return;

    const company = companies.find(c => c.name === newApp.companyName);
    
    const app: Application = {
      id: editingId || Date.now().toString(),
      companyRow: company?.row || 0,
      companyName: newApp.companyName!,
      jobTitle: newApp.jobTitle!,
      appliedDate: newApp.appliedDate!,
      status: newApp.status as any,
      recruiter: newApp.recruiter || '',
      notes: newApp.notes || '',
      link: newApp.link || ''
    };

    if (editingId) {
      saveApplications(applications.map(a => a.id === editingId ? app : a));
      setEditingId(null);
    } else {
      saveApplications([...applications, app]);
    }

    setNewApp({ appliedDate: new Date().toISOString().split('T')[0], status: 'Applied' });
  };

  const deleteApp = (id: string) => {
    saveApplications(applications.filter(a => a.id !== id));
  };

  const editApp = (app: Application) => {
    setNewApp(app);
    setEditingId(app.id);
  };

  const statusColors = {
    Applied: 'bg-blue-500/20 text-blue-400',
    Screened: 'bg-yellow-500/20 text-yellow-400',
    Interview: 'bg-purple-500/20 text-purple-400',
    Offer: 'bg-emerald-500/20 text-emerald-400',
    Rejected: 'bg-red-500/20 text-red-400',
    Withdrawn: 'bg-zinc-500/20 text-zinc-400'
  };

  return (
    <div className="space-y-8">
      {/* Add New Application Form */}
      <div className="card p-8">
        <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3">
          <Plus className="w-6 h-6" /> 
          {editingId ? 'Edit Application' : 'Log New Application'}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <select
            value={newApp.companyName || ''}
            onChange={(e) => setNewApp({ ...newApp, companyName: e.target.value })}
            className="input"
          >
            <option value="">Select Company</option>
            {companies.map(c => (
              <option key={c.row} value={c.name}>{c.name}</option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Job Title (e.g. Journeyman Electrician)"
            value={newApp.jobTitle || ''}
            onChange={(e) => setNewApp({ ...newApp, jobTitle: e.target.value })}
            className="input"
          />

          <input
            type="date"
            value={newApp.appliedDate}
            onChange={(e) => setNewApp({ ...newApp, appliedDate: e.target.value })}
            className="input"
          />

          <select
            value={newApp.status}
            onChange={(e) => setNewApp({ ...newApp, status: e.target.value as any })}
            className="input"
          >
            {['Applied', 'Screened', 'Interview', 'Offer', 'Rejected', 'Withdrawn'].map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Recruiter Name / Agency"
            value={newApp.recruiter || ''}
            onChange={(e) => setNewApp({ ...newApp, recruiter: e.target.value })}
            className="input"
          />

          <input
            type="url"
            placeholder="Application Link (optional)"
            value={newApp.link || ''}
            onChange={(e) => setNewApp({ ...newApp, link: e.target.value })}
            className="input"
          />
        </div>

        <textarea
          placeholder="Notes (salary expectations, follow-up dates, etc.)"
          value={newApp.notes || ''}
          onChange={(e) => setNewApp({ ...newApp, notes: e.target.value })}
          className="input h-28 mt-4"
        />

        <button
          onClick={addOrUpdateApplication}
          className="button mt-6 w-full text-lg"
        >
          {editingId ? 'Update Application' : 'Add Application'}
        </button>
      </div>

      {/* Import / Export */}
      <div className="flex gap-4 justify-end">
        <button onClick={exportData} className="button flex items-center gap-2">
          <Download size={18} /> Export applications.json
        </button>
        
        <label className="button flex items-center gap-2 cursor-pointer">
          <Upload size={18} /> Import applications.json
          <input type="file" accept=".json" onChange={importData} className="hidden" />
        </label>
      </div>

      {/* Applications List */}
      <div className="card p-8">
        <h2 className="text-2xl font-semibold mb-6">
          Your Applications ({applications.length})
        </h2>

        {applications.length === 0 ? (
          <div className="text-center py-16 text-zinc-500">
            No applications logged yet. Add one above!
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map(app => (
              <div key={app.id} className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 flex flex-col md:flex-row gap-6 items-start">
                <div className="flex-1">
                  <div className="font-semibold text-lg">{app.companyName}</div>
                  <div className="text-zinc-400">{app.jobTitle}</div>
                </div>

                <div className={`px-5 py-2 rounded-full text-sm font-medium ${statusColors[app.status]}`}>
                  {app.status}
                </div>

                <div className="text-sm text-zinc-400 whitespace-nowrap">
                  {format(new Date(app.appliedDate), 'MMM dd, yyyy')}
                </div>

                {app.recruiter && <div className="text-sm text-zinc-400">📞 {app.recruiter}</div>}

                <div className="flex gap-3 ml-auto">
                  <button onClick={() => editApp(app)} className="p-3 hover:bg-zinc-800 rounded-xl">
                    <Edit2 size={20} />
                  </button>
                  <button onClick={() => deleteApp(app.id)} className="p-3 hover:bg-zinc-800 rounded-xl text-red-400">
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}