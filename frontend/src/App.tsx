import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import ExpertListScreen from './pages/ExpertListScreen';
import ExpertDetailScreen from './pages/ExpertDetailScreen';
import BookingScreen from './pages/BookingScreen';
import MyBookingsScreen from './pages/MyBookingsScreen';
import { AuthProvider, useAuth } from './context/AuthContext';
import { User, LogOut } from 'lucide-react';
import { useState } from 'react';

function Navbar() {
  const { email, login, logout } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [inputEmail, setInputEmail] = useState('');
  const location = useLocation();

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputEmail) {
      login(inputEmail);
      setShowLogin(false);
    }
  };

  const openAuthModal = (mode: boolean) => {
    setIsLoginMode(mode);
    setShowLogin(true);
  };

  return (
    <>
      <nav className="bg-white/80 backdrop-blur-xl fixed top-0 w-full z-50 border-b border-gray-100 flex items-center justify-between px-6 lg:px-12 h-20 max-w-[1440px] mx-auto left-0 right-0">
        <Link to="/" className="text-2xl font-black text-black tracking-tighter hover:opacity-80 transition-opacity">
          XpertLive.
        </Link>
        
        <div className="flex items-center gap-4 md:gap-6">
          <Link 
            to="/my-bookings" 
            className={`font-bold text-sm transition-colors ${location.pathname === '/my-bookings' ? 'text-black' : 'text-gray-400 hover:text-black'}`}
          >
            My Bookings
          </Link>
          
          <div className="h-6 w-px bg-gray-200 hidden md:block" />

          {email ? (
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                <div className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center text-[10px] font-black">
                  {email.charAt(0).toUpperCase()}
                </div>
                <span className="text-xs font-bold text-gray-600 truncate max-w-[120px]">{email}</span>
              </div>
              <button 
                onClick={logout}
                className="text-gray-400 hover:text-red-500 transition-colors p-2"
                title="Sign out"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 md:gap-3">
              <button 
                onClick={() => openAuthModal(true)}
                className="hidden md:block text-sm font-bold text-gray-500 hover:text-black transition-colors"
              >
                Sign In
              </button>
              <button 
                onClick={() => openAuthModal(false)}
                className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md hover:bg-gray-900 transition-colors"
              >
                <User className="w-4 h-4" />
                Register
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Auth Modal Overlay */}
      {showLogin && !email && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-[32px] p-8 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200 relative">
            
            <button 
              onClick={() => setShowLogin(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-black p-2"
            >
              ✕
            </button>

            <h2 className="text-2xl font-black text-black mb-2">
              {isLoginMode ? 'Welcome back' : 'Create an account'}
            </h2>
            <p className="text-sm text-gray-500 mb-6 font-medium">
              {isLoginMode ? 'Enter your email to access your sessions.' : 'Join XpertLive to book top professionals.'}
            </p>
            
            <form onSubmit={handleAuthSubmit} className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block ml-1">Email Address</label>
                <input 
                  type="email" 
                  autoFocus
                  required
                  value={inputEmail}
                  onChange={(e) => setInputEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-gray-50 border-2 border-transparent rounded-2xl py-3 px-4 text-black font-bold focus:bg-white focus:border-black focus:outline-none transition-all"
                />
              </div>
              <div className="pt-2">
                <button 
                  type="submit" 
                  className="w-full py-3.5 bg-black text-white rounded-2xl font-bold text-sm shadow-lg hover:opacity-90 transition-opacity"
                >
                  {isLoginMode ? 'Sign In' : 'Register & Continue'}
                </button>
              </div>
            </form>

            <div className="mt-6 text-center text-sm font-medium text-gray-500">
              {isLoginMode ? "Don't have an account? " : "Already have an account? "}
              <button 
                onClick={() => setIsLoginMode(!isLoginMode)}
                className="text-black font-bold hover:underline"
              >
                {isLoginMode ? 'Register here' : 'Sign In'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-[#f9f9f9] text-[#1a1c1c] font-sans antialiased selection:bg-black selection:text-white">
          <Navbar />
          {/* Main Content Area */}
          <div className="pt-20 max-w-[1440px] mx-auto">
            <Routes>
              <Route path="/" element={<ExpertListScreen />} />
              <Route path="/expert/:id" element={<ExpertDetailScreen />} />
              <Route path="/book/:id/:slotId" element={<BookingScreen />} />
              <Route path="/my-bookings" element={<MyBookingsScreen />} />
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
