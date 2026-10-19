import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    code: { type: String, trim: true, default: '' },
    name: { type: String, required: true, trim: true },
    collection: { type: String, trim: true, default: 'Collection' },
    category: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    description: { type: String, default: '' },
    material: { type: String, default: '' },
    care: { type: String, default: '' },
    availability: { type: String, default: 'Available' },
    featured: { type: Boolean, default: false },
    images: { type: [String], default: [] },
    inStock: { type: Boolean, default: true }
  },
  // `collection` (jewellery collection name) is a reserved Mongoose word; it works on documents,
  // and the warning is silenced on purpose. Renaming it would also mean changing the frontend + seed data.
  { timestamps: true, suppressReservedKeysWarning: true }
);

export default mongoose.model('Product', productSchema);
