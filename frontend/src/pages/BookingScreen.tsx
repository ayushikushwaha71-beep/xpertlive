import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Calendar, Clock, ArrowLeft, ShieldCheck, CheckCircle, AlertCircle } from 'lucide-react';

export default function BookingScreen() {
  const { id, slotId } = useParams();
  const navigate = useNavigate();
  const { email, login } = useAuth();
  
  const [expert, setExpert] = useState<any>(null);
  const [slot, setSlot] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [form, setForm] = useState({
    customerName: '',
    email: email || '',
    phone: '',
    notes: ''
  });
  
  const [errors, setErrors] = useState<any>({});

  useEffect(() => {
    // Sync form email if AuthContext email changes
    if (email) {
      setForm(prev => ({ ...prev, email }));
    }
  }, [email]);

  useEffect(() => {
    api.get(`/experts/${id}`).then((res) => {
      setExpert(res.data.expert);
      const foundSlot = res.data.availableSlots.find((s: any) => s._id === slotId);
      if (!foundSlot) {
        alert('Slot is no longer available');
        navigate('/');
      } else {
        setSlot(foundSlot);
      }
      setLoading(false);
    }).catch(console.error);
  }, [id, slotId, navigate]);

  const validate = () => {
    const newErrors: any = {};
    if (!form.customerName) newErrors.customerName = 'Name is required';
    if (!form.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = 'Email is invalid';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    setSubmitting(true);
    try {
      await api.post('/bookings', {
        expertId: expert._id,
        slotId: slot._id,
        customerName: form.customerName,
        email: form.email,
        phone: form.phone,
        date: slot.date,
        timeSlot: slot.time,
        notes: form.notes
      });
      
      // Auto-login the user with this email if they weren't logged in
      if (!email && form.email) {
        login(form.email);
      }

      setSuccess(true);
      setTimeout(() => {
        navigate('/my-bookings');
      }, 3000);
    } catch (err: any) {
      if (err.response && err.response.status === 409) {
        setErrors({ general: 'This slot was just booked by someone else.' });
      } else {
        setErrors({ general: 'Failed to process booking. Please try again.' });
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !expert || !slot) {
    return (
      <div className="flex-1 flex justify-center items-center h-[calc(100vh-64px)]">
        <div className="w-10 h-10 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="flex-1 flex flex-col justify-center items-center h-[calc(100vh-64px)] px-6 text-center animate-in fade-in zoom-in duration-500">
        <div className="w-24 h-24 bg-green-50 rounded-[32px] flex items-center justify-center mb-8">
          <CheckCircle className="w-12 h-12 text-green-500" />
        </div>
        <h1 className="text-4xl font-black text-black mb-4 tracking-tight">Booking Confirmed!</h1>
        <p className="text-xl text-gray-500 font-medium max-w-md">
          Success! Your session with {expert.name} has been scheduled. You'll receive a confirmation email shortly.
        </p>
        <div className="mt-10 flex items-center gap-2 text-gray-400 font-bold uppercase tracking-widest text-xs">
          Redirecting to your bookings...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-10 pb-20">
      <div className="max-w-[1100px] mx-auto px-6">
        <button 
          onClick={() => navigate(-1)}
          className="mb-8 flex items-center gap-2 text-gray-400 hover:text-black transition-colors font-bold uppercase tracking-widest text-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Expert
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Summary Sidebar */}
          <div className="lg:col-span-5 order-2 lg:order-1">
            <div className="bg-white rounded-[40px] border-2 border-gray-50 shadow-xl shadow-black/5 p-8 space-y-8 sticky top-24">
              <h2 className="text-2xl font-black text-black tracking-tight border-b border-gray-100 pb-6">Booking Summary</h2>
              
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-3xl">
                <div className="w-16 h-16 rounded-2xl overflow-hidden bg-white border-2 border-white shadow-sm">
                  {expert.imageUrl ? (
                    <img src={expert.imageUrl} alt={expert.name} className="w-full h-full object-cover grayscale" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-black/5">
                      <span className="text-xl font-black text-black/20">{expert.name.charAt(0)}</span>
                    </div>
                  )}
                </div>
                <div>
                  <div className="text-lg font-black text-black">{expert.name}</div>
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">{expert.category} Expert</div>
                </div>
              </div>

              <div className="space-y-4 px-2">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-black/5 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-black" />
                  </div>
                  <div>
                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Date</div>
                    <div className="text-base font-bold text-black">{new Date(slot.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-black/5 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-black" />
                  </div>
                  <div>
                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Time Slot</div>
                    <div className="text-base font-bold text-black">{slot.time} (60 min)</div>
                  </div>
                </div>
              </div>

              <div className="bg-black rounded-3xl p-6 text-white flex justify-between items-center shadow-lg shadow-black/20">
                <div>
                  <div className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Total Amount</div>
                  <div className="text-sm font-medium">One-time payment</div>
                </div>
                <div className="text-3xl font-black">${expert.basePrice}</div>
              </div>

              <div className="flex items-center gap-2 justify-center text-gray-400">
                <ShieldCheck className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Secure Checkout</span>
              </div>
            </div>
          </div>

          {/* Form Area */}
          <div className="lg:col-span-7 order-1 lg:order-2">
            <div className="bg-white rounded-[40px] border-2 border-black p-8 md:p-12 shadow-sm">
              <div className="mb-10">
                <h1 className="text-3xl font-black text-black mb-2 tracking-tight">Complete Registration</h1>
                <p className="text-gray-500 font-medium">Please provide your details to finalize the booking.</p>
              </div>

              {errors.general && (
                <div className="mb-8 p-4 bg-red-50 border-2 border-red-100 rounded-2xl flex items-center gap-3 text-red-600 font-bold text-sm">
                  <AlertCircle className="w-5 h-5" />
                  {errors.general}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-6">
                  <div className="group">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2 block ml-1">Full Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Alex Rivera"
                      value={form.customerName}
                      onChange={e => {setForm({...form, customerName: e.target.value}); if(errors.customerName) setErrors({...errors, customerName: null})}}
                      className={`w-full bg-gray-50 border-2 rounded-2xl py-4 px-6 text-black font-bold focus:bg-white focus:border-black focus:outline-none transition-all ${errors.customerName ? 'border-red-400 bg-red-50' : 'border-transparent'}`}
                    />
                    {errors.customerName && <p className="mt-2 ml-1 text-xs text-red-500 font-bold uppercase tracking-widest">{errors.customerName}</p>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="group">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2 block ml-1">Email Address</label>
                      <input 
                        type="email" 
                        placeholder="alex@example.com"
                        value={form.email}
                        onChange={e => {setForm({...form, email: e.target.value}); if(errors.email) setErrors({...errors, email: null})}}
                        className={`w-full bg-gray-50 border-2 rounded-2xl py-4 px-6 text-black font-bold focus:bg-white focus:border-black focus:outline-none transition-all ${errors.email ? 'border-red-400 bg-red-50' : 'border-transparent'}`}
                      />
                      {errors.email && <p className="mt-2 ml-1 text-xs text-red-500 font-bold uppercase tracking-widest">{errors.email}</p>}
                    </div>
                    <div className="group">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2 block ml-1">Phone Number</label>
                      <input 
                        type="tel" 
                        placeholder="+1 (555) 000-0000"
                        value={form.phone}
                        onChange={e => setForm({...form, phone: e.target.value})}
                        className="w-full bg-gray-50 border-2 border-transparent rounded-2xl py-4 px-6 text-black font-bold focus:bg-white focus:border-black focus:outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="group">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2 block ml-1">What would you like to discuss?</label>
                    <textarea 
                      placeholder="Tell the expert about your goals..."
                      rows={4}
                      value={form.notes}
                      onChange={e => setForm({...form, notes: e.target.value})}
                      className="w-full bg-gray-50 border-2 border-transparent rounded-2xl py-4 px-6 text-black font-bold focus:bg-white focus:border-black focus:outline-none transition-all resize-none"
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={submitting}
                  className="w-full bg-black text-white py-5 rounded-[24px] font-black text-lg uppercase tracking-widest hover:opacity-90 active:scale-[0.98] transition-all shadow-xl shadow-black/20 disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center gap-3"
                >
                  {submitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : 'Confirm Booking'}
                </button>

                <p className="text-center text-[10px] text-gray-400 font-bold uppercase tracking-[2px] px-8 leading-relaxed">
                  By confirming, you agree to our terms of service and professional engagement guidelines.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
