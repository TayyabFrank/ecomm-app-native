import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Platform,
  StatusBar,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useStore } from '@/context/StoreContext';
import { Header } from '@/components/Header';
import { ProductCard } from '@/components/ProductCard';
import { TabBar } from '@/components/TabBar';
import { ProductDetailModal } from '@/components/ProductDetailModal';
import { CheckoutModal } from '@/components/CheckoutModal';
import { PRODUCTS, CATEGORIES } from '@/data/products';
import { Product } from '@/types/store';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const {
    activeTab,
    setActiveTab,
    cart,
    cartCount,
    subtotal,
    discountAmount,
    shipping,
    total,
    removeFromCart,
    updateQuantity,
    applyPromo,
    promoCode,
    wishlist,
    orders,
    setIsCheckoutOpen,
    setSelectedProduct,
    toastMessage,
    addToCart,
    clearCart,
  } = useStore();

  // Shop Tab States
  const [selectedCategory, setSelectedCategory] = useState<'All' | 'Sneakers' | 'Audio' | 'Watches' | 'Apparel' | 'Accessories'>('All');

  // Search Tab States
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'low-to-high' | 'high-to-low' | 'rating'>('featured');
  const [promoInput, setPromoInput] = useState('');

  // Filtered Products for Shop Tab
  const shopProducts = useMemo(() => {
    if (selectedCategory === 'All') return PRODUCTS;
    return PRODUCTS.filter((p) => p.category === selectedCategory);
  }, [selectedCategory]);

  const flashDeals = useMemo(() => {
    return PRODUCTS.filter((p) => p.isFlashDeal);
  }, []);

  // Filtered & Sorted Products for Search Tab
  const searchResults = useMemo(() => {
    let list = PRODUCTS.filter((p) => {
      const q = searchQuery.toLowerCase().trim();
      if (!q) return true;
      return (
        p.title.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    });

    if (sortBy === 'low-to-high') {
      list = [...list].sort((a, b) => a.price - b.price);
    } else if (sortBy === 'high-to-low') {
      list = [...list].sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      list = [...list].sort((a, b) => b.rating - a.rating);
    }

    return list;
  }, [searchQuery, sortBy]);

  // Wishlisted Products
  const wishlistedProducts = useMemo(() => {
    return PRODUCTS.filter((p) => wishlist.includes(p.id));
  }, [wishlist]);

  /* -------------------------------------------------------------
     TAB 1: SHOP TAB
  ------------------------------------------------------------- */
  const renderShopTab = () => (
    <ScrollView
      style={styles.scrollArea}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* Promotional Hero Banner */}
      <View style={styles.heroBanner}>
        <Image
          source={{
            uri: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&auto=format&fit=crop&q=80',
          }}
          style={styles.heroImage}
          resizeMode="cover"
        />
        <View style={styles.heroOverlay}>
          <View style={styles.heroTag}>
            <Text style={styles.heroTagText}>SUMMER DROP 2026</Text>
          </View>
          <Text style={styles.heroHeadline}>Elevate Your Everyday Style</Text>
          <Text style={styles.heroSubheadline}>
            Up to 40% off curated sneakers, audio, and premium timepieces.
          </Text>
          <TouchableOpacity
            style={styles.heroCta}
            onPress={() => setSelectedProduct(PRODUCTS[0])}
            activeOpacity={0.8}
          >
            <Text style={styles.heroCtaText}>Shop Featured</Text>
            <Ionicons name="arrow-forward" size={16} color="#0F172A" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Category Pills */}
      <View style={styles.sectionTitleRow}>
        <Text style={styles.sectionTitle}>Categories</Text>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesContent}
        style={styles.categoriesBar}
      >
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <TouchableOpacity
              key={cat}
              style={[styles.categoryPill, isActive && styles.categoryPillActive]}
              onPress={() => setSelectedCategory(cat)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.categoryPillText,
                  isActive && styles.categoryPillTextActive,
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Flash Deals Horizontal Carousel */}
      {selectedCategory === 'All' && (
        <View style={styles.flashSection}>
          <View style={styles.flashHeader}>
            <View style={styles.flashTitleRow}>
              <Text style={styles.flashTitle}>⚡ Flash Deals</Text>
              <View style={styles.countdownBadge}>
                <Text style={styles.countdownText}>Ends in 04h : 28m</Text>
              </View>
            </View>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.flashList}
          >
            {flashDeals.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.flashCard}
                onPress={() => setSelectedProduct(item)}
                activeOpacity={0.8}
              >
                <Image
                  source={{ uri: item.images[0] }}
                  style={styles.flashCardImage}
                />
                <View style={styles.flashSaveTag}>
                  <Text style={styles.flashSaveText}>-{item.discountPercent}%</Text>
                </View>
                <View style={styles.flashCardBody}>
                  <Text style={styles.flashCardBrand}>{item.brand}</Text>
                  <Text style={styles.flashCardTitle} numberOfLines={1}>
                    {item.title}
                  </Text>
                  <View style={styles.flashPriceRow}>
                    <Text style={styles.flashPrice}>${item.price.toFixed(2)}</Text>
                    {item.originalPrice && (
                      <Text style={styles.flashOriginalPrice}>
                        ${item.originalPrice.toFixed(2)}
                      </Text>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Product Grid Header */}
      <View style={styles.sectionTitleRow}>
        <Text style={styles.sectionTitle}>
          {selectedCategory === 'All' ? 'Trending Products' : `${selectedCategory} Collection`}
        </Text>
        <Text style={styles.resultsCount}>{shopProducts.length} items</Text>
      </View>

      {/* 2-Column Product Grid */}
      <View style={styles.grid}>
        {shopProducts.map((product) => (
          <View key={product.id} style={styles.gridColumn}>
            <ProductCard product={product} />
          </View>
        ))}
      </View>
    </ScrollView>
  );

  /* -------------------------------------------------------------
     TAB 2: SEARCH & EXPLORE TAB
  ------------------------------------------------------------- */
  const renderSearchTab = () => (
    <View style={styles.searchTabContainer}>
      {/* Search Bar Input */}
      <View style={styles.searchBarWrapper}>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={20} color="#64748B" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search sneakers, headphones, watches..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color="#94A3B8" />
            </TouchableOpacity>
          )}
        </View>

        {/* Sort Filter Chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.sortChipsContainer}
          style={styles.sortChipsBar}
        >
          {[
            { key: 'featured', label: 'Recommended' },
            { key: 'low-to-high', label: 'Price: Low → High' },
            { key: 'high-to-low', label: 'Price: High → Low' },
            { key: 'rating', label: 'Top Rated' },
          ].map((item) => (
            <TouchableOpacity
              key={item.key}
              style={[
                styles.sortChip,
                sortBy === item.key && styles.sortChipActive,
              ]}
              onPress={() => setSortBy(item.key as any)}
            >
              <Text
                style={[
                  styles.sortChipText,
                  sortBy === item.key && styles.sortChipTextActive,
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Results or Empty State */}
      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.resultsInfoRow}>
          <Text style={styles.resultsInfoText}>
            Found {searchResults.length} {searchResults.length === 1 ? 'product' : 'products'}
            {searchQuery ? ` for "${searchQuery}"` : ''}
          </Text>
        </View>

        {searchResults.length === 0 ? (
          <View style={styles.emptySearch}>
            <Ionicons name="search-outline" size={56} color="#CBD5E1" />
            <Text style={styles.emptySearchTitle}>No items match your search</Text>
            <Text style={styles.emptySearchSubtitle}>
              Try searching for Nike, Sony, Hoodie, Leather, or Sunglasses.
            </Text>
            <TouchableOpacity
              style={styles.clearSearchBtn}
              onPress={() => setSearchQuery('')}
            >
              <Text style={styles.clearSearchBtnText}>Reset Search</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.grid}>
            {searchResults.map((product) => (
              <View key={product.id} style={styles.gridColumn}>
                <ProductCard product={product} />
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );

  /* -------------------------------------------------------------
     TAB 3: CART TAB
  ------------------------------------------------------------- */
  const renderCartTab = () => (
    <View style={styles.cartTabContainer}>
      <View style={styles.cartHeader}>
        <Text style={styles.cartHeaderTitle}>Shopping Bag</Text>
        {cart.length > 0 && (
          <TouchableOpacity onPress={clearCart}>
            <Text style={styles.clearCartText}>Clear All</Text>
          </TouchableOpacity>
        )}
      </View>

      {cart.length === 0 ? (
        <View style={styles.emptyCartContainer}>
          <View style={styles.emptyCartIcon}>
            <Ionicons name="bag-handle-outline" size={64} color="#94A3B8" />
          </View>
          <Text style={styles.emptyCartTitle}>Your bag is currently empty</Text>
          <Text style={styles.emptyCartSubtitle}>
            Looks like you haven&apos;t added any items to your bag yet. Explore our curated catalog!
          </Text>
          <TouchableOpacity
            style={styles.startShoppingBtn}
            onPress={() => setActiveTab('shop')}
          >
            <Text style={styles.startShoppingBtnText}>Start Shopping</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          style={styles.scrollArea}
          contentContainerStyle={styles.cartScrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Cart Item Cards */}
          <View style={styles.cartItemList}>
            {cart.map((item) => (
              <View key={item.id} style={styles.cartItemCard}>
                <Image source={{ uri: item.image }} style={styles.cartItemImage} />

                <View style={styles.cartItemDetails}>
                  <View style={styles.cartItemTop}>
                    <Text style={styles.cartItemBrand}>{item.brand}</Text>
                    <TouchableOpacity onPress={() => removeFromCart(item.id)}>
                      <Ionicons name="trash-outline" size={18} color="#EF4444" />
                    </TouchableOpacity>
                  </View>

                  <Text style={styles.cartItemTitle} numberOfLines={1}>
                    {item.title}
                  </Text>

                  <Text style={styles.cartItemVariants}>
                    {item.selectedColor} • {item.selectedSize}
                  </Text>

                  <View style={styles.cartItemBottom}>
                    <Text style={styles.cartItemPrice}>
                      ${(item.price * item.quantity).toFixed(2)}
                    </Text>

                    {/* Quantity Controls */}
                    <View style={styles.cartQtyControls}>
                      <TouchableOpacity
                        style={styles.cartQtyBtn}
                        onPress={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <Ionicons name="remove" size={14} color="#0F172A" />
                      </TouchableOpacity>
                      <Text style={styles.cartQtyNumber}>{item.quantity}</Text>
                      <TouchableOpacity
                        style={styles.cartQtyBtn}
                        onPress={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Ionicons name="add" size={14} color="#0F172A" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </View>

          {/* Promo Code Box */}
          <View style={styles.promoCard}>
            <View style={styles.promoInputRow}>
              <Ionicons name="pricetag-outline" size={18} color="#6366F1" />
              <TextInput
                style={styles.promoInput}
                placeholder="Discount code (try SAVE20)"
                placeholderTextColor="#94A3B8"
                value={promoInput}
                onChangeText={setPromoInput}
                autoCapitalize="characters"
              />
              <TouchableOpacity
                style={styles.applyPromoBtn}
                onPress={() => applyPromo(promoInput)}
              >
                <Text style={styles.applyPromoText}>Apply</Text>
              </TouchableOpacity>
            </View>
            {promoCode ? (
              <View style={styles.appliedPromoBadge}>
                <Ionicons name="checkmark-circle" size={14} color="#10B981" />
                <Text style={styles.appliedPromoText}>
                  Coupon `{promoCode}` active (20% OFF)
                </Text>
              </View>
            ) : null}
          </View>

          {/* Order Summary Breakdown */}
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Order Summary</Text>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>${subtotal.toFixed(2)}</Text>
            </View>

            {discountAmount > 0 && (
              <View style={styles.summaryRow}>
                <Text style={styles.discountLabel}>Promo Discount</Text>
                <Text style={styles.discountValue}>-${discountAmount.toFixed(2)}</Text>
              </View>
            )}

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Estimated Shipping</Text>
              <Text style={styles.summaryValue}>
                {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
              </Text>
            </View>

            <View style={styles.summaryDivider} />

            <View style={styles.summaryRow}>
              <Text style={styles.summaryTotalLabel}>Total</Text>
              <Text style={styles.summaryTotalValue}>${total.toFixed(2)}</Text>
            </View>
          </View>

          {/* Checkout Button */}
          <TouchableOpacity
            style={styles.checkoutBtn}
            onPress={() => setIsCheckoutOpen(true)}
            activeOpacity={0.8}
          >
            <Text style={styles.checkoutBtnText}>
              Checkout • ${total.toFixed(2)}
            </Text>
            <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </ScrollView>
      )}
    </View>
  );

  /* -------------------------------------------------------------
     TAB 4: WISHLIST TAB
  ------------------------------------------------------------- */
  const renderWishlistTab = () => (
    <View style={styles.wishlistTabContainer}>
      <View style={styles.cartHeader}>
        <Text style={styles.cartHeaderTitle}>Saved Items</Text>
        <Text style={styles.resultsCount}>{wishlistedProducts.length} saved</Text>
      </View>

      {wishlistedProducts.length === 0 ? (
        <View style={styles.emptyCartContainer}>
          <View style={styles.emptyCartIcon}>
            <Ionicons name="heart-outline" size={64} color="#94A3B8" />
          </View>
          <Text style={styles.emptyCartTitle}>No items saved yet</Text>
          <Text style={styles.emptyCartSubtitle}>
            Tap the heart icon on any product to save it for later review or instant purchase.
          </Text>
          <TouchableOpacity
            style={styles.startShoppingBtn}
            onPress={() => setActiveTab('shop')}
          >
            <Text style={styles.startShoppingBtnText}>Browse Trending Items</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          style={styles.scrollArea}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.grid}>
            {wishlistedProducts.map((product) => (
              <View key={product.id} style={styles.gridColumn}>
                <ProductCard product={product} />
              </View>
            ))}
          </View>
        </ScrollView>
      )}
    </View>
  );

  /* -------------------------------------------------------------
     TAB 5: PROFILE & ORDERS TAB
  ------------------------------------------------------------- */
  const renderProfileTab = () => (
    <ScrollView
      style={styles.scrollArea}
      contentContainerStyle={styles.profileScrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* Profile Card */}
      <View style={styles.profileCard}>
        <Image
          source={{
            uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
          }}
          style={styles.profileAvatar}
        />
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>Tayyab</Text>
          <Text style={styles.profileEmail}>tayyab.dev@aura.shop</Text>
          <View style={styles.vipBadge}>
            <Ionicons name="diamond-outline" size={12} color="#D97706" />
            <Text style={styles.vipBadgeText}>AURA Black VIP</Text>
          </View>
        </View>
      </View>

      {/* Rewards Bar */}
      <View style={styles.rewardsCard}>
        <View>
          <Text style={styles.rewardsLabel}>Aura Reward Points</Text>
          <Text style={styles.rewardsBalance}>1,850 Pts</Text>
          <Text style={styles.rewardsValue}>Value: $18.50 store credit</Text>
        </View>
        <TouchableOpacity
          style={styles.redeemBtn}
          onPress={() => alert('Points will be applied on your next checkout!')}
        >
          <Text style={styles.redeemBtnText}>Redeem</Text>
        </TouchableOpacity>
      </View>

      {/* Orders Section */}
      <View style={styles.ordersSection}>
        <View style={styles.ordersSectionHeader}>
          <Text style={styles.ordersSectionTitle}>My Orders</Text>
          <Text style={styles.ordersCountText}>{orders.length} total</Text>
        </View>

        {orders.map((order) => (
          <View key={order.id} style={styles.orderCard}>
            <View style={styles.orderCardTop}>
              <View>
                <Text style={styles.orderId}>{order.id}</Text>
                <Text style={styles.orderDate}>{order.date}</Text>
              </View>
              <View
                style={[
                  styles.orderStatusBadge,
                  order.status === 'Delivered'
                    ? styles.statusDelivered
                    : styles.statusShipped,
                ]}
              >
                <Text
                  style={[
                    styles.orderStatusText,
                    order.status === 'Delivered'
                      ? styles.statusTextDelivered
                      : styles.statusTextShipped,
                  ]}
                >
                  {order.status}
                </Text>
              </View>
            </View>

            <View style={styles.orderDivider} />

            <View style={styles.orderCardBottom}>
              <Text style={styles.orderItemsCount}>
                {order.items.length} {order.items.length === 1 ? 'item' : 'items'} • Paid via{' '}
                {order.paymentMethod}
              </Text>
              <Text style={styles.orderTotal}>${order.total.toFixed(2)}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Quick Settings List */}
      <View style={styles.settingsSection}>
        <Text style={styles.settingsTitle}>Account & Settings</Text>

        {[
          { icon: 'location-outline', title: 'Shipping Addresses' },
          { icon: 'card-outline', title: 'Payment Methods' },
          { icon: 'notifications-outline', title: 'Notifications' },
          { icon: 'shield-checkmark-outline', title: 'Privacy & Security' },
          { icon: 'help-circle-outline', title: 'Help & Customer Care' },
        ].map((item, idx) => (
          <TouchableOpacity
            key={idx}
            style={styles.settingItem}
            onPress={() => alert(`${item.title} opened`)}
            activeOpacity={0.7}
          >
            <View style={styles.settingItemLeft}>
              <View style={styles.settingIconBox}>
                <Ionicons name={item.icon as any} size={18} color="#4F46E5" />
              </View>
              <Text style={styles.settingItemText}>{item.title}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.safeContainer}>
      {/* Toast Notification Banner */}
      {toastMessage && (
        <View style={styles.toastBanner}>
          <Ionicons name="checkmark-circle" size={18} color="#10B981" />
          <Text style={styles.toastText}>{toastMessage}</Text>
        </View>
      )}

      {/* Top Header */}
      <Header />

      {/* Active Tab Screen Content */}
      <View style={styles.tabContentArea}>
        {activeTab === 'shop' && renderShopTab()}
        {activeTab === 'search' && renderSearchTab()}
        {activeTab === 'cart' && renderCartTab()}
        {activeTab === 'wishlist' && renderWishlistTab()}
        {activeTab === 'profile' && renderProfileTab()}
      </View>

      {/* Bottom Navigation Bar */}
      <TabBar />

      {/* Overlays / Modals */}
      <ProductDetailModal />
      <CheckoutModal />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  toastBanner: {
    position: 'absolute',
    top: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 60 : 60,
    left: 20,
    right: 20,
    zIndex: 999,
    backgroundColor: '#0F172A',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  toastText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
  },
  tabContentArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 24,
  },
  /* Hero Banner */
  heroBanner: {
    height: 180,
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 20,
    backgroundColor: '#0F172A',
  },
  heroImage: {
    width: '100%',
    height: '100%',
    opacity: 0.45,
  },
  heroOverlay: {
    position: 'absolute',
    inset: 0,
    padding: 18,
    justifyContent: 'center',
  },
  heroTag: {
    alignSelf: 'flex-start',
    backgroundColor: '#4F46E5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 6,
  },
  heroTagText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  heroHeadline: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
    lineHeight: 24,
    marginBottom: 4,
  },
  heroSubheadline: {
    color: '#CBD5E1',
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 12,
    maxWidth: '85%',
  },
  heroCta: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  heroCtaText: {
    color: '#0F172A',
    fontSize: 12,
    fontWeight: '700',
  },
  /* Categories Bar */
  sectionTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  resultsCount: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
  categoriesBar: {
    marginBottom: 20,
  },
  categoriesContent: {
    gap: 8,
  },
  categoryPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  categoryPillActive: {
    backgroundColor: '#0F172A',
    borderColor: '#0F172A',
  },
  categoryPillText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  categoryPillTextActive: {
    color: '#FFFFFF',
  },
  /* Flash Deals */
  flashSection: {
    marginBottom: 24,
  },
  flashHeader: {
    marginBottom: 12,
  },
  flashTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  flashTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
  },
  countdownBadge: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  countdownText: {
    color: '#DC2626',
    fontSize: 11,
    fontWeight: '700',
  },
  flashList: {
    gap: 12,
  },
  flashCard: {
    width: 140,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  flashCardImage: {
    width: '100%',
    height: 110,
    backgroundColor: '#F8FAFC',
  },
  flashSaveTag: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#EF4444',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  flashSaveText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  flashCardBody: {
    padding: 8,
  },
  flashCardBrand: {
    fontSize: 9,
    color: '#6366F1',
    fontWeight: '700',
  },
  flashCardTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0F172A',
    marginVertical: 2,
  },
  flashPriceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  flashPrice: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  flashOriginalPrice: {
    fontSize: 10,
    color: '#94A3B8',
    textDecorationLine: 'line-through',
  },
  /* 2-Column Product Grid */
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridColumn: {
    width: (width - 44) / 2,
  },
  /* Search Tab */
  searchTabContainer: {
    flex: 1,
  },
  searchBarWrapper: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#0F172A',
  },
  sortChipsBar: {
    marginTop: 10,
  },
  sortChipsContainer: {
    gap: 8,
  },
  sortChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  sortChipActive: {
    backgroundColor: '#4F46E5',
    borderColor: '#4F46E5',
  },
  sortChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  sortChipTextActive: {
    color: '#FFFFFF',
  },
  resultsInfoRow: {
    marginBottom: 12,
  },
  resultsInfoText: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
  },
  emptySearch: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    gap: 8,
  },
  emptySearchTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
  },
  emptySearchSubtitle: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    maxWidth: '80%',
    lineHeight: 18,
  },
  clearSearchBtn: {
    marginTop: 12,
    backgroundColor: '#0F172A',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  clearSearchBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  /* Cart Tab */
  cartTabContainer: {
    flex: 1,
  },
  cartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  cartHeaderTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  clearCartText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#EF4444',
  },
  cartScrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  cartItemList: {
    gap: 12,
    marginBottom: 20,
  },
  cartItemCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cartItemImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
  },
  cartItemDetails: {
    flex: 1,
    justifyContent: 'space-between',
  },
  cartItemTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cartItemBrand: {
    fontSize: 10,
    fontWeight: '700',
    color: '#6366F1',
  },
  cartItemTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0F172A',
  },
  cartItemVariants: {
    fontSize: 11,
    color: '#64748B',
  },
  cartItemBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  cartItemPrice: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  cartQtyControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cartQtyBtn: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartQtyNumber: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
    minWidth: 16,
    textAlign: 'center',
  },
  promoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
  },
  promoInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  promoInput: {
    flex: 1,
    fontSize: 13,
    color: '#0F172A',
  },
  applyPromoBtn: {
    backgroundColor: '#4F46E5',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  applyPromoText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  appliedPromoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  appliedPromoText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#10B981',
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 20,
  },
  summaryTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 13,
    color: '#64748B',
  },
  summaryValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0F172A',
  },
  discountLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#10B981',
  },
  discountValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#10B981',
  },
  summaryDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 8,
  },
  summaryTotalLabel: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  summaryTotalValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#4F46E5',
  },
  checkoutBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#4F46E5',
    paddingVertical: 14,
    borderRadius: 16,
  },
  checkoutBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  emptyCartContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyCartIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyCartTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 6,
  },
  emptyCartSubtitle: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    maxWidth: '85%',
    lineHeight: 18,
    marginBottom: 20,
  },
  startShoppingBtn: {
    backgroundColor: '#0F172A',
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 14,
  },
  startShoppingBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  /* Wishlist Tab */
  wishlistTabContainer: {
    flex: 1,
  },
  /* Profile Tab */
  profileScrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 14,
  },
  profileAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F1F5F9',
  },
  profileInfo: {
    flex: 1,
    gap: 3,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  profileEmail: {
    fontSize: 12,
    color: '#64748B',
  },
  vipBadge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 4,
  },
  vipBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#B45309',
  },
  rewardsCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    borderRadius: 18,
    padding: 18,
    marginBottom: 20,
  },
  rewardsLabel: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '600',
  },
  rewardsBalance: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    marginVertical: 2,
  },
  rewardsValue: {
    fontSize: 11,
    color: '#34D399',
    fontWeight: '600',
  },
  redeemBtn: {
    backgroundColor: '#38BDF8',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  redeemBtnText: {
    color: '#0F172A',
    fontSize: 12,
    fontWeight: '800',
  },
  ordersSection: {
    marginBottom: 20,
  },
  ordersSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  ordersSectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
  },
  ordersCountText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
  orderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 10,
  },
  orderCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderId: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  orderDate: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  orderStatusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  orderStatusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  statusShipped: {
    backgroundColor: '#EEF2FF',
  },
  statusTextShipped: {
    color: '#4F46E5',
  },
  statusDelivered: {
    backgroundColor: '#ECFDF5',
  },
  statusTextDelivered: {
    color: '#065F46',
  },
  orderDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 10,
  },
  orderCardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderItemsCount: {
    fontSize: 12,
    color: '#64748B',
  },
  orderTotal: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  settingsSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  settingsTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingItemText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1E293B',
  },
});
