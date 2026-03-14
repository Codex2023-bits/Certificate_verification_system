import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { verifyCertificate, getDownloadURL } from '../services/api';

const fmt = (d) => d ? new Date(d).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }) : '';

export default function VerifyResult() {
  const { certificateId } = useParams();
  const [cert, setCert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    verifyCertificate(certificateId)
      .then(({ data }) => setCert(data.data))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [certificateId]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (notFound) return (
    <div className="flex items-center justify-center min-h-[70vh] px-4 animate-fade-in">
      <div className="max-w-md w-full text-center">
        <div className="w-24 h-24 rounded-3xl bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto mb-6 text-5xl">❌</div>
        <h1 className="text-2xl font-bold text-white mb-3">Certificate Not Found</h1>
        <p className="text-slate-400 mb-6">No certificate found with ID <span className="font-mono text-red-400">"{certificateId}"</span>. Please check the ID and try again.</p>
        <Link to="/verify" className="btn-primary">Try Another ID</Link>
      </div>
    </div>
  );

  const duration = Math.ceil((new Date(cert.endDate) - new Date(cert.startDate)) / (1000 * 60 * 60 * 24 * 30));

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 animate-slide-up">
      {/* Verified badge */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 mb-4">
          <span className="text-2xl">✅</span>
          <div>
            <div className="text-emerald-400 font-bold text-lg">Certificate Verified</div>
            <div className="text-xs text-emerald-500/80">This is an authentic certificate</div>
          </div>
        </div>
      </div>

      {/* Certificate card */}
      <div className="card border-primary-500/30 bg-gradient-to-br from-surface-800 to-slate-900 mb-6">
        <div className="text-center border-b border-slate-700/60 pb-6 mb-6">
          <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold mb-2">Certificate of Internship</p>
          <h2 className="text-3xl font-bold text-white mb-1">{cert.studentName}</h2>
          <p className="text-slate-400 text-sm">has successfully completed an internship in</p>
          <p className="text-xl font-semibold text-primary-400 mt-1">{cert.internshipDomain}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { label: 'Organization', value: cert.organizationName, icon: '🏢' },
            { label: 'Domain', value: cert.internshipDomain, icon: '💼' },
            { label: 'Start Date', value: fmt(cert.startDate), icon: '📅' },
            { label: 'End Date', value: fmt(cert.endDate), icon: '📅' },
            { label: 'Duration', value: `~${duration} month${duration !== 1 ? 's' : ''}`, icon: '⏱' },
            { label: 'Certificate ID', value: cert.certificateId, icon: '🔖', mono: true },
          ].map(({ label, value, icon, mono }) => (
            <div key={label} className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/60">
              <span className="text-lg">{icon}</span>
              <div className="min-w-0">
                <div className="text-xs text-slate-400">{label}</div>
                <div className={`text-sm font-semibold text-white truncate ${mono ? 'font-mono text-primary-400' : ''}`}>{value}</div>
              </div>
            </div>
          ))}
        </div>

        {/* QR code */}
        {cert.qrCodeURL && (
          <div className="mt-6 flex flex-col items-center border-t border-slate-700/60 pt-6">
            <p className="text-xs text-slate-400 mb-3">Scan QR code to share this verification</p>
            <img src={cert.qrCodeURL} alt="QR Code" className="w-28 h-28 rounded-xl border border-slate-700 p-2 bg-slate-800" />
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3 justify-center">
        <a href={getDownloadURL(cert.certificateId)} target="_blank" rel="noreferrer" className="btn-primary">
          ⬇️ Download PDF
        </a>
        <Link to="/verify" className="btn-secondary">Verify Another</Link>
      </div>

      <p className="text-center text-xs text-slate-500 mt-6">
        Issued on {fmt(cert.createdAt)} by {cert.organizationName}
      </p>
    </div>
  );
}
