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

function ConditionBadge({ condition }: { condition: string }) {
  const cls =
    condition === 'new' ? 'badge-new' : condition === 'used' ? 'badge-used' : 'badge-refurbished';
  return <span className={`badge ${cls}`}>{condition.charAt(0).toUpperCase() + condition.slice(1)}</span>;
}

export default function Home() {
  const router = useRouter();
  const { data: session } = useSession();
  const [phones, setPhones] = useState<Phone[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ brand: '', condition: '', minPrice: '', maxPrice: '', city: '' });

  const fetchPhones = async (overrides?: Partial<typeof filters> & { search?: string }) => {
    setLoading(true);
    try {
      const active = { ...filters, search: searchTerm, ...overrides };
      const queryParams = new URLSearchParams(
        Object.entries(active).filter(([, v]) => v !== '') as [string, string][]
      );
      const response = await fetch(`/api/phones?${queryParams}`);
      const data = response.ok ? await response.json() : { phones: [] };
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
      condition: (condition as string) || '',
    };
    setFilters(next);
    fetchPhones({ ...next, search: (search as string) || '' });
  }, [router.query]);

  // Re-fetch when filters change via in-page controls
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const next = { ...filters, [e.target.name]: e.target.value };
    setFilters(next);
    fetchPhones(next);
  };

  const clearFilters = () => {
    const clean = { brand: '', condition: '', minPrice: '', maxPrice: '', city: '' };
    setFilters(clean);
    setSearchTerm('');
    fetchPhones(clean);
    router.push('/', undefined, { shallow: true });
  };

  const activeBrandFilter = filters.brand;

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-10 h-10 border-4 border-gray-300 border-t-4 border-t-orange-500 rounded-full animate-spin"></div>
      </div>
    );

  return (
    <div className="space-y-6">
      <section className="rounded-2xl bg-gradient-to-br from-blue-50 via-white to-orange-50 border border-blue-100 p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
          <div className="max-w-2xl">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight">
              Find the right phone in minutes
            </h1>
            <p className="mt-2 text-gray-600 text-sm sm:text-base">
              Clean listings, simple filters, and quick posting for sellers across Pakistan.
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/phones/add"
              className="inline-flex items-center justify-center px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-lg transition-colors"
            >
              Post an Ad
            </Link>
            {!session && (
              <Link
                href="/auth/signin"
                className="inline-flex items-center justify-center px-5 py-2.5 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 text-sm font-semibold rounded-lg transition-colors"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </section>

      <div className="bg-white border border-gray-200 rounded-xl p-3 sm:p-4">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
          <button
            onClick={() => {
              clearFilters();
            }}
            className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
              !activeBrandFilter
                ? 'bg-orange-500 border-orange-500 text-white'
                : 'bg-gray-100 border-gray-200 text-gray-700 hover:border-orange-400 hover:text-orange-600'
            }`}
          >
            All Brands
          </button>
          {BRANDS.map((b) => (
            <button
              key={b}
              onClick={() => {
                const cleanBrand = b;
                setFilters({ ...filters, brand: cleanBrand });
                fetchPhones({ ...filters, brand: cleanBrand, search: '' });
              }}
              className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                activeBrandFilter === b
                  ? 'bg-orange-500 border-orange-500 text-white'
                  : 'bg-gray-100 border-gray-200 text-gray-700 hover:border-orange-400 hover:text-orange-600'
              }`}
            >
              {b}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 items-end">
        <input
          type="text"
          placeholder="Search listings"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            fetchPhones({ search: e.target.value });
          }}
          className="col-span-2 sm:col-span-1 lg:col-span-2 px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-orange-500"
        />
        <select
          name="condition"
          value={filters.condition}
          onChange={handleFilterChange}
          className="px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-orange-500"
        >
          <option value="">All Conditions</option>
          {CONDITIONS.map((c) => (
            <option key={c} value={c}>
              {c.charAt(0).toUpperCase() + c.slice(1)}
            </option>
          ))}
        </select>
        <select
          name="city"
          value={filters.city}
          onChange={handleFilterChange}
          className="px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-orange-500"
        >
          <option value="">All Cities</option>
          {CITIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <div className="flex gap-2">
          <input
            type="number"
            name="minPrice"
            placeholder="Min Rs"
            value={filters.minPrice}
            onChange={handleFilterChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-orange-500"
          />
        </div>
        <div className="flex gap-2">
          <input
            type="number"
            name="maxPrice"
            placeholder="Max Rs"
            value={filters.maxPrice}
            onChange={handleFilterChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-orange-500"
          />
          <button
            onClick={clearFilters}
            title="Clear"
            className="shrink-0 px-3 py-2 text-sm font-semibold bg-gray-100 hover:bg-gray-200 rounded transition-colors"
          >
            Clear
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">
          {activeBrandFilter ? `${activeBrandFilter} Phones` : 'Latest Listings'}
          <span className="ml-2 text-orange-500">({phones.length})</span>
        </h2>
        {(session || true) && (
          <Link
            href="/phones/add"
            className="text-sm font-semibold text-orange-600 hover:text-orange-700 transition-colors"
          >
            + Post Ad
          </Link>
        )}
      </div>

      {phones.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5">
          {phones.map((phone) => (
            <Link key={phone._id} href={`/phones/${phone._id}`} className="product-card group block">
              <div className="relative bg-gray-50 h-44 overflow-hidden rounded">
                <Image
                  src={phone.images[0] || '/placeholder.jpg'}
                  alt={phone.title}
                  fill
                  className="object-contain p-2 group-hover:scale-105 transition-transform"
                />
                <div className="absolute top-2 right-2">
                  <ConditionBadge condition={phone.condition} />
                </div>
              </div>
              <div className="p-3">
                <p className="text-xs font-semibold text-orange-600 uppercase tracking-wide mb-1">
                  {phone.brand}
                </p>
                <h3 className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2 mb-1 min-h-[2.6rem]">
                  {phone.title}
                </h3>
                <p className="text-xs text-gray-500 mb-2">{phone.location.city}</p>
                <p className="text-lg font-extrabold text-gray-900 mb-1">
                  Rs. <span className="text-orange-500">{phone.price.toLocaleString()}</span>
                </p>
                <div className="flex items-center justify-between mt-2 text-[10px] text-gray-400">
                  <span>{phone.views} views</span>
                  <span>
                    {new Date(phone.createdAt).toLocaleDateString('en-PK', { day: '2-digit', month: 'short' })}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl text-center py-16 px-6">
          <p className="text-gray-700 font-semibold text-lg mb-1">No phones found</p>
          <p className="text-gray-400 text-sm">Try adjusting your filters or clear to see all listings.</p>
          <button
            onClick={clearFilters}
            className="mt-4 px-4 py-2 bg-orange-500 text-white text-sm font-bold rounded hover:bg-orange-600 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}
