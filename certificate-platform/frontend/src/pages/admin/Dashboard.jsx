import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title,
  Tooltip, Legend, ArcElement,
} from 'chart.js';
import { getStats } from '../../services/api';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const chartOptions = {
  responsive: true,
  plugins: { legend: { labels: { color: '#94a3b8' } } },
  scales: {
    x: { ticks: { color: '#64748b' }, grid: { color: '#1e293b' } },
    y: { ticks: { color: '#64748b' }, grid: { color: '#1e293b' } },
  },
};

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStats()
      .then(({ data }) => setStats(data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const monthlyChartData = {
    labels: stats?.monthlyTrend?.map((m) => `${MONTH_NAMES[m._id.month - 1]} ${m._id.year}`) || [],
    datasets: [{
      label: 'Certificates Issued',
      data: stats?.monthlyTrend?.map((m) => m.count) || [],
      backgroundColor: 'rgba(99,102,241,0.6)',
      borderColor: '#6366f1',
      borderRadius: 8,
    }],
  };

  const domainChartData = {
    labels: stats?.domainDistribution?.map((d) => d._id) || [],
    datasets: [{
      data: stats?.domainDistribution?.map((d) => d.count) || [],
      backgroundColor: ['#6366f1','#8b5cf6','#06b6d4','#10b981','#f59e0b','#ef4444','#ec4899','#a3e635'],
      borderWidth: 0,
    }],
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
          <p className="text-slate-400 text-sm mt-0.5">Certificate issuance overview</p>
        </div>
        <Link to="/admin/upload" className="btn-primary">+ Upload Excel</Link>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Certificates', value: stats?.total ?? 0, icon: '📜', color: 'from-primary-600 to-violet-600' },
          { label: 'Issued This Month', value: stats?.thisMonth ?? 0, icon: '📅', color: 'from-cyan-600 to-blue-600' },
          { label: 'Unique Domains', value: stats?.domainDistribution?.length ?? 0, icon: '🏷️', color: 'from-emerald-600 to-teal-600' },
          { label: 'Top Domain', value: stats?.domainDistribution?.[0]?._id || 'N/A', icon: '🏆', color: 'from-amber-600 to-orange-600' },
        ].map(({ label, value, icon, color }) => (
          <div key={label} className="stat-card">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-xl flex-shrink-0 shadow-lg`}>
              {icon}
            </div>
            <div className="min-w-0">
              <div className="text-2xl font-bold text-white truncate">{value}</div>
              <div className="text-xs text-slate-400">{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="card lg:col-span-2">
          <h2 className="text-base font-semibold text-white mb-4">Monthly Issuance Trend</h2>
          {stats?.monthlyTrend?.length > 0 ? (
            <Bar data={monthlyChartData} options={chartOptions} />
          ) : (
            <div className="flex items-center justify-center h-48 text-slate-500 text-sm">No trend data yet</div>
          )}
        </div>
        <div className="card">
          <h2 className="text-base font-semibold text-white mb-4">Domain Distribution</h2>
          {stats?.domainDistribution?.length > 0 ? (
            <Doughnut data={domainChartData} options={{ plugins: { legend: { position: 'bottom', labels: { color: '#94a3b8', font: { size: 11 } } } } }} />
          ) : (
            <div className="flex items-center justify-center h-48 text-slate-500 text-sm">No domain data yet</div>
          )}
        </div>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { to: '/admin/upload', label: 'Upload Excel Certificates', icon: '📤', desc: 'Bulk-import from spreadsheet' },
          { to: '/admin/certificates', label: 'Manage Certificates', icon: '📋', desc: 'View, edit, search, delete' },
          { to: '/verify', label: 'Public Verify Portal', icon: '🔍', desc: 'Test the verification flow' },
        ].map(({ to, label, icon, desc }) => (
          <Link key={to} to={to} className="card hover:border-primary-500/50 hover:-translate-y-1 transition-all duration-200 flex items-center gap-4">
            <span className="text-2xl">{icon}</span>
            <div>
              <div className="font-semibold text-white text-sm">{label}</div>
              <div className="text-xs text-slate-400 mt-0.5">{desc}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
