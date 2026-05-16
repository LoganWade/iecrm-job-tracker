import { Award, Users, Target, TrendingUp } from 'lucide-react';
import { masterData, Company } from '../data/masterData';

interface Props {
  masterData: Company[];
  applications: any[];
}

export default function Dashboard({ masterData, applications }: Props) {
  const highPriority = masterData.filter(c => c.score >= 8);
  const aiStrong = masterData.filter(c => c.aiConnection.includes("Strong"));

  return (
    <div className="space-y-10">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { icon: Users, label: "Total Companies", value: masterData.length, color: "blue" },
          { icon: Target, label: "High Priority", value: highPriority.length, color: "emerald" },
          { icon: Award, label: "Strong AI Fit", value: aiStrong.length, color: "purple" },
          { icon: TrendingUp, label: "Applications", value: applications.length, color: "amber" },
        ].map((stat, i) => (
          <div key={i} className="card p-8">
            <div className={`w-12 h-12 rounded-2xl bg-${stat.color}-500/10 flex items-center justify-center mb-6`}>
              <stat.icon className={`w-7 h-7 text-${stat.color}-500`} />
            </div>
            <p className="text-4xl font-bold tracking-tighter">{stat.value}</p>
            <p className="text-zinc-400 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Top Recommendations */}
      <div className="card p-8">
        <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3">
          <Award className="w-6 h-6 text-yellow-400" />
          Top Recommended Employers
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {masterData
            .sort((a, b) => b.score - a.score)
            .slice(0, 8)
            .map(company => (
              <div key={company.row} className="group bg-zinc-950 border border-zinc-800 hover:border-blue-500/50 rounded-3xl p-6 transition-all hover:-translate-y-0.5">
                <div className="flex justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">{company.name}</h3>
                    <p className="text-zinc-400 text-sm">{company.city} • {company.distance}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-4xl font-bold text-emerald-400">{company.score}</div>
                    <div className="text-xs text-zinc-500 -mt-1">/10</div>
                  </div>
                </div>

                <p className="mt-4 text-sm text-zinc-300 line-clamp-2">{company.specialties}</p>

                <div className="mt-5 flex flex-wrap gap-2">
                  <span className="text-xs px-4 py-1.5 bg-zinc-900 rounded-full border border-zinc-700">
                    {company.aiConnection}
                  </span>
                  {company.careersLink && (
                    <a href={company.careersLink} target="_blank" className="text-xs px-4 py-1.5 bg-blue-600 hover:bg-blue-500 rounded-full transition-colors">
                      Careers →
                    </a>
                  )}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}