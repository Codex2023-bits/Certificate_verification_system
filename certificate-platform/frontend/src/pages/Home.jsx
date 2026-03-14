import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const features = [
  { icon: '📄', title: 'Bulk Certificate Creation', desc: 'Upload Excel files to generate hundreds of certificates instantly.' },
  { icon: '🔍', title: 'Instant Verification', desc: 'Anyone can verify a certificate in seconds using a Certificate ID.' },
  { icon: '📱', title: 'QR Code Verification', desc: 'Every certificate includes a scannable QR code for mobile verification.' },
  { icon: '⬇️', title: 'PDF Download', desc: 'Download and print professional PDF certificates on demand.' },
  { icon: '📊', title: 'Analytics Dashboard', desc: 'Track issuance trends, popular domains, and monthly statistics.' },
  { icon: '🔒', title: 'Secure & Role-Based', desc: 'JWT-protected admin panel with bcrypt password security.' },
];

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen animate-fade-in">
      {/* Hero */}
      <section className="relative py-24 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-radial from-primary-900/30 via-transparent to-transparent" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary-600/10 blur-[120px] rounded-full" />
        <div className="relative max-w-4xl mx-auto animate-slide-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/30 text-primary-400 text-sm font-medium mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-primary-400 animate-pulse" />
            Production-Ready Certificate Platform
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-6 leading-tight">
            Issue & Verify<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-violet-400">
              Internship Certificates
            </span>
          </h1>
          <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            A secure, scalable platform to bulk-issue internship certificates, generate QR codes, and allow instant public verification.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link to="/verify" className="btn-primary text-base px-8 py-3 animate-pulse-glow">
              Verify a Certificate
            </Link>
            {user?.role === 'admin' ? (
              <Link to="/admin/dashboard" className="btn-secondary text-base px-8 py-3">Go to Dashboard</Link>
            ) : (
              <Link to="/register" className="btn-secondary text-base px-8 py-3">Get Started →</Link>
            )}
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="py-8 px-4 border-y border-slate-800">
        <div className="max-w-4xl mx-auto flex flex-wrap justify-center gap-12">
          {[['Excel Upload', 'Bulk Creation'], ['QR Codes', 'Auto-Generated'], ['JWT Auth', 'Secured'], ['PDF Certs', 'Downloadable']].map(([val, label]) => (
            <div key={label} className="text-center">
              <div className="text-2xl font-bold text-primary-400">{val}</div>
              <div className="text-sm text-slate-500 mt-0.5">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-white mb-4">Everything You Need</h2>
            <p className="text-slate-400 max-w-xl mx-auto">A complete end-to-end system for managing internship certification at any scale.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(({ icon, title, desc }) => (
              <div key={title} className="card hover:border-primary-500/40 hover:-translate-y-1 transition-all duration-200 group">
                <div className="text-3xl mb-4 group-hover:scale-110 transition-transform inline-block">{icon}</div>
                <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4">
        <div className="max-w-2xl mx-auto text-center card border-primary-500/30 bg-gradient-to-br from-primary-900/30 to-surface-800">
          <h2 className="text-2xl font-bold text-white mb-3">Ready to Verify a Certificate?</h2>
          <p className="text-slate-400 text-sm mb-6">Enter the Certificate ID you received or scan the QR code on your certificate.</p>
          <Link to="/verify" className="btn-primary text-base px-8">Verify Now →</Link>
        </div>
      </section>
    </div>
  );
}
