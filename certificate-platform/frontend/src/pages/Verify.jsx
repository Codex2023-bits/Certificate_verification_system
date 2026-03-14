import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Verify() {
  const [certId, setCertId] = useState('');
  const navigate = useNavigate();

  const handleVerify = (e) => {
    e.preventDefault();
    const id = certId.trim().toUpperCase();
    if (id) navigate(`/verify/${id}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 animate-fade-in">
      <div className="w-full max-w-lg">
        {/* Icon */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary-600 to-violet-600 flex items-center justify-center mx-auto mb-5 shadow-2xl shadow-primary-900/50">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Verify Your Certificate</h1>
          <p className="text-slate-400">Enter the Certificate ID printed on your internship certificate to verify its authenticity.</p>
        </div>

        <div className="card">
          <form onSubmit={handleVerify} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Certificate ID</label>
              <input
                type="text"
                className="input-field text-center font-mono text-lg tracking-wider uppercase"
                placeholder="e.g. CERT-2024-001"
                value={certId}
                onChange={(e) => setCertId(e.target.value)}
                required
              />
              <p className="text-xs text-slate-500 mt-1.5 text-center">You can find this on the bottom of your certificate</p>
            </div>
            <button type="submit" className="btn-primary w-full justify-center py-3 text-base">
              🔍 Verify Certificate
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-700/60 text-center">
            <p className="text-sm text-slate-400 mb-2">Have a QR code?</p>
            <p className="text-xs text-slate-500">Scan the QR code on your certificate with your phone camera — it will open this page automatically with your certificate ID pre-filled.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
