export interface Product {
  id: string;
  title: string;
  brand: string;
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  rating: number;
  reviewCount: number;
  category: 'Sneakers' | 'Audio' | 'Watches' | 'Apparel' | 'Accessories';
  images: string[];
  colors: { name: string; hex: string }[];
  sizes: string[];
  description: string;
  isFlashDeal?: boolean;
  isFeatured?: boolean;
  stock: number;
}

export interface CartItem {
  id: string; // unique cart item id (e.g. `${product.id}-${selectedColor}-${selectedSize}`)
  productId: string;
  title: string;
  brand: string;
  price: number;
  originalPrice?: number;
  image: string;
  selectedColor: string;
  selectedSize: string;
  quantity: number;
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  total: number;
  status: 'Processing' | 'Shipped' | 'Delivered';
  paymentMethod: string;
  address: string;
}

export type TabType = 'shop' | 'search' | 'cart' | 'wishlist' | 'profile';
