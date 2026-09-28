import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Platform,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useStore } from '@/context/StoreContext';
import { Order } from '@/types/store';

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cart,
    subtotal,
    discountAmount,
    shipping,
    total,
    placeOrder,
    setActiveTab,
  } = useStore();

  const [selectedAddress, setSelectedAddress] = useState('Home: 742 Evergreen Terrace, Springfield');
  const [selectedPayment, setSelectedPayment] = useState('Apple Pay');
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);

  if (!isCheckoutOpen) return null;

  const handlePlaceOrder = () => {
    const order = placeOrder(selectedAddress, selectedPayment);
    setPlacedOrder(order);
  };

  const handleFinish = () => {
    setPlacedOrder(null);
    setIsCheckoutOpen(false);
    setActiveTab('profile');
  };

  return (
    <Modal
      visible={isCheckoutOpen}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={() => {
        if (!placedOrder) setIsCheckoutOpen(false);
      }}
    >
      <SafeAreaView style={styles.container}>
        {placedOrder ? (
          /* Order Confirmation Screen */
          <View style={styles.successContainer}>
            <View style={styles.successIconCircle}>
              <Ionicons name="checkmark-circle" size={64} color="#10B981" />
            </View>

            <Text style={styles.successTitle}>Order Confirmed! 🎉</Text>
            <Text style={styles.successSubtitle}>
              Thank you for shopping with AURA. Your order has been placed and is being packed.
            </Text>

            <View style={styles.orderSummaryCard}>
              <View style={styles.orderSummaryRow}>
                <Text style={styles.orderSummaryLabel}>Order ID</Text>
                <Text style={styles.orderSummaryValue}>{placedOrder.id}</Text>
              </View>
              <View style={styles.orderSummaryRow}>
                <Text style={styles.orderSummaryLabel}>Payment</Text>
                <Text style={styles.orderSummaryValue}>{placedOrder.paymentMethod}</Text>
              </View>
              <View style={styles.orderSummaryRow}>
                <Text style={styles.orderSummaryLabel}>Total Paid</Text>
                <Text style={styles.orderSummaryValueHighlight}>
                  ${placedOrder.total.toFixed(2)}
                </Text>
              </View>
              <View style={styles.orderSummaryRow}>
                <Text style={styles.orderSummaryLabel}>Estimated Delivery</Text>
                <Text style={styles.orderSummaryValue}>2-3 Business Days</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.successButton} onPress={handleFinish}>
              <Text style={styles.successButtonText}>View in Orders</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.continueButton}
              onPress={() => {
                setPlacedOrder(null);
                setIsCheckoutOpen(false);
                setActiveTab('shop');
              }}
            >
              <Text style={styles.continueButtonText}>Back to Shop</Text>
            </TouchableOpacity>
          </View>
        ) : (
          /* Checkout Details Form */
          <>
            <View style={styles.header}>
              <TouchableOpacity
                style={styles.closeBtn}
                onPress={() => setIsCheckoutOpen(false)}
              >
                <Ionicons name="close" size={22} color="#0F172A" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Checkout</Text>
              <View style={{ width: 36 }} />
            </View>

            <ScrollView
              style={styles.scrollArea}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              {/* Shipping Address Section */}
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Ionicons name="location-outline" size={18} color="#4F46E5" />
                  <Text style={styles.sectionTitle}>Shipping Address</Text>
                </View>

                {[
                  {
                    id: 'home',
                    label: 'Home',
                    addr: '742 Evergreen Terrace, Springfield',
                  },
                  {
                    id: 'office',
                    label: 'Office',
                    addr: 'Suite 402, Highline Tech Park, Seattle',
                  },
                ].map((item) => {
                  const full = `${item.label}: ${item.addr}`;
                  const isSelected = selectedAddress === full;
                  return (
                    <TouchableOpacity
                      key={item.id}
                      style={[styles.optionCard, isSelected && styles.optionCardActive]}
                      onPress={() => setSelectedAddress(full)}
                      activeOpacity={0.7}
                    >
                      <View style={styles.radioCircle}>
                        {isSelected && <View style={styles.radioDot} />}
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.optionTitle}>{item.label}</Text>
                        <Text style={styles.optionSubtitle}>{item.addr}</Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Payment Methods */}
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Ionicons name="card-outline" size={18} color="#4F46E5" />
                  <Text style={styles.sectionTitle}>Payment Method</Text>
                </View>

                {[
                  { id: 'apple', label: 'Apple Pay / Google Pay', icon: 'phone-portrait-outline' },
                  { id: 'card', label: 'Credit / Debit Card (•• 8492)', icon: 'card-outline' },
                  { id: 'cod', label: 'Cash on Delivery', icon: 'cash-outline' },
                ].map((pay) => {
                  const isSelected = selectedPayment === pay.label;
                  return (
                    <TouchableOpacity
                      key={pay.id}
                      style={[styles.optionCard, isSelected && styles.optionCardActive]}
                      onPress={() => setSelectedPayment(pay.label)}
                      activeOpacity={0.7}
                    >
                      <View style={styles.radioCircle}>
                        {isSelected && <View style={styles.radioDot} />}
                      </View>
                      <Ionicons name={pay.icon as any} size={20} color="#0F172A" />
                      <Text style={styles.optionTitle}>{pay.label}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Items in Checkout */}
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Ionicons name="bag-check-outline" size={18} color="#4F46E5" />
                  <Text style={styles.sectionTitle}>Review Items ({cart.length})</Text>
                </View>

                {cart.map((item) => (
                  <View key={item.id} style={styles.itemRow}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.itemName} numberOfLines={1}>
                        {item.title}
                      </Text>
                      <Text style={styles.itemMeta}>
                        {item.selectedColor} • {item.selectedSize} • Qty: {item.quantity}
                      </Text>
                    </View>
                    <Text style={styles.itemPrice}>
                      ${(item.price * item.quantity).toFixed(2)}
                    </Text>
                  </View>
                ))}
              </View>

              {/* Cost Breakdown */}
              <View style={styles.breakdownCard}>
                <View style={styles.breakdownRow}>
                  <Text style={styles.breakdownLabel}>Subtotal</Text>
                  <Text style={styles.breakdownValue}>${subtotal.toFixed(2)}</Text>
                </View>
                {discountAmount > 0 && (
                  <View style={styles.breakdownRow}>
                    <Text style={styles.discountLabel}>Promo Discount</Text>
                    <Text style={styles.discountValue}>-${discountAmount.toFixed(2)}</Text>
                  </View>
                )}
                <View style={styles.breakdownRow}>
                  <Text style={styles.breakdownLabel}>Shipping</Text>
                  <Text style={styles.breakdownValue}>
                    {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                  </Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.breakdownRow}>
                  <Text style={styles.totalLabel}>Total Amount</Text>
                  <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
                </View>
              </View>
            </ScrollView>

            {/* Sticky Place Order Footer */}
            <View style={styles.footer}>
              <TouchableOpacity
                style={styles.placeOrderBtn}
                onPress={handlePlaceOrder}
                activeOpacity={0.8}
              >
                <Text style={styles.placeOrderText}>
                  Pay ${total.toFixed(2)} & Complete Order
                </Text>
                <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </>
        )}
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
    marginBottom: 10,
  },
  optionCardActive: {
    borderColor: '#4F46E5',
    backgroundColor: '#EEF2FF',
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#94A3B8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#4F46E5',
  },
  optionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  optionSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  itemName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0F172A',
  },
  itemMeta: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  breakdownCard: {
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginTop: 10,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  breakdownLabel: {
    fontSize: 14,
    color: '#64748B',
  },
  breakdownValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
  },
  discountLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10B981',
  },
  discountValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#10B981',
  },
  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 10,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#4F46E5',
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 24 : 14,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  placeOrderBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#4F46E5',
    paddingVertical: 14,
    borderRadius: 14,
  },
  placeOrderText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  /* Confirmation View Styles */
  successContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  successIconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#ECFDF5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 8,
    textAlign: 'center',
  },
  successSubtitle: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 28,
  },
  orderSummaryCard: {
    width: '100%',
    backgroundColor: '#F8FAFC',
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 28,
  },
  orderSummaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  orderSummaryLabel: {
    fontSize: 13,
    color: '#64748B',
  },
  orderSummaryValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  orderSummaryValueHighlight: {
    fontSize: 15,
    fontWeight: '800',
    color: '#10B981',
  },
  successButton: {
    width: '100%',
    backgroundColor: '#0F172A',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 12,
  },
  successButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  continueButton: {
    width: '100%',
    paddingVertical: 12,
    alignItems: 'center',
  },
  continueButtonText: {
    color: '#4F46E5',
    fontSize: 14,
    fontWeight: '700',
  },
});
