import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { Star, Filter, ArrowRight, Users, CalendarCheck, Search, ChevronLeft, ChevronRight } from 'lucide-react';

const CATEGORIES = ['All', 'Product Design', 'Engineering', 'Marketing', 'Data Science', 'Business'];

export default function ExpertListScreen() {
  const [experts, setExperts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchExperts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/experts', {
        params: {
          search,
          category,
          page,
          limit: 6
        }
      });
      setExperts(response.data.experts);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      console.error('Error fetching experts:', err);
    } finally {
      setLoading(false);
    }
  }, [search, category, page]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchExperts();
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [fetchExperts]);

  const handleCategoryChange = (cat: string) => {
    setCategory(cat);
    setPage(1);
  };

  return (
    <div className="flex max-w-[1440px] mx-auto min-h-[calc(100vh-64px)] bg-background">
      {/* SideNavBar */}
      <aside className="hidden lg:flex flex-col gap-6 px-6 py-8 w-64 border-r border-outline-variant/30 bg-white sticky top-16 h-[calc(100vh-64px)]">
        {/* Navigation Links */}
        <div className="flex flex-col gap-1">
          <Link to="/" className="flex items-center gap-3 px-4 py-2.5 bg-black text-white font-medium text-sm rounded-xl transition-all shadow-md shadow-black/10">
            <Users className="w-4 h-4" />
            All Experts
          </Link>
          <Link to="/my-bookings" className="flex items-center gap-3 px-4 py-2.5 text-gray-600 hover:bg-gray-50 font-medium text-sm rounded-xl transition-colors">
            <CalendarCheck className="w-4 h-4" />
            My Bookings
          </Link>
        </div>

        <div className="h-px bg-gray-100" />

        {/* Filter Header */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Filter className="text-black w-4 h-4" />
            <h2 className="text-base font-bold text-black uppercase tracking-wider">Filters</h2>
          </div>
          
          <div className="flex flex-col gap-6">
            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Category</h3>
              <div className="flex flex-col gap-1.5">
                {CATEGORIES.map(cat => (
                  <label key={cat} className="flex items-center gap-3 cursor-pointer group py-1">
                    <div className="relative flex items-center justify-center">
                      <input 
                        type="radio" 
                        name="category"
                        checked={category === cat}
                        onChange={() => handleCategoryChange(cat)}
                        className="peer appearance-none w-4 h-4 border-2 border-gray-200 rounded-full checked:border-black transition-all" 
                      />
                      <div className="absolute w-1.5 h-1.5 rounded-full bg-black scale-0 peer-checked:scale-100 transition-transform" />
                    </div>
                    <span className={`text-sm transition-colors ${category === cat ? 'text-black font-bold' : 'text-gray-500 group-hover:text-black'}`}>
                      {cat}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 lg:p-10">
        <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black text-black mb-2 tracking-tight">Explore Experts</h1>
            <p className="text-lg text-gray-500 font-medium">Find and book sessions with world-class mentors.</p>
          </div>
          
          <div className="relative w-full md:w-80 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-black transition-colors" />
            <input 
              type="text" 
              placeholder="Search by name..."
              value={search}
              onChange={(e) => {setSearch(e.target.value); setPage(1);}}
              className="w-full bg-white border-2 border-gray-100 rounded-2xl py-3 pl-12 pr-4 focus:border-black focus:outline-none transition-all shadow-sm focus:shadow-md"
            />
          </div>
        </header>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="bg-white rounded-3xl h-[340px] animate-pulse border-2 border-gray-50" />
            ))}
          </div>
        ) : experts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {experts.map(expert => (
                <article key={expert._id} className="bg-white rounded-3xl border-2 border-gray-50 p-6 shadow-sm hover:shadow-xl hover:border-black/5 transition-all duration-300 group">
                  <div className="flex justify-between items-start mb-6">
                    <div className="relative">
                      <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gray-100 border-2 border-gray-50 shadow-inner">
                        {expert.imageUrl ? (
                          <img src={expert.imageUrl} alt={expert.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-black/5">
                            <span className="text-2xl font-black text-black/20">{expert.name.charAt(0)}</span>
                          </div>
                        )}
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
                    </div>
                    <div className="flex items-center gap-1.5 bg-yellow-400/10 px-3 py-1.5 rounded-full">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-bold text-yellow-700">{expert.rating}</span>
                    </div>
                  </div>
                  
                  <h2 className="text-xl font-bold text-black mb-1 group-hover:text-primary transition-colors">{expert.name}</h2>
                  <p className="text-sm text-gray-500 mb-6 leading-relaxed h-10 line-clamp-2 font-medium">{expert.bio}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-8">
                    <span className="bg-gray-50 text-gray-600 text-[11px] uppercase tracking-widest px-3 py-1.5 rounded-lg font-bold">{expert.category}</span>
                    <span className="bg-gray-50 text-gray-600 text-[11px] uppercase tracking-widest px-3 py-1.5 rounded-lg font-bold">{expert.experience}</span>
                  </div>
                  
                  <Link 
                    to={`/expert/${expert._id}`} 
                    className="w-full py-3.5 bg-gray-50 group-hover:bg-black group-hover:text-white text-black text-sm font-bold rounded-2xl transition-all flex items-center justify-center gap-2"
                  >
                    View Schedule
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </article>
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-16 flex justify-center items-center gap-4">
              <button 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-3 rounded-2xl border-2 border-gray-100 hover:border-black disabled:opacity-30 disabled:hover:border-gray-100 transition-all"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-2">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    className={`w-10 h-10 rounded-xl font-bold transition-all ${page === i + 1 ? 'bg-black text-white shadow-lg shadow-black/20' : 'bg-white text-gray-400 hover:text-black hover:bg-gray-50'}`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <button 
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-3 rounded-2xl border-2 border-gray-100 hover:border-black disabled:opacity-30 disabled:hover:border-gray-100 transition-all"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </>
        ) : (
          <div className="py-20 text-center bg-white rounded-3xl border-2 border-dashed border-gray-100">
            <Users className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-black mb-2">No experts found</h3>
            <p className="text-gray-500 font-medium">Try adjusting your filters or search terms.</p>
            <button 
              onClick={() => {setSearch(''); setCategory('All');}}
              className="mt-6 px-6 py-2.5 bg-black text-white text-sm font-bold rounded-xl hover:opacity-90 transition-opacity"
            >
              Clear all filters
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
