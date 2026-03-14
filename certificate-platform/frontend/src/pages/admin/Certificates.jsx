import { useEffect, useState, useCallback } from 'react';
import { getCertificates, deleteCertificate, updateCertificate, getDownloadURL } from '../../services/api';

const fmt = (d) => d ? new Date(d).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : '';

export default function Certificates() {
  const [certs, setCerts] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});
  const [saving, setSaving] = useState(false);

  const fetchCerts = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await getCertificates({ search, page, limit: 15 });
      setCerts(data.data);
      setPagination(data.pagination);
    } catch {
      /* handled */
    } finally {
      setLoading(false);
    }
  }, [search, page]);

  useEffect(() => { fetchCerts(); }, [fetchCerts]);

  // Debounce search
  useEffect(() => { setPage(1); }, [search]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this certificate?')) return;
    await deleteCertificate(id);
    fetchCerts();
  };

  const handleEditSave = async (id) => {
    setSaving(true);
    try {
      await updateCertificate(id, editData);
      setEditId(null);
      fetchCerts();
    } catch (e) {
      alert(e.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (cert) => {
    setEditId(cert._id);
    setEditData({
      studentName: cert.studentName,
      internshipDomain: cert.internshipDomain,
      organizationName: cert.organizationName,
      startDate: cert.startDate?.split('T')[0],
      endDate: cert.endDate?.split('T')[0],
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Manage Certificates</h1>
          <p className="text-slate-400 text-sm mt-0.5">{pagination.total ?? 0} total records</p>
        </div>
        <div className="relative w-full sm:w-72">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search name, ID, domain..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-9"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : certs.length === 0 ? (
        <div className="card text-center py-16">
          <div className="text-4xl mb-3">📭</div>
          <p className="text-slate-400">No certificates found</p>
        </div>
      ) : (
        <>
          <div className="card overflow-hidden p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-800/60 border-b border-slate-700">
                  <tr>
                    {['Certificate ID', 'Student', 'Domain', 'Organization', 'Dates', 'Actions'].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {certs.map((cert) => (
                    <tr key={cert._id} className="hover:bg-slate-800/30 transition-colors group">
                      {editId === cert._id ? (
                        <td colSpan={5} className="px-4 py-3">
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                            {['studentName','internshipDomain','organizationName','startDate','endDate'].map((field) => (
                              <input
                                key={field}
                                type={field.includes('Date') ? 'date' : 'text'}
                                placeholder={field}
                                value={editData[field] || ''}
                                onChange={(e) => setEditData((d) => ({ ...d, [field]: e.target.value }))}
                                className="input-field py-2 text-xs"
                              />
                            ))}
                          </div>
                        </td>
                      ) : (
                        <>
                          <td className="px-4 py-3 font-mono text-xs text-primary-400">{cert.certificateId}</td>
                          <td className="px-4 py-3 text-white font-medium">{cert.studentName}</td>
                          <td className="px-4 py-3"><span className="badge bg-violet-500/15 text-violet-400">{cert.internshipDomain}</span></td>
                          <td className="px-4 py-3 text-slate-300">{cert.organizationName}</td>
                          <td className="px-4 py-3 text-slate-400 text-xs whitespace-nowrap">{fmt(cert.startDate)} – {fmt(cert.endDate)}</td>
                        </>
                      )}
                      <td className="px-4 py-3 whitespace-nowrap">
                        {editId === cert._id ? (
                          <div className="flex gap-2">
                            <button onClick={() => handleEditSave(cert._id)} disabled={saving} className="btn-primary py-1 px-3 text-xs">{saving ? '...' : 'Save'}</button>
                            <button onClick={() => setEditId(null)} className="btn-secondary py-1 px-3 text-xs">Cancel</button>
                          </div>
                        ) : (
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <a href={getDownloadURL(cert.certificateId)} target="_blank" rel="noreferrer" className="btn-secondary py-1 px-2 text-xs" title="Download PDF">⬇️</a>
                            <button onClick={() => startEdit(cert)} className="btn-secondary py-1 px-2 text-xs" title="Edit">✏️</button>
                            <button onClick={() => handleDelete(cert._id)} className="btn-danger py-1 px-2" title="Delete">🗑</button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="btn-secondary py-1.5 px-4 text-sm disabled:opacity-30">← Prev</button>
              <span className="text-slate-400 text-sm">Page {page} of {pagination.pages}</span>
              <button onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))} disabled={page === pagination.pages} className="btn-secondary py-1.5 px-4 text-sm disabled:opacity-30">Next →</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
