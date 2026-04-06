import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';

interface Phone {
  _id: string;
  title: string;
  brand: string;
  model: string;
  condition: string;
  price: number;
  images: string[];
  location: { city: string; area: string };
  specifications: { storage: string; ram: string; battery: string; camera: string; display: string; os: string };
  seller: { name: string; email: string; phone: string; city: string };
  createdAt: string;
  views: number;
}

const BRANDS = ['Samsung', 'Apple', 'Xiaomi', 'Oppo', 'Vivo', 'OnePlus', 'Huawei', 'Google', 'Realme', 'Tecno'];
const CONDITIONS = ['new', 'used', 'refurbished'];
const CITIES = ['Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Peshawar', 'Quetta', 'Multan'];

function ConditionBadge({ condition }: { conditifunction ConditionBadge({ condition }: { conditifunction ConditionBadge({ condition }: { cbafunction ConditionBadge({ condition }: { cospfunction ConditionBadge({ condition }: { conpan>;
}

export default functionexport default functionexport ioexport default functionexport default feRoexport defaultt [phones, setPhones] = useState<Phone[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ brand: '', condition: '', minPrice: '', maxPrice: '', city: '' });

  const fetchPhones = async   const fetchPhones = async   const fetchPhones = async   const fetchPy   const fetchPhonive   const fetchs, search: searchTerm, ...overrides };
      const queryParams = new URLSearchParams(
        Object.entries(active).filter(([, v]) => v !== '') as [string, string][]
                                                                                                                 ();
      if (response.ok) setPhones(data.phones);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Handle brand/condition shortcut from URL or category bar
  useEffect(() => {
    const { brand, condition, search } = router.query;
    const next = {
      ...filters,
      brand: (brand as string) || '',
      condition: (condition as st      condition: (condition as st      conditise      condition: (condition as st      condition: ones({ ...next, search: (search as string) || '' });
  }, [router.query]);

  // Re-fetch when filters change via in-page controls
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const next = { ...filters, [e.target.name]: e.target.value };
    setFilters(next);
    fetchPhones({ .    fetchPhones({ .    fetchPhones({ .    fetchPhones({ .    fetchPhones({ .   condition: '', minPrice: '', maxPrice: '', city: '' };
    setFilters(clean);
    setSearchTerm('');
    fetchPhones({     fetchPhones({     fetchPhones({     fetch/', undefined, { shallow: true });
  };

  const activeBrandFilter = filters.brand;

  if (loading)  i    return (
      <div className="flex justify-center items-center h-64">
        <d        <d        <d        <d        <d        <d   der-b-4 border-orange-500"></div>
                                  (
    <div className="space-y-6">
      {/* ── Hero banner ── */}
      <div className="rounded-xl overflow-hidden relative bg-[#111] text-white min-h-[220px] flex items-center">
        {/* Background decora        {/* Background decora        {/* Background drf        {/* Background decora        {/* Background decora        {/* Background drf        {range-500/10 blur-3xl" />
          <div className="absolute left-1/          <div class60 rounded-full bg-blue-500/10 blur-3xl" />
          <div className="absolute inset-0"
            style={{
              backgroundImage: 'linear-gradient(135deg,rgba(249,115,22,0.12) 0%,transparent               backgroundImage: 'linear-gradient(135deg,rgba(249,115,22,0.12) 0%,transparent     m:px-10               backgroundImage: 'linear-grms-center justify-between w-full               backgroundImage: 'linear-gradient(135d"inline-bl              backgroundImage: 'linear-gradient(135deg,rgba(249,115,22,0.12) 0%,transparent b-3">              backgroundImage: 'liar              backgroundImage                 backgroundImage: 'lineart-4xl sm:text-5xl font-bold leading-tight text-white">
              Buy &amp; Sell<br />
              <span class              <span class              <span class              <span class              <span class              <span class              <span class              <span class              <span class an              <span class              <span class              <span class              <span class   <Li              <span class              <sp            className="mt-5 inline-flex items-center px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold rounded transition-colors"
              >
                + LIST YOUR PHONE
              </Link>
            ) : (
              <Link
                href="/auth/signup"
                className="mt-5 inline-flex items-center px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold rounded transition-colors"
              >
                START SELLING FREE
              </Link>
            )}
          </div>

          {/* Stats strip */}
          <div className="flex sm:flex-col gap-6 sm:          <div className="flex sm:flex-col gap-6 sm:          <div className="flex sm:flex-col gap-6 sm:          <div className="flex sm:flex-col gap-6 sm:          <div className="flex sm:flex-col gap-6 sm:          <div className="flex sm:flex-col gap-6 sm:          <div className="flex sm:flex-col gap-6 sm:          <div className="flex sm:flex-col gap-6 sm:          <div className="flex sm:flex-col gap-6 sm:          <div className="flex sm:flex-col gap-6 sm:          <div className="flex sm:flex-col gap-6 sm:                     <div>
            ))}
          </div>
        </div>
      </      </      </�      </      ck-filter chips ── */}
      <div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
          <button
            onClick={() => { clearFilters(); }}
            className={`shrink-0 px-4 py-1.5 rounded text-sm font-semibold border transition-colors ${
              !activeBrandFilter ? 'bg-oran              !activeBrandFilter ? 'bg-oran              !activeBrandFilter ? 'bg-oran              !activeBrandFilter ? 'bg-oran              !activeBrandFilter ? 'bg-oran              !activeBrandFilter ? 'bg-oran              !activeBrandFilter ? 'bg-oran              !activeBrandFilter ? 'bg-oran              !activeBrandFilter ? 'bg-oran              !activeBrandFilter ? 'bg-oran              !activeBrandFilter ? 'bg-oran              !activeBrandFilter ? 'bg-oran              !activeBrandFilter ? 'bg-oran              !activeBrandFilter ? 'bg-oran              !activeBrandFilter ? 'bgiv              ==              !               nge-500 border-orange-500 text-white'
                  : 'bg-white border-gray-200 text-gray-700 hover:border-orange-500 hover:text-orange-500'
              }`}
                                                                                                                                               <div className="bg-white border border-gray-200 rounded-xl p-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 items-end">
        <input
          type="text"
          placeholder="🔍  Search..."
          value={searchTerm}
          onChange={(e) => { setSearchTerm(e.target.value); fetchPhones({ search: e.target.value }); }}
          className="col-span-2 sm:col-span-1 lg:col-span-2 px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-orange-500"
        />
        <select name="condition" value={filters.condition} onChange={handleFilterChange}
          className="px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-orange-500">
          <option value="">All Conditions</option>
          {CONDITIONS.map(c => <option key={c} value={c} className="capitalize">{c.charAt(0).toUpperCase()          {CONDIti          {CONDITIONS.map(c => <option key={c} value={c} className="capitalize">{c.charAt(0).toUpperCase()          {CONDIti          {CONDITIONS.map(c => <option key={c} value={c} className="capitalize">{c.charAt(0).toUpperCase()          {CONDIti          {CONDITIONS      {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
        </selec        </selec        </s"flex gap-2">
          <input type="number" name="minPrice" placeholder="Min Rs" value={filters.minPrice} onChange={handleFilterChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-orange-500" />
        </div>
        <div className="flex gap-2">
          <input type="number" name="maxPrice" placeholder="Max Rs" value={filters.maxPrice} onChange={handleFilterChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-orange-500" />
          <button onClick={clearFilters} title="Clear" className="shrink-0 px-3 py-2 text-sm font-semibold bg-gray-100 hover:bg-gray-200 rounded transition-colors">✕</button>
        </div>
      </div>

      {/* ── Listings header ── */}
      <div className="flex items-center justify-between">
        <h2 className="brand-font text-xl font-bold text-gray-900 uppercase tracking-wide">
          {activeBrandFilter ? `${activeBrandFilter} Phones` : 'Latest Listings'}
          <span className="ml-2 text-orange-500">({phones.length})</span>
        </h2>
        {session && (
          <Link href="/phones/add" className="text-sm font-semibold text-orange-500 hover:text-orange-600 transition-colors">
            + Add Listing
          </Link>
        )}
      </div>

      {/* ── Product grid ── */}
      {phones.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {phones.map((phone) => (
            <Link key={phone._id} href={`/phones/${phone._id}`} className="product-card group block">
              {/* Image */}
              <div className="relative bg-gray-50 h-44 overflow-hidden">
                <Image
                                                        phone.jpg'}
                  alt={phone.title}
                  fill
                  className="object-contain p-2 group-hover:scale-105 transition-tran                  className="object-contain p-2 group-hover:scale-105 transitie to                  className="object-contain p-2 group-hov{phone.condition}                         >
                                                                                                                                     old text-orange-500 uppercase tracking-widest mb-0.5">{phone.brand}</p>                                    d-fon                           ay-900 uppercase leading-snug line-clamp-2 mb-1">
                  {phone.title}
                </h3>
                <p className="text-xs text-gray-500 mb-2">
                  📍 {phone.location.city}
                </p>
                <p className="text-lg font-extrabold text-gray-900">
                  Rs. <span className="text-orange-500">{phone.price.toLocaleString()}</span>
                </p>
                <div className="flex items-center justify-between mt-2 text-[10px] text-gray-400">
                  <span>👁 {phone.views}</span>
                  <span>{new Date(phone.createdAt).toLocaleDateString('en-PK', { day: '2-digit', month: 'short' })}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl text-center py-16 px-6">
          <p className="text-5xl mb-4">📱</p>
          <p className="text-gray-700 font-semibold text-lg mb-1">No phones found</p>
          <p className="text-gray-400 text-sm">Try adjusting your filters or clear to see all listings.</p>
                                                              p                                         t-wh             ont-bold                                                              p  </button>
        </div>
      )}
    </div>
  );
}
