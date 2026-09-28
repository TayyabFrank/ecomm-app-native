import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Product, CartItem, Order, TabType } from '@/types/store';

interface StoreContextType {
  cart: CartItem[];
  wishlist: string[];
  orders: Order[];
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  promoCode: string;
  discountPercent: number;
  toastMessage: string | null;
  addToCart: (product: Product, size: string, color: string, quantity?: number) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, newQty: number) => void;
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
  applyPromo: (code: string) => { success: boolean; message: string };
  clearCart: () => void;
  placeOrder: (address: string, paymentMethod: string) => Order;
  cartCount: number;
  subtotal: number;
  discountAmount: number;
  shipping: number;
  total: number;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([
    {
      id: 'prod-1-Crimson Red-US 9',
      productId: 'prod-1',
      title: 'Nike Air Max Pulse Roam',
      brand: 'Nike',
      price: 159.99,
      originalPrice: 199.99,
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80',
      selectedColor: 'Crimson Red',
      selectedSize: 'US 9',
      quantity: 1,
    },
  ]);
  const [wishlist, setWishlist] = useState<string[]>(['prod-2', 'prod-3']);
  const [orders, setOrders] = useState<Order[]>([
    {
      id: 'ORD-7821',
      date: 'Yesterday',
      items: [
        {
          id: 'prev-1',
          productId: 'prod-4',
          title: 'Heavyweight Minimalist Hoodie',
          brand: 'Aura Studio',
          price: 89.0,
          image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80',
          selectedColor: 'Washed Charcoal',
          selectedSize: 'L',
          quantity: 1,
        },
      ],
      total: 89.0,
      status: 'Shipped',
      paymentMethod: 'Apple Pay',
      address: '742 Evergreen Terrace, Springfield',
    },
  ]);
  const [activeTab, setActiveTab] = useState<TabType>('shop');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const addToCart = (
    product: Product,
    size: string,
    color: string,
    quantity: number = 1
  ) => {
    const cartItemId = `${product.id}-${color}-${size}`;
    setCart((prev) => {
      const existing = prev.find((item) => item.id === cartItemId);
      if (existing) {
        return prev.map((item) =>
          item.id === cartItemId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [
        ...prev,
        {
          id: cartItemId,
          productId: product.id,
          title: product.title,
          brand: product.brand,
          price: product.price,
          originalPrice: product.originalPrice,
          image: product.images[0],
          selectedColor: color,
          selectedSize: size,
          quantity,
        },
      ];
    });
    showToast(`Added ${product.title} to cart`);
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));
    showToast('Item removed from cart');
  };

  const updateQuantity = (cartItemId: string, newQty: number) => {
    if (newQty <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.id === cartItemId ? { ...item, quantity: newQty } : item
      )
    );
  };

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('Removed from wishlist');
        return prev.filter((id) => id !== productId);
      } else {
        showToast('Saved to wishlist ❤️');
        return [...prev, productId];
      }
    });
  };

  const isWishlisted = (productId: string) => wishlist.includes(productId);

  const applyPromo = (code: string) => {
    const clean = code.trim().toUpperCase();
    if (clean === 'SAVE20') {
      setPromoCode('SAVE20');
      setDiscountPercent(20);
      showToast('Promo code applied: 20% OFF!');
      return { success: true, message: '20% discount applied!' };
    }
    if (clean === 'AURA10') {
      setPromoCode('AURA10');
      setDiscountPercent(10);
      showToast('Promo code applied: 10% OFF!');
      return { success: true, message: '10% discount applied!' };
    }
    return { success: false, message: 'Invalid promo code (Try SAVE20)' };
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = (subtotal * discountPercent) / 100;
  const shipping = subtotal > 150 || cart.length === 0 ? 0 : 15;
  const total = Math.max(0, subtotal - discountAmount + shipping);

  const placeOrder = (address: string, paymentMethod: string): Order => {
    const newOrder: Order = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      date: 'Just now',
      items: [...cart],
      total,
      status: 'Processing',
      paymentMethod,
      address,
    };
    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    return newOrder;
  };

  return (
    <StoreContext.Provider
      value={{
        cart,
        wishlist,
        orders,
        activeTab,
        setActiveTab,
        selectedProduct,
        setSelectedProduct,
        isCheckoutOpen,
        setIsCheckoutOpen,
        promoCode,
        discountPercent,
        toastMessage,
        addToCart,
        removeFromCart,
        updateQuantity,
        toggleWishlist,
        isWishlisted,
        applyPromo,
        clearCart,
        placeOrder,
        cartCount,
        subtotal,
        discountAmount,
        shipping,
        total,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}
