import { useState } from 'react';
import { masterData, Company } from '../data/masterData';
import { Plus, Trash2, Edit2 } from 'lucide-react';
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
      <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Plus className="w-5 h-5" /> {editingId ? 'Edit Application' : 'Log New Application'}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <select
            value={newApp.companyName || ''}
            onChange={(e) => setNewApp({ ...newApp, companyName: e.target.value })}
            className="bg-zinc-950 border border-zinc-700 p-3 rounded-xl"
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
            className="bg-zinc-950 border border-zinc-700 p-3 rounded-xl"
          />

          <input
            type="date"
            value={newApp.appliedDate}
            onChange={(e) => setNewApp({ ...newApp, appliedDate: e.target.value })}
            className="bg-zinc-950 border border-zinc-700 p-3 rounded-xl"
          />

          <select
            value={newApp.status}
            onChange={(e) => setNewApp({ ...newApp, status: e.target.value as any })}
            className="bg-zinc-950 border border-zinc-700 p-3 rounded-xl"
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
            className="bg-zinc-950 border border-zinc-700 p-3 rounded-xl"
          />

          <input
            type="url"
            placeholder="Application Link (optional)"
            value={newApp.link || ''}
            onChange={(e) => setNewApp({ ...newApp, link: e.target.value })}
            className="bg-zinc-950 border border-zinc-700 p-3 rounded-xl"
          />
        </div>

        <textarea
          placeholder="Notes (salary expectations, follow-up dates, etc.)"
          value={newApp.notes || ''}
          onChange={(e) => setNewApp({ ...newApp, notes: e.target.value })}
          className="w-full mt-4 bg-zinc-950 border border-zinc-700 p-3 rounded-xl h-24"
        />

        <button
          onClick={addOrUpdateApplication}
          className="mt-4 bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-xl font-medium flex items-center gap-2"
        >
          {editingId ? 'Update Application' : 'Add Application'}
        </button>
      </div>

      {/* Applications List */}
      <div className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden">
        <div className="p-6 border-b border-zinc-800">
          <h2 className="text-xl font-semibold">Your Applications ({applications.length})</h2>
        </div>

        {applications.length === 0 ? (
          <div className="p-12 text-center text-zinc-500">
            No applications logged yet. Add one above!
          </div>
        ) : (
          <div className="divide-y divide-zinc-800">
            {applications.map(app => (
              <div key={app.id} className="p-6 flex flex-col md:flex-row gap-4 items-start md:items-center">
                <div className="flex-1">
                  <div className="font-semibold">{app.companyName}</div>
                  <div className="text-sm text-zinc-400">{app.jobTitle}</div>
                </div>

                <div className={`px-4 py-1 rounded-full text-sm ${statusColors[app.status]}`}>
                  {app.status}
                </div>

                <div className="text-sm text-zinc-400 whitespace-nowrap">
                  {format(new Date(app.appliedDate), 'MMM dd, yyyy')}
                </div>

                {app.recruiter && (
                  <div className="text-sm text-zinc-400">📞 {app.recruiter}</div>
                )}

                <div className="flex gap-2 ml-auto">
                  <button onClick={() => editApp(app)} className="p-2 hover:bg-zinc-800 rounded-lg">
                    <Edit2 size={18} />
                  </button>
                  <button onClick={() => deleteApp(app.id)} className="p-2 hover:bg-zinc-800 rounded-lg text-red-400">
                    <Trash2 size={18} />
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