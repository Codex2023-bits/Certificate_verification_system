import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute';
import Navbar from './components/Navbar';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Verify from './pages/Verify';
import VerifyResult from './pages/VerifyResult';
import Dashboard from './pages/admin/Dashboard';
import UploadExcel from './pages/admin/UploadExcel';
import Certificates from './pages/admin/Certificates';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1">
            <Routes>
              {/* Public */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/verify" element={<Verify />} />
              <Route path="/verify/:certificateId" element={<VerifyResult />} />

              {/* Admin */}
              <Route path="/admin/dashboard" element={<AdminRoute><Dashboard /></AdminRoute>} />
              <Route path="/admin/upload" element={<AdminRoute><UploadExcel /></AdminRoute>} />
              <Route path="/admin/certificates" element={<AdminRoute><Certificates /></AdminRoute>} />

              {/* 404 */}
              <Route path="*" element={
                <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 animate-fade-in">
                  <div className="text-6xl mb-4">🔍</div>
                  <h1 className="text-3xl font-bold text-white mb-2">Page Not Found</h1>
                  <p className="text-slate-400 mb-6">The page you're looking for doesn't exist.</p>
                  <a href="/" className="btn-primary">Go Home</a>
                </div>
              } />
            </Routes>
          </main>
          <footer className="border-t border-slate-800 py-5 text-center text-xs text-slate-500">
            © {new Date().getFullYear()} CertVerify — Certificate Verification Platform
          </footer>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
