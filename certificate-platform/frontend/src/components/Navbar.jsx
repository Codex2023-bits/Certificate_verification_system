import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 bg-surface-900/80 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center shadow-lg shadow-primary-900/50 group-hover:scale-110 transition-transform">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <span className="font-bold text-white text-lg tracking-tight">CertVerify</span>
          </Link>

          {/* Nav Links */}
          <div className="flex items-center gap-2">
            <Link to="/verify" className="text-slate-400 hover:text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-slate-800">
              Verify Certificate
            </Link>

            {user?.role === 'admin' && (
              <>
                <Link to="/admin/dashboard" className="text-slate-400 hover:text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-slate-800">Dashboard</Link>
                <Link to="/admin/upload" className="text-slate-400 hover:text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-slate-800">Upload</Link>
                <Link to="/admin/certificates" className="text-slate-400 hover:text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-slate-800">Manage</Link>
              </>
            )}

            {user ? (
              <div className="flex items-center gap-2 ml-2">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700">
                  <div className="w-6 h-6 rounded-full bg-primary-600 flex items-center justify-center text-xs font-bold text-white">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm text-slate-300 font-medium max-w-[100px] truncate">{user.name}</span>
                  {user.role === 'admin' && (
                    <span className="badge bg-primary-500/20 text-primary-400 border border-primary-500/30">Admin</span>
                  )}
                </div>
                <button onClick={handleLogout} className="btn-secondary py-1.5 px-3 text-sm">Logout</button>
              </div>
            ) : (
              <div className="flex items-center gap-2 ml-2">
                <Link to="/login" className="btn-secondary py-1.5 px-4 text-sm">Login</Link>
                <Link to="/register" className="btn-primary py-1.5 px-4 text-sm">Register</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
