import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useStore } from '@/context/StoreContext';

export const ProductDetailModal: React.FC = () => {
  const {
    selectedProduct,
    setSelectedProduct,
    addToCart,
    isWishlisted,
    toggleWishlist,
    setIsCheckoutOpen,
  } = useStore();

  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    if (selectedProduct) {
      setSelectedColor(selectedProduct.colors[0]?.name || '');
      setSelectedSize(selectedProduct.sizes[0] || '');
      setQuantity(1);
      setActiveImageIndex(0);
    }
  }, [selectedProduct]);

  if (!selectedProduct) return null;

  const wishlisted = isWishlisted(selectedProduct.id);

  const handleAddToCart = () => {
    addToCart(selectedProduct, selectedSize, selectedColor, quantity);
    setSelectedProduct(null);
  };

  const handleBuyNow = () => {
    addToCart(selectedProduct, selectedSize, selectedColor, quantity);
    setSelectedProduct(null);
    setIsCheckoutOpen(true);
  };

  return (
    <Modal
      visible={!!selectedProduct}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={() => setSelectedProduct(null)}
    >
      <SafeAreaView style={styles.modalContainer}>
        {/* Modal Top Bar */}
        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.circleButton}
            onPress={() => setSelectedProduct(null)}
            activeOpacity={0.7}
          >
            <Ionicons name="close" size={22} color="#0F172A" />
          </TouchableOpacity>

          <Text style={styles.topBarTitle} numberOfLines={1}>
            {selectedProduct.brand}
          </Text>

          <TouchableOpacity
            style={styles.circleButton}
            onPress={() => toggleWishlist(selectedProduct.id)}
            activeOpacity={0.7}
          >
            <Ionicons
              name={wishlisted ? 'heart' : 'heart-outline'}
              size={22}
              color={wishlisted ? '#EF4444' : '#0F172A'}
            />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scrollArea}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Main Image Gallery */}
          <View style={styles.imageGallery}>
            <Image
              source={{
                uri: selectedProduct.images[activeImageIndex] || selectedProduct.images[0],
              }}
              style={styles.mainImage}
              resizeMode="cover"
            />
            {selectedProduct.images.length > 1 && (
              <View style={styles.thumbnailsRow}>
                {selectedProduct.images.map((img, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => setActiveImageIndex(index)}
                    style={[
                      styles.thumbItem,
                      activeImageIndex === index && styles.thumbItemActive,
                    ]}
                  >
                    <Image source={{ uri: img }} style={styles.thumbImage} />
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Product Header Information */}
          <View style={styles.infoSection}>
            <View style={styles.brandRow}>
              <Text style={styles.brandBadge}>{selectedProduct.brand.toUpperCase()}</Text>
              <View style={styles.stockBadge}>
                <View style={styles.stockDot} />
                <Text style={styles.stockText}>
                  {selectedProduct.stock > 0
                    ? `In Stock (${selectedProduct.stock} left)`
                    : 'Out of Stock'}
                </Text>
              </View>
            </View>

            <Text style={styles.title}>{selectedProduct.title}</Text>

            {/* Rating & Review */}
            <View style={styles.ratingSection}>
              <View style={styles.starsRow}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Ionicons
                    key={star}
                    name={star <= Math.floor(selectedProduct.rating) ? 'star' : 'star-outline'}
                    size={16}
                    color="#F59E0B"
                  />
                ))}
              </View>
              <Text style={styles.ratingNumber}>{selectedProduct.rating.toFixed(1)}</Text>
              <Text style={styles.reviewCount}>({selectedProduct.reviewCount} customer reviews)</Text>
            </View>

            {/* Price Row */}
            <View style={styles.priceRow}>
              <Text style={styles.price}>${selectedProduct.price.toFixed(2)}</Text>
              {selectedProduct.originalPrice && (
                <Text style={styles.originalPrice}>
                  ${selectedProduct.originalPrice.toFixed(2)}
                </Text>
              )}
              {selectedProduct.discountPercent && (
                <View style={styles.saveBadge}>
                  <Text style={styles.saveBadgeText}>SAVE {selectedProduct.discountPercent}%</Text>
                </View>
              )}
            </View>

            {/* Color Selector */}
            <View style={styles.selectorBlock}>
              <View style={styles.selectorHeader}>
                <Text style={styles.selectorLabel}>Color:</Text>
                <Text style={styles.selectorValue}>{selectedColor}</Text>
              </View>
              <View style={styles.colorsRow}>
                {selectedProduct.colors.map((color) => {
                  const isSelected = selectedColor === color.name;
                  return (
                    <TouchableOpacity
                      key={color.name}
                      onPress={() => setSelectedColor(color.name)}
                      style={[
                        styles.colorSwatchRing,
                        isSelected && styles.colorSwatchRingActive,
                      ]}
                      activeOpacity={0.8}
                    >
                      <View style={[styles.colorSwatch, { backgroundColor: color.hex }]} />
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Size Selector */}
            <View style={styles.selectorBlock}>
              <View style={styles.selectorHeader}>
                <Text style={styles.selectorLabel}>Select Size:</Text>
                <Text style={styles.selectorValue}>{selectedSize}</Text>
              </View>
              <View style={styles.sizesRow}>
                {selectedProduct.sizes.map((size) => {
                  const isSelected = selectedSize === size;
                  return (
                    <TouchableOpacity
                      key={size}
                      onPress={() => setSelectedSize(size)}
                      style={[styles.sizePill, isSelected && styles.sizePillActive]}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.sizePillText,
                          isSelected && styles.sizePillTextActive,
                        ]}
                      >
                        {size}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Quantity Selector */}
            <View style={styles.selectorBlock}>
              <Text style={styles.selectorLabel}>Quantity:</Text>
              <View style={styles.quantityRow}>
                <TouchableOpacity
                  style={styles.qtyButton}
                  onPress={() => setQuantity((prev) => Math.max(1, prev - 1))}
                >
                  <Ionicons name="remove" size={18} color="#0F172A" />
                </TouchableOpacity>
                <Text style={styles.qtyText}>{quantity}</Text>
                <TouchableOpacity
                  style={styles.qtyButton}
                  onPress={() =>
                    setQuantity((prev) => Math.min(selectedProduct.stock, prev + 1))
                  }
                >
                  <Ionicons name="add" size={18} color="#0F172A" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Description */}
            <View style={styles.descriptionBlock}>
              <Text style={styles.descriptionLabel}>Product Details</Text>
              <Text style={styles.descriptionText}>{selectedProduct.description}</Text>
            </View>

            {/* Guarantees */}
            <View style={styles.perksRow}>
              <View style={styles.perkItem}>
                <Ionicons name="shield-checkmark-outline" size={20} color="#10B981" />
                <Text style={styles.perkText}>100% Authentic</Text>
              </View>
              <View style={styles.perkItem}>
                <Ionicons name="rocket-outline" size={20} color="#6366F1" />
                <Text style={styles.perkText}>Free Express Shipping</Text>
              </View>
              <View style={styles.perkItem}>
                <Ionicons name="refresh-outline" size={20} color="#F59E0B" />
                <Text style={styles.perkText}>30-Day Returns</Text>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Sticky Action Footer */}
        <View style={styles.footer}>
          <View style={styles.footerPriceBlock}>
            <Text style={styles.footerPriceLabel}>Total</Text>
            <Text style={styles.footerPrice}>
              ${(selectedProduct.price * quantity).toFixed(2)}
            </Text>
          </View>

          <View style={styles.footerButtonsRow}>
            <TouchableOpacity
              style={styles.addToCartButton}
              onPress={handleAddToCart}
              activeOpacity={0.8}
            >
              <Ionicons name="bag-handle-outline" size={18} color="#0F172A" />
              <Text style={styles.addToCartText}>Add to Cart</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.buyNowButton}
              onPress={handleBuyNow}
              activeOpacity={0.8}
            >
              <Text style={styles.buyNowText}>Buy Now</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  topBarTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  circleButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  imageGallery: {
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    paddingBottom: 16,
  },
  mainImage: {
    width: '100%',
    height: 280,
    backgroundColor: '#F1F5F9',
  },
  thumbnailsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },
  thumbItem: {
    width: 50,
    height: 50,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'transparent',
    overflow: 'hidden',
  },
  thumbItemActive: {
    borderColor: '#4F46E5',
  },
  thumbImage: {
    width: '100%',
    height: '100%',
  },
  infoSection: {
    padding: 20,
  },
  brandRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  brandBadge: {
    fontSize: 12,
    fontWeight: '800',
    color: '#4F46E5',
    letterSpacing: 0.8,
  },
  stockBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  stockDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
  stockText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#065F46',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    lineHeight: 28,
    marginBottom: 10,
  },
  ratingSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 14,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 2,
  },
  ratingNumber: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  reviewCount: {
    fontSize: 13,
    color: '#64748B',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  price: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0F172A',
  },
  originalPrice: {
    fontSize: 18,
    color: '#94A3B8',
    textDecorationLine: 'line-through',
  },
  saveBadge: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  saveBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#DC2626',
  },
  selectorBlock: {
    marginBottom: 18,
  },
  selectorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  selectorLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  selectorValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748B',
  },
  colorsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  colorSwatchRing: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorSwatchRingActive: {
    borderColor: '#4F46E5',
  },
  colorSwatch: {
    width: 26,
    height: 26,
    borderRadius: 13,
  },
  sizesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  sizePill: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    minWidth: 50,
    alignItems: 'center',
  },
  sizePillActive: {
    backgroundColor: '#0F172A',
    borderColor: '#0F172A',
  },
  sizePillText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
  },
  sizePillTextActive: {
    color: '#FFFFFF',
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginTop: 8,
  },
  qtyButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    minWidth: 24,
    textAlign: 'center',
  },
  descriptionBlock: {
    marginVertical: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  descriptionLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 22,
  },
  perksRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    padding: 14,
    borderRadius: 16,
    marginTop: 8,
  },
  perkItem: {
    alignItems: 'center',
    gap: 4,
  },
  perkText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#475569',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: Platform.OS === 'ios' ? 24 : 14,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  footerPriceBlock: {
    marginRight: 14,
  },
  footerPriceLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
  footerPrice: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
  },
  footerButtonsRow: {
    flex: 1,
    flexDirection: 'row',
    gap: 10,
  },
  addToCartButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 13,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  addToCartText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  buyNowButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 13,
    borderRadius: 14,
    backgroundColor: '#4F46E5',
  },
  buyNowText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
