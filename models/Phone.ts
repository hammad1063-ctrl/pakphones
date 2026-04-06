import mongoose from 'mongoose';

const PhoneSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  brand: {
    type: String,
    required: true,
  },
  model: {
    type: String,
    required: true,
  },
  condition: {
    type: String,
    enum: ['new', 'used', 'refurbished'],
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  images: [{
    type: String,
    required: true,
  }],
  location: {
    city: {
      type: String,
      required: true,
    },
    area: {
      type: String,
      required: true,
    },
  },
  specifications: {
    storage: {
      type: String,
      required: true,
    },
    ram: {
      type: String,
      required: true,
    },
    battery: {
      type: String,
      required: true,
    },
    camera: {
      type: String,
      required: true,
    },
    display: {
      type: String,
      required: true,
    },
    os: {
      type: String,
      required: true,
    },
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  isSold: {
    type: Boolean,
    default: false,
  },
  views: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for search
PhoneSchema.index({ title: 'text', brand: 'text', model: 'text', description: 'text' });
PhoneSchema.index({ 'location.city': 1, 'location.area': 1 });
PhoneSchema.index({ brand: 1, model: 1 });
PhoneSchema.index({ price: 1 });
PhoneSchema.index({ createdAt: -1 });

export default mongoose.models.Phone || mongoose.model('Phone', PhoneSchema);