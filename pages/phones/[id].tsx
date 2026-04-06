import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';

interface Phone {
  _id: string;
  title: string;
  brand: string;
  model: string;
  condition: string;
  price: number;
  description: string;
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
    _id?: string;
    name: string;
    email: string;
    phone: string;
    city: string;
  };
  createdAt: string;
  views: number;
  isSold: boolean;
}

export default function PhoneDetail() {
  const { data: session } = useSession();
  const router = useRouter();
  const { id } = router.query;
  const [phone, setPhone] = useState<Phone | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (id) {
      fetchPhone();
    }
  }, [id]);

  const fetchPhone = async () => {
    try {
      const response = await fetch(`/api/phones/${id}`);
      const data = await response.json();

      if (response.ok) {
        setPhone(data.phone);
      } else {
        console.error('Failed to fetch phone:', data.message);
      }
    } catch (error) {
      console.error('Error fetching phone:', error);
    } finally {
      setLoading(false);
    }
  };

  const nextImage = () => {
    if (phone) {
      setCurrentImageIndex((prev) => (prev + 1) % phone.images.length);
    }
  };

  const prevImage = () => {
    if (phone) {
      setCurrentImageIndex((prev) => (prev - 1 + phone.images.length) % phone.images.length);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!phone) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Phone Not Found</h2>
        <p className="text-gray-600 mb-6">The phone you're looking for doesn't exist or has been removed.</p>
        <Link href="/" className="text-blue-600 hover:text-blue-800">
          ← Back to listings
        </Link>
      </div>
    );
  }

  const isOwner = !!session?.user?.id && session.user.id === phone.seller._id;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Images */}
        <div className="space-y-4">
          <div className="relative h-96 bg-gray-100 rounded-lg overflow-hidden">
            <Image
              src={phone.images[currentImageIndex] || '/placeholder-phone.jpg'}
              alt={phone.title}
              fill
              className="object-contain"
            />

            {phone.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-opacity-75"
                >
                  ‹
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-opacity-75"
                >
                  ›
                </button>
              </>
            )}
          </div>

          {phone.images.length > 1 && (
            <div className="flex space-x-2 overflow-x-auto">
              {phone.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 ${
                    index === currentImageIndex ? 'border-blue-500' : 'border-gray-300'
                  }`}
                >
                  <Image
                    src={image}
                    alt={`Phone ${index + 1}`}
                    width={80}
                    height={80}
                    className="object-cover w-full h-full"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{phone.title}</h1>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span>{phone.brand} {phone.model}</span>
              <span>•</span>
              <span className="capitalize">{phone.condition}</span>
              <span>•</span>
              <span>👁️ {phone.views} views</span>
            </div>
          </div>

          <div className="text-3xl font-bold text-blue-600">
            Rs. {phone.price.toLocaleString()}
          </div>

          <div className="flex items-center space-x-2 text-gray-600">
            <span>📍</span>
            <span>{phone.location.city}, {phone.location.area}</span>
          </div>

          {phone.isSold && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-md">
              This phone has been sold
            </div>
          )}

          {/* Seller Information */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Seller Information</h3>
            <div className="space-y-2">
              <p><strong>Name:</strong> {phone.seller.name}</p>
              <p><strong>Phone:</strong> {phone.seller.phone}</p>
              <p><strong>City:</strong> {phone.seller.city}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4">
            {!phone.isSold && (
              <button className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 font-medium">
                Contact Seller
              </button>
            )}

            {isOwner && (
              <div className="flex space-x-2">
                <Link
                  href={`/phones/${phone._id}/edit`}
                  className="bg-gray-600 text-white py-3 px-6 rounded-md hover:bg-gray-700 font-medium"
                >
                  Edit
                </Link>
                <button className="bg-red-600 text-white py-3 px-6 rounded-md hover:bg-red-700 font-medium">
                  Mark as Sold
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="mt-8 bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Description</h2>
        <p className="text-gray-700 whitespace-pre-line">{phone.description}</p>
      </div>

      {/* Specifications */}
      <div className="mt-6 bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Specifications</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex justify-between py-2 border-b border-gray-200">
            <span className="font-medium text-gray-700">Storage</span>
            <span className="text-gray-900">{phone.specifications.storage}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-200">
            <span className="font-medium text-gray-700">RAM</span>
            <span className="text-gray-900">{phone.specifications.ram}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-200">
            <span className="font-medium text-gray-700">Battery</span>
            <span className="text-gray-900">{phone.specifications.battery}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-200">
            <span className="font-medium text-gray-700">Camera</span>
            <span className="text-gray-900">{phone.specifications.camera}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-200">
            <span className="font-medium text-gray-700">Display</span>
            <span className="text-gray-900">{phone.specifications.display}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-200">
            <span className="font-medium text-gray-700">Operating System</span>
            <span className="text-gray-900">{phone.specifications.os}</span>
          </div>
        </div>
      </div>

      {/* Back Button */}
      <div className="mt-8">
        <Link href="/" className="text-blue-600 hover:text-blue-800">
          ← Back to listings
        </Link>
      </div>
    </div>
  );
}