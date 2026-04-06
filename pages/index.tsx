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
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Welcome to PakPhones
        </h1>
        <p className="text-gray-600 mb-6">
          Pakistan's premier mobile phone marketplace. Buy and sell phones with confidence.
        </p>

        {session && (
          <Link
            href="/phones/add"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            + Add Your Phone
          </Link>
        )}
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow p-6">
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

        <button
          onClick={clearFilters}
          className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
        >
          Clear Filters
        </button>
      </div>

      {/* Phone Listings */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {phones.map((phone) => (
          <div key={phone._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative h-48">
              <Image
                src={phone.images[0] || '/placeholder-phone.jpg'}
                alt={phone.title}
                fill
                className="object-cover"
              />
            </div>

            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                <Link href={`/phones/${phone._id}`} className="hover:text-blue-600">
                  {phone.title}
                </Link>
              </h3>

              <p className="text-sm text-gray-600 mb-2">
                {phone.brand} {phone.model} • {phone.condition}
              </p>

              <p className="text-xl font-bold text-blue-600 mb-2">
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
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No phones found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}