import { useState, useRef } from 'react';
import { uploadExcel } from '../../services/api';

export default function UploadExcel() {
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);
  const fileRef = useRef();

  const handleFile = (f) => {
    if (!f) return;
    const ext = f.name.split('.').pop().toLowerCase();
    if (!['xlsx', 'xls'].includes(ext)) {
      setError('Only .xlsx or .xls files are supported');
      return;
    }
    setFile(f);
    setError('');
    setResult(null);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleSubmit = async () => {
    if (!file) return;
    setLoading(true);
    setProgress(0);
    setResult(null);
    setError('');
    const formData = new FormData();
    formData.append('file', file);

    // Simulate progress
    const timer = setInterval(() => setProgress((p) => Math.min(p + 10, 80)), 200);

    try {
      const { data } = await uploadExcel(formData);
      clearInterval(timer);
      setProgress(100);
      setResult(data);
      setFile(null);
    } catch (err) {
      clearInterval(timer);
      setProgress(0);
      setError(err.response?.data?.message || 'Upload failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Upload Excel File</h1>
        <p className="text-slate-400 text-sm mt-1">Bulk-create certificates from a spreadsheet</p>
      </div>

      {/* Template info */}
      <div className="card mb-6">
        <h2 className="text-sm font-semibold text-slate-300 mb-3">📋 Required Excel Columns</h2>
        <div className="flex flex-wrap gap-2">
          {['CertificateID', 'StudentName', 'InternshipDomain', 'OrganizationName', 'StartDate', 'EndDate'].map((col) => (
            <span key={col} className="badge bg-primary-500/10 text-primary-400 border border-primary-500/30 text-xs px-3 py-1">{col}</span>
          ))}
        </div>
        <p className="text-xs text-slate-500 mt-3">Dates should be in YYYY-MM-DD format. The first row must be column headers.</p>
      </div>

      {/* Drop Zone */}
      <div
        className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-200
          ${dragging ? 'border-primary-500 bg-primary-500/10' : 'border-slate-700 hover:border-primary-500/60 hover:bg-slate-800/40'}
          ${file ? 'border-emerald-500/60 bg-emerald-500/5' : ''}`}
        onClick={() => fileRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
      >
        <input ref={fileRef} type="file" accept=".xlsx,.xls" className="hidden" onChange={(e) => handleFile(e.target.files[0])} />
        {file ? (
          <>
            <div className="text-4xl mb-3">✅</div>
            <p className="text-white font-semibold">{file.name}</p>
            <p className="text-slate-400 text-sm mt-1">{(file.size / 1024).toFixed(1)} KB</p>
            <button onClick={(e) => { e.stopPropagation(); setFile(null); }} className="mt-3 text-xs text-red-400 hover:text-red-300">
              Remove file
            </button>
          </>
        ) : (
          <>
            <div className="text-5xl mb-4">📤</div>
            <p className="text-white font-semibold text-lg">Drop your Excel file here</p>
            <p className="text-slate-400 text-sm mt-2">or <span className="text-primary-400">click to browse</span></p>
            <p className="text-slate-500 text-xs mt-3">Supports .xlsx and .xls — max 10 MB</p>
          </>
        )}
      </div>

      {/* Progress bar */}
      {loading && (
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Processing...</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-700 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary-500 to-violet-500 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {error && (
        <div className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center gap-2">
          ⚠️ {error}
        </div>
      )}

      {result && (
        <div className="mt-4 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 animate-slide-up">
          <div className="text-emerald-400 font-semibold mb-3">✅ {result.message}</div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex justify-between p-3 rounded-lg bg-surface-900">
              <span className="text-slate-400">Inserted</span>
              <span className="font-bold text-white">{result.inserted}</span>
            </div>
            <div className="flex justify-between p-3 rounded-lg bg-surface-900">
              <span className="text-slate-400">Duplicates</span>
              <span className="font-bold text-yellow-400">{result.duplicates}</span>
            </div>
          </div>
          {result.parseErrors?.length > 0 && (
            <div className="mt-3">
              <p className="text-xs text-slate-400 mb-2">Row errors ({result.parseErrors.length}):</p>
              <div className="max-h-32 overflow-y-auto space-y-1">
                {result.parseErrors.map((e, i) => (
                  <div key={i} className="text-xs text-red-400 p-1.5 bg-red-500/10 rounded">Row {e.row}: {e.error}</div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={!file || loading}
        className="btn-primary w-full justify-center py-3 text-base mt-6"
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Uploading & Processing...
          </span>
        ) : '📤 Upload & Generate Certificates'}
      </button>
    </div>
  );
}
