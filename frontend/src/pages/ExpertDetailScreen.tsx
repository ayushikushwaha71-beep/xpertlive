import { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api, socket } from '../services/api';
import { Star, Briefcase, ArrowLeft, Calendar, Clock, ShieldCheck, MapPin } from 'lucide-react';

export default function ExpertDetailScreen() {
  const { id } = useParams();
  const [expert, setExpert] = useState<any>(null);
  const [slots, setSlots] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchExpertDetails = useCallback(async () => {
    try {
      const res = await api.get(`/experts/${id}`);
      setExpert(res.data.expert);
      setSlots(res.data.availableSlots);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching expert details:', err);
    }
  }, [id]);

  useEffect(() => {
    fetchExpertDetails();

    socket.on('slot_booked', (data) => {
      if (data.expertId === id) {
        setSlots((prev) => prev.filter((s) => s._id !== data.slotId));
      }
    });

    socket.on('slot_freed', (data) => {
      if (data.expertId === id) {
        fetchExpertDetails();
      }
    });

    return () => {
      socket.off('slot_booked');
      socket.off('slot_freed');
    };
  }, [id, fetchExpertDetails]);

  if (loading) {
    return (
      <div className="flex-1 flex justify-center items-center h-[calc(100vh-64px)] bg-background">
        <div className="w-10 h-10 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!expert) return <div className="p-20 text-center font-bold text-xl">Expert not found</div>;

  const groupedSlots = slots.reduce((acc: any, slot: any) => {
    if (!acc[slot.date]) acc[slot.date] = [];
    acc[slot.date].push(slot);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header / Cover */}
      <div className="h-48 bg-black w-full" />
      
      <div className="max-w-[1200px] mx-auto px-6 -mt-24">
        <div className="mb-8 flex items-center gap-2 text-white/70 text-sm font-bold">
          <Link to="/" className="hover:text-white flex items-center gap-1 transition-colors uppercase tracking-widest">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
          <span className="opacity-30">/</span>
          <span className="uppercase tracking-widest">{expert.category}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 space-y-8">
            {/* Profile Card */}
            <section className="bg-white rounded-[40px] border-2 border-gray-50 shadow-xl shadow-black/5 p-8 md:p-10">
              <div className="flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
                <div className="relative group">
                  <div className="w-40 h-40 rounded-3xl overflow-hidden bg-gray-100 border-4 border-white shadow-lg transition-transform duration-500 group-hover:scale-105">
                    {expert.imageUrl ? (
                      <img src={expert.imageUrl} alt={expert.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-black/5">
                        <span className="text-4xl font-black text-black/20">{expert.name.charAt(0)}</span>
                      </div>
                    )}
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-green-500 px-3 py-1 rounded-full border-4 border-white text-[10px] font-black text-white uppercase tracking-widest shadow-md">
                    Active
                  </div>
                </div>
                
                <div className="flex-1 space-y-4">
                  <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-4">
                    <div>
                      <h1 className="text-4xl font-black text-black mb-1 tracking-tight">{expert.name}</h1>
                      <div className="flex items-center gap-2 text-gray-500 font-bold uppercase tracking-widest text-xs">
                        <ShieldCheck className="w-4 h-4 text-black" />
                        Verified {expert.category} Professional
                      </div>
                    </div>
                    <div className="bg-black text-white px-6 py-3 rounded-2xl text-center shadow-lg shadow-black/20">
                      <div className="text-2xl font-black">${expert.basePrice}</div>
                      <div className="text-[10px] font-bold uppercase tracking-widest opacity-60">per hour</div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 pt-6 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      <Star className="text-yellow-400 fill-current w-5 h-5" />
                      <span className="text-base font-black text-black">{expert.rating}</span>
                      <span className="text-sm text-gray-400 font-bold">({expert.reviewCount} Reviews)</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 font-bold text-sm">
                      <Briefcase className="w-4 h-4" />
                      {expert.experience} Experience
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 font-bold text-sm">
                      <MapPin className="w-4 h-4" />
                      Remote / Online
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* About Section */}
            <section className="bg-white rounded-[40px] border-2 border-gray-50 p-10 space-y-6 shadow-sm">
              <h2 className="text-2xl font-black text-black tracking-tight">Biography</h2>
              <p className="text-lg text-gray-500 leading-relaxed font-medium">
                {expert.bio}
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6">
                <div className="bg-gray-50 p-4 rounded-2xl">
                  <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Response Time</div>
                  <div className="text-sm font-bold text-black">&lt; 2 Hours</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-2xl">
                  <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Language</div>
                  <div className="text-sm font-bold text-black">English</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-2xl">
                  <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Sessions</div>
                  <div className="text-sm font-bold text-black">500+ Done</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-2xl">
                  <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Availability</div>
                  <div className="text-sm font-bold text-black">High</div>
                </div>
              </div>
            </section>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-4 sticky top-24">
            <div className="bg-white rounded-[40px] border-2 border-black p-8 shadow-2xl shadow-black/10 space-y-6">
              <div className="flex items-center justify-between border-b border-gray-100 pb-6">
                <h3 className="text-xl font-black text-black tracking-tight">Book a Session</h3>
                <div className="bg-green-50 px-3 py-1.5 rounded-xl border border-green-100 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[10px] font-bold text-green-700 uppercase tracking-widest">Available</span>
                </div>
              </div>

              <div className="space-y-6 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                {Object.keys(groupedSlots).length === 0 ? (
                  <div className="text-center py-10">
                    <Calendar className="w-12 h-12 text-gray-100 mx-auto mb-2" />
                    <p className="text-gray-400 font-bold text-sm uppercase tracking-widest">No slots available</p>
                  </div>
                ) : (
                  Object.keys(groupedSlots).map((date) => (
                    <div key={date} className="space-y-3">
                      <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-[2px] ml-1">
                        {new Date(date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                        {groupedSlots[date].map((slot: any) => (
                          <Link 
                            to={`/book/${expert._id}/${slot._id}`}
                            key={slot._id}
                            className="bg-gray-50 border-2 border-transparent text-black font-bold text-sm py-3 px-2 rounded-2xl hover:border-black hover:bg-white transition-all text-center group flex items-center justify-center gap-2"
                          >
                            <Clock className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 transition-opacity" />
                            {slot.time}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="pt-4 space-y-4">
                <div className="bg-gray-50 p-4 rounded-3xl flex items-center gap-3">
                  <Video className="w-5 h-5 text-black" />
                  <div className="text-xs font-bold text-gray-600 leading-tight">Sessions take place over high-quality secure video call.</div>
                </div>
                <p className="text-[10px] text-gray-400 text-center font-bold uppercase tracking-widest">
                  Secure Payment • Instant Confirmation
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const Video = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
);
