import { useEffect, useState, useCallback } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Calendar, Clock, Video, CheckCircle, Clock4, XCircle, Search, User, ArrowRight, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function MyBookingsScreen() {
  const { email: authEmail, login } = useAuth();
  const [searchInput, setSearchInput] = useState('');
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const navigate = useNavigate();

  const fetchBookings = useCallback(async (emailToFetch: string) => {
    if (!emailToFetch) return;
    setLoading(true);
    try {
      const res = await api.get(`/bookings?email=${emailToFetch}`);
      setBookings(res.data);
      setHasSearched(true);
      // Auto login if they search and find bookings
      if (!authEmail && res.data.length > 0) {
        login(emailToFetch);
      }
    } catch (err) {
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  }, [authEmail, login]);

  useEffect(() => {
    if (authEmail) {
      fetchBookings(authEmail);
    }
  }, [authEmail, fetchBookings]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput) fetchBookings(searchInput);
  };

  const getStatusInfo = (status: string) => {
    switch(status) {
      case 'Confirmed': return { icon: <CheckCircle className="w-4 h-4" />, color: 'bg-green-500/10 text-green-600' };
      case 'Pending': return { icon: <Clock4 className="w-4 h-4" />, color: 'bg-yellow-500/10 text-yellow-600' };
      case 'Completed': return { icon: <CheckCircle className="w-4 h-4" />, color: 'bg-gray-100 text-gray-500' };
      case 'Cancelled': return { icon: <XCircle className="w-4 h-4" />, color: 'bg-red-500/10 text-red-600' };
      default: return { icon: <Clock4 className="w-4 h-4" />, color: 'bg-gray-100 text-gray-600' };
    }
  };

  return (
    <div className="min-h-screen bg-[#f9f9f9] p-6 lg:p-12">
      <div className="max-w-[1000px] mx-auto space-y-8">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-400 hover:text-black transition-colors font-bold uppercase tracking-widest text-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </button>

        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6">
          <div>
            <h1 className="text-4xl font-black text-black mb-2 tracking-tight">My Bookings</h1>
            <p className="text-lg text-gray-500 font-medium">
              {authEmail ? `Managing sessions for ${authEmail}` : 'Manage your upcoming and past mentorship sessions.'}
            </p>
          </div>
          
          {!authEmail && (
            <form onSubmit={handleSearch} className="relative group w-full md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-black transition-colors" />
              <input 
                type="email" 
                required
                placeholder="Search by your email..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full bg-white border-2 border-gray-100 rounded-2xl py-3.5 pl-12 pr-4 focus:border-black focus:outline-none transition-all shadow-sm"
              />
            </form>
          )}
        </header>

        {loading ? (
          <div className="space-y-6">
            {[1,2,3].map(i => (
              <div key={i} className="bg-white rounded-[32px] h-48 animate-pulse border-2 border-gray-50" />
            ))}
          </div>
        ) : bookings.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {bookings.map(booking => {
              const statusInfo = getStatusInfo(booking.status);
              return (
                <div key={booking._id} className="bg-white rounded-[40px] border-2 border-gray-50 p-8 shadow-sm hover:shadow-xl hover:border-black/5 transition-all duration-300 group">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="flex items-center gap-6">
                      <div className="w-20 h-20 rounded-[24px] overflow-hidden bg-gray-100 border-2 border-white shadow-sm">
                        {booking.expertId?.imageUrl ? (
                          <img src={booking.expertId.imageUrl} alt={booking.expertId.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-black/5">
                            <span className="text-2xl font-black text-black/20">{booking.expertId?.name?.charAt(0) || 'E'}</span>
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-xl font-black text-black tracking-tight">{booking.expertId?.name || 'Expert'}</h3>
                          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${statusInfo.color}`}>
                            {statusInfo.icon}
                            {booking.status}
                          </div>
                        </div>
                        <p className="text-sm text-gray-500 font-bold uppercase tracking-widest">{booking.expertId?.category}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-6 md:border-l border-gray-100 md:pl-10">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                          <Calendar className="w-3 h-3" />
                          Date
                        </div>
                        <div className="text-sm font-bold text-black">{new Date(booking.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                          <Clock className="w-3 h-3" />
                          Time Slot
                        </div>
                        <div className="text-sm font-bold text-black">{booking.timeSlot}</div>
                      </div>
                    </div>

                    <div className="w-full md:w-auto">
                      {booking.status === 'Confirmed' ? (
                        <button className="w-full md:w-auto px-8 py-4 bg-black text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-lg shadow-black/10">
                          <Video className="w-4 h-4" />
                          Join Meeting
                        </button>
                      ) : (
                        <button className="w-full md:w-auto px-8 py-4 bg-gray-50 text-gray-400 rounded-2xl font-black text-xs uppercase tracking-widest cursor-not-allowed">
                          Meeting Link
                        </button>
                      )}
                    </div>
                  </div>
                  
                  {booking.notes && (
                    <div className="mt-6 pt-6 border-t border-gray-50">
                      <p className="text-sm text-gray-500 font-medium italic leading-relaxed">
                        &quot;{booking.notes}&quot;
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : hasSearched || authEmail ? (
          <div className="py-24 text-center bg-white rounded-[40px] border-2 border-dashed border-gray-100">
            <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Calendar className="w-10 h-10 text-gray-200" />
            </div>
            <h3 className="text-2xl font-black text-black mb-2 tracking-tight">No bookings found</h3>
            <p className="text-gray-500 font-medium max-w-xs mx-auto leading-relaxed">
              We couldn&apos;t find any sessions associated with this email. Ready to book your first session?
            </p>
            <Link to="/" className="mt-8 inline-flex items-center gap-2 bg-black text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:opacity-90 transition-all shadow-lg shadow-black/10">
              Find an Expert
            </Link>
          </div>
        ) : (
          <div className="py-24 text-center bg-white rounded-[40px] border-2 border-gray-50 shadow-sm">
            <User className="w-16 h-16 text-gray-100 mx-auto mb-6" />
            <h3 className="text-2xl font-black text-black mb-2 tracking-tight">Access your sessions</h3>
            <p className="text-gray-500 font-medium mb-8">Sign in or enter your email above to view your booking history.</p>
            <Link to="/" className="inline-flex items-center gap-2 bg-black text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:opacity-90 transition-all shadow-lg shadow-black/10">
              Explore Experts
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
