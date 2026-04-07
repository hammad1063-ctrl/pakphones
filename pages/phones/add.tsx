import { useState } from 'react';
import { useRouter } from 'next/router';

export default function AddPhone() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [images, setImages] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    title: '',
    brand: '',
    model: '',
    condition: '',
    price: '',
    description: '',
    ptaStatus: 'pta',
    completeBox: 'yes',
    originalCharger: 'yes',
    hasBeenRepaired: 'no',
    location: {
      city: '',
      area: '',
    },
    specifications: {
      storage: '',
      ram: '',
      battery: '',
      camera: '',
      display: '',
      os: '',
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...(formData as any)[parent],
          [child]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const selected = Array.from(files);
    if (images.length + selected.length > 10) {
      setError('You can upload up to 10 photos only.');
      return;
    }

    const fileToDataUrl = (file: File) =>
      new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(new Error('Failed to read image'));
        reader.readAsDataURL(file);
      });

    try {
      const encodedImages = await Promise.all(selected.map(fileToDataUrl));
      setImages([...images, ...encodedImages]);
      setError('');
    } catch (uploadError) {
      setError('Could not process selected images. Please try again.');
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (images.length === 0) {
      setError('Please add at least one image');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/phones', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          images,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        router.push('/');
      } else if (response.status === 401) {
        setError('Please sign in to publish this ad. You can fill the form first and sign in at submit time.');
      } else {
        setError(data.message || 'Failed to create listing');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="theme-panel overflow-hidden">
          <div className="theme-panel-soft rounded-none p-6 sm:p-8 border-0 border-b">
            <h1 className="brand-font text-3xl font-bold mb-2 text-gray-900">POST YOUR AD</h1>
            <p className="text-gray-600 text-sm">Fill in the details below to list your phone</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
            {/* Ad title */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
                Ad Title *
              </label>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                className="theme-input w-full px-4 py-2.5 rounded-lg"
                placeholder="e.g., iPhone 13 Pro Max 256GB PTA Approved"
              />
            </div>

            {/* Phone Model & Brand */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
                  Phone Model *
                </label>
                <input
                  type="text"
                  name="model"
                  required
                  value={formData.model}
                  onChange={handleChange}
                  className="theme-input w-full px-4 py-2.5 rounded-lg"
                  placeholder="e.g., iPhone 13 Pro Max, Samsung Galaxy S21"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
                  Brand *
                </label>
                <select
                  name="brand"
                  required
                  value={formData.brand}
                  onChange={handleChange}
                  className="theme-input w-full px-4 py-2.5 rounded-lg"
                >
                  <option value="">Select Brand</option>
                  <option value="Samsung">Samsung</option>
                  <option value="Apple">Apple</option>
                  <option value="Xiaomi">Xiaomi</option>
                  <option value="Oppo">Oppo</option>
                  <option value="Vivo">Vivo</option>
                  <option value="OnePlus">OnePlus</option>
                  <option value="Huawei">Huawei</option>
                  <option value="Google">Google Pixel</option>
                  <option value="Realme">Realme</option>
                  <option value="Tecno">Tecno</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            {/* Price & Condition */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
                  Price (Rs.) *
                </label>
                <input
                  type="number"
                  name="price"
                  required
                  value={formData.price}
                  onChange={handleChange}
                  className="theme-input w-full px-4 py-2.5 rounded-lg"
                  placeholder="e.g., 150000"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
                  Condition *
                </label>
                <select
                  name="condition"
                  required
                  value={formData.condition}
                  onChange={handleChange}
                  className="theme-input w-full px-4 py-2.5 rounded-lg"
                >
                  <option value="">Select Condition</option>
                  <option value="new">New</option>
                  <option value="used">Used</option>
                  <option value="refurbished">Refurbished</option>
                </select>
              </div>
            </div>

            {/* PTA & Accessories */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
                  PTA Status *
                </label>
                <select
                  name="ptaStatus"
                  value={formData.ptaStatus}
                  onChange={handleChange}
                  className="theme-input w-full px-4 py-2.5 rounded-lg"
                >
                  <option value="pta">PTA Approved</option>
                  <option value="nonpta">Non-PTA</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
                  Has Complete Box? *
                </label>
                <select
                  name="completeBox"
                  value={formData.completeBox}
                  onChange={handleChange}
                  className="theme-input w-full px-4 py-2.5 rounded-lg"
                >
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>
            </div>

            {/* Charger & Repairs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
                  Original Charger & Cable? *
                </label>
                <select
                  name="originalCharger"
                  value={formData.originalCharger}
                  onChange={handleChange}
                  className="theme-input w-full px-4 py-2.5 rounded-lg"
                >
                  <option value="yes">Yes</option>
                  <option value="partial">Partial</option>
                  <option value="no">No</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
                  Has Been Repaired? *
                </label>
                <select
                  name="hasBeenRepaired"
                  value={formData.hasBeenRepaired}
                  onChange={handleChange}
                  className="theme-input w-full px-4 py-2.5 rounded-lg"
                >
                  <option value="no">No</option>
                  <option value="minor">Minor Repairs</option>
                  <option value="major">Major Repairs</option>
                </select>
              </div>
            </div>

            {/* Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
                  City *
                </label>
                <input
                  type="text"
                  name="location.city"
                  required
                  value={formData.location.city}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                  placeholder="e.g., Karachi"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
                  Area *
                </label>
                <input
                  type="text"
                  name="location.area"
                  required
                  value={formData.location.area}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                  placeholder="e.g., DHA Phase 5"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
                Description *
              </label>
              <textarea
                name="description"
                required
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="theme-input w-full px-4 py-2.5 rounded-lg"
                placeholder="Describe the phone's condition, features, any scratches, screen issues, or other relevant details..."
              />
              <p className="text-xs text-gray-500 mt-1">Minimum 10 characters</p>
            </div>

            {/* Specifications */}
            <div>
              <h2 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">Phone Specifications</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
                    Storage *
                  </label>
                  <input
                    type="text"
                    name="specifications.storage"
                    required
                    value={formData.specifications.storage}
                    onChange={handleChange}
                    className="theme-input w-full px-4 py-2.5 rounded-lg"
                    placeholder="e.g., 128GB"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
                    RAM *
                  </label>
                  <input
                    type="text"
                    name="specifications.ram"
                    required
                    value={formData.specifications.ram}
                    onChange={handleChange}
                    className="theme-input w-full px-4 py-2.5 rounded-lg"
                    placeholder="e.g., 8GB"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
                    Battery *
                  </label>
                  <input
                    type="text"
                    name="specifications.battery"
                    required
                    value={formData.specifications.battery}
                    onChange={handleChange}
                    className="theme-input w-full px-4 py-2.5 rounded-lg"
                    placeholder="e.g., 5000mAh"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
                    Camera *
                  </label>
                  <input
                    type="text"
                    name="specifications.camera"
                    required
                    value={formData.specifications.camera}
                    onChange={handleChange}
                    className="theme-input w-full px-4 py-2.5 rounded-lg"
                    placeholder="e.g., 50MP + 12MP"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
                    Display *
                  </label>
                  <input
                    type="text"
                    name="specifications.display"
                    required
                    value={formData.specifications.display}
                    onChange={handleChange}
                    className="theme-input w-full px-4 py-2.5 rounded-lg"
                    placeholder="e.g., 6.7 inch OLED"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
                    Operating System *
                  </label>
                  <input
                    type="text"
                    name="specifications.os"
                    required
                    value={formData.specifications.os}
                    onChange={handleChange}
                    className="theme-input w-full px-4 py-2.5 rounded-lg"
                    placeholder="e.g., iOS 17 / Android 14"
                  />
                </div>
              </div>
            </div>

            {/* Images */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
                Upload Photos *
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="theme-input w-full px-4 py-2.5 rounded-lg"
              />
              <p className="text-xs text-gray-500 mt-1">
                Upload up to 10 clear photos. First image will be shown as main image.
              </p>

              {images.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-4">
                  {images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image}
                        alt={`Photo ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg border border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 shadow-md"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="theme-btn-primary flex-1 px-6 py-3 disabled:bg-gray-400 text-white font-bold uppercase tracking-wide rounded-lg transition-colors"
              >
                {loading ? 'Publishing...' : '✓ Publish Your Ad'}
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold uppercase tracking-wide rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
