// Mock data for the storefront

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  stock: number;
  image: string;
  images: string[];
  categoryId: string;
  specs?: Record<string, string>;
  variants?: Array<{ color: string; code: string }>;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
}

export interface Review {
  id: string;
  productId: string;
  rating: number;
  title: string;
  content: string;
  author: string;
  verified: boolean;
  createdAt: Date;
}

export interface FlashSale {
  id: string;
  title: string;
  description?: string;
  discount: number;
  startTime: Date;
  endTime: Date;
  productIds: string[];
}

// Categories data
export const categories: Category[] = [
  {
    id: 'cat-1',
    name: 'Electronics',
    slug: 'electronics',
    description: 'Latest electronic devices and gadgets',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop',
  },
  {
    id: 'cat-2',
    name: 'Fashion',
    slug: 'fashion',
    description: 'Trendy clothing and accessories',
    image: 'https://images.unsplash.com/photo-1445205170230-053b3227e5e0?w=500&h=500&fit=crop',
  },
  {
    id: 'cat-3',
    name: 'Home & Kitchen',
    slug: 'home-kitchen',
    description: 'Everything for your home',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500&h=500&fit=crop',
  },
];

// Products data
export const products: Product[] = [
  {
    id: 'prod-1',
    name: 'Premium Laptop',
    slug: 'premium-laptop',
    description: 'High-performance laptop with latest specs',
    price: 1299.99,
    originalPrice: 1599.99,
    rating: 4.5,
    reviewCount: 127,
    stock: 15,
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&h=500&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&h=500&fit=crop',
      'https://images.unsplash.com/photo-1588872657840-790ff3bde6f5?w=500&h=500&fit=crop',
    ],
    categoryId: 'cat-1',
    specs: {
      processor: 'Intel Core i7',
      ram: '16GB',
      storage: '512GB SSD',
      display: '15.6" FHD',
    },
    variants: [
      { color: 'Silver', code: 'SLV' },
      { color: 'Space Gray', code: 'SPC' },
    ],
  },
  {
    id: 'prod-2',
    name: 'Smart Watch Pro',
    slug: 'smart-watch-pro',
    description: 'Advanced fitness tracking and notifications',
    price: 299.99,
    originalPrice: 349.99,
    rating: 4.2,
    reviewCount: 89,
    stock: 42,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop',
    ],
    categoryId: 'cat-1',
    specs: {
      display: 'AMOLED 1.4"',
      battery: '7 days',
      waterproof: '5ATM',
    },
    variants: [
      { color: 'Black', code: 'BLK' },
      { color: 'Gold', code: 'GLD' },
    ],
  },
  {
    id: 'prod-3',
    name: 'Comfortable T-Shirt',
    slug: 'comfortable-tshirt',
    description: 'Premium cotton t-shirt for everyday wear',
    price: 29.99,
    originalPrice: 39.99,
    rating: 4.7,
    reviewCount: 234,
    stock: 150,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop',
    ],
    categoryId: 'cat-2',
    specs: {
      material: '100% Cotton',
      sizes: 'XS-XXL',
    },
    variants: [
      { color: 'White', code: 'WHT' },
      { color: 'Black', code: 'BLK' },
      { color: 'Navy', code: 'NVY' },
    ],
  },
  {
    id: 'prod-4',
    name: 'Coffee Maker Deluxe',
    slug: 'coffee-maker-deluxe',
    description: 'Premium coffee maker for perfect brew',
    price: 79.99,
    originalPrice: 99.99,
    rating: 4.4,
    reviewCount: 156,
    stock: 28,
    image: 'https://images.unsplash.com/photo-1517668808822-9ebb02ae2a0e?w=500&h=500&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1517668808822-9ebb02ae2a0e?w=500&h=500&fit=crop',
    ],
    categoryId: 'cat-3',
    specs: {
      capacity: '12 cups',
      power: '1000W',
      material: 'Stainless Steel',
    },
    variants: [{ color: 'Black', code: 'BLK' }],
  },
  {
    id: 'prod-5',
    name: 'Wireless Headphones',
    slug: 'wireless-headphones',
    description: 'Noise-cancelling wireless headphones',
    price: 199.99,
    originalPrice: 249.99,
    rating: 4.6,
    reviewCount: 312,
    stock: 55,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop',
    ],
    categoryId: 'cat-1',
    specs: {
      noiseCancel: 'Active ANC',
      battery: '30 hours',
      connectivity: 'Bluetooth 5.0',
    },
    variants: [
      { color: 'Black', code: 'BLK' },
      { color: 'White', code: 'WHT' },
    ],
  },
  {
    id: 'prod-6',
    name: 'Running Shoes',
    slug: 'running-shoes',
    description: 'Lightweight and comfortable running shoes',
    price: 89.99,
    originalPrice: 129.99,
    rating: 4.3,
    reviewCount: 198,
    stock: 85,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop',
    ],
    categoryId: 'cat-2',
    specs: {
      material: 'Mesh upper',
      sole: 'Rubber',
      sizes: '5-14',
    },
    variants: [
      { color: 'Black', code: 'BLK' },
      { color: 'White', code: 'WHT' },
      { color: 'Blue', code: 'BLU' },
    ],
  },
];

// Reviews data
export const reviews: Review[] = [
  {
    id: 'rev-1',
    productId: 'prod-1',
    rating: 5,
    title: 'Excellent laptop',
    content: 'Great performance and build quality. Highly recommended!',
    author: 'John Doe',
    verified: true,
    createdAt: new Date('2024-12-01'),
  },
  {
    id: 'rev-2',
    productId: 'prod-1',
    rating: 4,
    title: 'Good but expensive',
    content: 'Works well but the price point is a bit high',
    author: 'Jane Smith',
    verified: true,
    createdAt: new Date('2024-12-02'),
  },
  {
    id: 'rev-3',
    productId: 'prod-3',
    rating: 5,
    title: 'Perfect fit and quality',
    content: 'Very comfortable and good quality material',
    author: 'Mike Johnson',
    verified: true,
    createdAt: new Date('2024-12-03'),
  },
];

// Flash sales data
export const flashSales: FlashSale[] = [
  {
    id: 'sale-1',
    title: 'Electronics Mega Sale',
    description: 'Up to 30% off on electronics',
    discount: 30,
    startTime: new Date(),
    endTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
    productIds: ['prod-1', 'prod-2', 'prod-5'],
  },
  {
    id: 'sale-2',
    title: 'Fashion Flash Deal',
    description: 'Limited time fashion deals',
    discount: 25,
    startTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
    endTime: new Date(Date.now() + 8 * 60 * 60 * 1000),
    productIds: ['prod-3', 'prod-6'],
  },
];

// Helper functions
export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductsByCategory(categorySlug: string): Product[] {
  return products.filter((p) => {
    const category = categories.find((c) => c.id === p.categoryId);
    return category?.slug === categorySlug;
  });
}

export function getCategory(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function getProductReviews(productId: string): Review[] {
  return reviews.filter((r) => r.productId === productId);
}

export function getFlashSaleProducts(saleId: string): Product[] {
  const sale = flashSales.find((s) => s.id === saleId);
  if (!sale) return [];
  return products.filter((p) => sale.productIds.includes(p.id));
}

export function getActiveFlashSales(): FlashSale[] {
  const now = new Date();
  return flashSales.filter((s) => s.startTime <= now && s.endTime > now);
}

export function getUpcomingFlashSales(): FlashSale[] {
  const now = new Date();
  return flashSales.filter((s) => s.startTime > now);
}
