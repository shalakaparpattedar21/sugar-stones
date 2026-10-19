import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';

dotenv.config();

const products = JSON.parse(
  fs.readFileSync(path.resolve('seed-data/products.json'), 'utf-8')
);

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    for (const item of products) {
      const data = {
        code: item.code || '',
        name: item.name,
        collection: item.collection || 'Collection',
        category: item.category || 'Jewellery',
        price: Number(item.price || 0),
        description: item.description || '',
        material: item.material || '',
        care: item.care || '',
        availability: item.availability || 'Available',
        featured: Boolean(item.featured),
        images: Array.isArray(item.images) ? item.images : [],
        inStock: item.availability !== 'Out of Stock'
      };

      const existing = await Product.findOne({ code: data.code });
      if (existing) {
        await Product.findByIdAndUpdate(existing._id, data, { runValidators: true });
      } else {
        await Product.create(data);
      }
    }

    console.log(`Seeded ${products.length} Sugar & Stones products.`);
  } catch (error) {
    console.error('Seed failed:', error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

seed();
