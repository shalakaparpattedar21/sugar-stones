import { api } from './api';

const localProducts = null;

function toUiProduct(item) {
  const images = Array.isArray(item.images) && item.images.length
    ? item.images
    : item.image
      ? [item.image]
      : [];

  return {
    ...item,
    id: item._id || item.id,
    images,
    price: Number(item.price || 0),
    availability: item.inStock === false ? 'Out of Stock' : (item.availability || 'Available'),
    featured: Boolean(item.featured),
    collection: item.collection || 'Collection',
    material: item.material || 'Gold-plated finish',
    care: item.care || 'Store in a soft pouch away from moisture.'
  };
}

export async function getProducts(params = {}) {
  const response = await api.get('/products');
  let result = response.data.map(toUiProduct);

  const search = String(params.search || '').trim().toLowerCase();
  const collection = params.collection;
  const category = params.category;

  if (search) {
    result = result.filter(p =>
      `${p.name} ${p.collection} ${p.category} ${p.description}`.toLowerCase().includes(search)
    );
  }
  if (collection && collection !== 'all') result = result.filter(p => p.collection === collection);
  if (category && category !== 'all') result = result.filter(p => p.category === category);

  return result;
}

export async function getProduct(id) {
  const response = await api.get(`/products/${id}`);
  return toUiProduct(response.data);
}

export async function addProduct(product) {
  const response = await api.post('/products', product);
  return toUiProduct(response.data);
}

export async function updateProduct(id, product) {
  const response = await api.put(`/products/${id}`, product);
  return toUiProduct(response.data);
}

export async function deleteProduct(id) {
  return api.delete(`/products/${id}`);
}
