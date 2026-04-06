import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';

interface Phone {
  _id: string;
  title: string;
  brand: string;
  model: string;
  condition: string;
  price: number;
  images: string[];
  location: {
    city: string;
    area: string;
  };
  specifications: {
    storage: string;
    ram: string;
    battery: string;
    camera: string;
    display: string;
    os: string;
  };
  seller: {
    name: string;
    email: string;
    phone: string;
    city: string;
  };
  createdAt: string;
  views: number;
}

export default function Home() {
  const { data: session } = useSession();
  const [phones, setPhones] = useState<Phone[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    brand: '',
    condition: '',
    minPrice: '',
    maxPrice: '',
    city: '',
  });

  const fetchPhones = async () => {
    try {
      const queryParams = new URLSearchParams({
        ...filters,
        search: searchTerm,
      });

      const response = await fetch(`/api/phones?${queryParams}`);
      const data = await response.json();

      if (response.ok) {
        setPhones(data.phones);
      }
    } catch (error) {
      console.error('Error fetching phones:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhones();
  }, [filters, searchTerm]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const clearFilters = () => {
    setFilters({
      brand: '',
      condition: '',
      minPrice: '',
      maxPrice: '',
      city: '',
    });
    setSearchTerm('');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="grid-noise relative overflow-hidden rounded-2xl border border-white/70 glass-card p-6 sm:p-8">
        <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-blue-400/25 blur-3xl" />
        <div className="absolute -left-16 -bottom-16 h-52 w-52 rounded-full bg-orange-300/30 blur-3xl" />

        <div className="relative">
          <span className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold tracking-wide text-blue-700">
            Pakistan Mobile Marketplace
          </span>
          <h1 className="headline-font mt-4 text-3xl sm:text-4xl font-bold text-slate-900 leading-tight">
            Find your next phone with confidence.
          </h1>
          <p className="mt-3 max-w-2xl text-slate-600">
            Compare listings, explore top brands, and discover great deals across major cities in Pakistan.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            {session && (
              <Link
                href="/phones/add"
                className="inline-flex items-center px-5 py-2.5 text-sm font-semibold rounded-full text-white bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 shadow-md"
              >
                + Add Your Phone
              </Link>
            )}
            <div className="inline-flex items-center gap-2 rounded-full bg-white/85 px-4 py-2 text-sm text-slate-700 border border-slate-200">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Trusted by buyers and sellers
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="glass-card rounded-2xl p-6 border border-white/70">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="headline-font text-xl font-bold text-slate-900">Search and Filter</h2>
          <button
            onClick={clearFilters}
            className="px-4 py-2 text-sm rounded-full font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            Clear Filters
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <input
            type="text"
            placeholder="Search phones..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <select
            name="brand"
            value={filters.brand}
            onChange={handleFilterChange}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Brands</option>
            <option value="Samsung">Samsung</option>
            <option value="Apple">Apple</option>
            <option value="Huawei">Huawei</option>
            <option value="Xiaomi">Xiaomi</option>
            <option value="Oppo">Oppo</option>
            <option value="Vivo">Vivo</option>
            <option value="OnePlus">OnePlus</option>
            <option value="Google">Google</option>
          </select>

          <select
            name="condition"
            value={filters.condition}
            onChange={handleFilterChange}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Conditions</option>
            <option value="new">New</option>
            <option value="used">Used</option>
            <option value="refurbished">Refurbished</option>
          </select>

          <input
            type="text"
            name="city"
            placeholder="City"
            value={filters.city}
            onChange={handleFilterChange}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex gap-4 mb-4">
          <input
            type="number"
            name="minPrice"
            placeholder="Min Price"
            value={filters.minPrice}
            onChange={handleFilterChange}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-32"
          />
          <input
            type="number"
            name="maxPrice"
            placeholder="Max Price"
            value={filters.maxPrice}
            onChange={handleFilterChange}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-32"
          />
        </div>

      </div>

      {/* Phone Listings */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {phones.map((phone) => (
          <div key={phone._id} className="listing-card glass-card rounded-2xl overflow-hidden border border-white/70">
            <div className="relative h-52">
              <Image
                src={phone.images[0] || '/placeholder-phone.jpg'}
                alt={phone.title}
                fill
                className="object-cover"
              />
            </div>

            <div className="p-5">
              <h3 className="headline-font text-lg font-bold text-slate-900 mb-2 leading-snug">
                <Link href={`/phones/${phone._id}`} className="hover:text-blue-600 transition-colors">
                  {phone.title}
                </Link>
              </h3>

              <div className="mb-3 flex flex-wrap items-center gap-2 text-xs font-semibold">
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-slate-700">{phone.brand} {phone.model}</span>
                <span className="rounded-full bg-blue-100 px-2.5 py-1 text-blue-700 capitalize">{phone.condition}</span>
              </div>

              <p className="text-2xl font-extrabold text-blue-700 mb-2">
                Rs. {phone.price.toLocaleString()}
              </p>

              <p className="text-sm text-gray-500 mb-2">
                📍 {phone.location.city}, {phone.location.area}
              </p>

              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>👁️ {phone.views} views</span>
                <span>{new Date(phone.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {phones.length === 0 && (
        <div className="glass-card rounded-2xl text-center py-12 px-6 border border-white/70">
          <p className="text-slate-600 text-lg">No phones found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}