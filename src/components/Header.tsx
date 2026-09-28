import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useStore } from '@/context/StoreContext';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  showSearchShortcut?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  title = 'AURA STORE',
  subtitle = 'Discover modern essentials',
  showSearchShortcut = true,
}) => {
  const { cartCount, setActiveTab, wishlist } = useStore();

  return (
    <View style={styles.headerContainer}>
      <View style={styles.brandRow}>
        <View>
          <View style={styles.logoRow}>
            <View style={styles.logoBadge}>
              <Text style={styles.logoBadgeText}>A</Text>
            </View>
            <Text style={styles.brandTitle}>{title}</Text>
          </View>
          <Text style={styles.brandSubtitle}>{subtitle}</Text>
        </View>

        <View style={styles.actionsRow}>
          {showSearchShortcut && (
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => setActiveTab('search')}
              activeOpacity={0.7}
            >
              <Ionicons name="search-outline" size={20} color="#0F172A" />
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => setActiveTab('wishlist')}
            activeOpacity={0.7}
          >
            <Ionicons name="heart-outline" size={20} color="#0F172A" />
            {wishlist.length > 0 && <View style={styles.miniDot} />}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.iconButton, styles.cartButton]}
            onPress={() => setActiveTab('cart')}
            activeOpacity={0.7}
          >
            <Ionicons name="bag-handle-outline" size={20} color="#FFFFFF" />
            {cartCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{cartCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  brandRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoBadge: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#4F46E5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoBadgeText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 16,
  },
  brandTitle: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 0.5,
    color: '#0F172A',
  },
  brandSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
    fontWeight: '500',
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  cartButton: {
    backgroundColor: '#0F172A',
    borderColor: '#0F172A',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#EF4444',
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  miniDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#EF4444',
  },
});
