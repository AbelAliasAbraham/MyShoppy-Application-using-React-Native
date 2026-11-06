/**
 * @file ProductDetailsScreen.tsx[cite: 3]
 * @description Product detail showroom with trust badges, stock status indicators, and prominent add-to-cart controls.[cite: 3]
 */
import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useCart } from '../context/CartContext';
import { Ionicons } from '@expo/vector-icons';

export default function ProductDetailsScreen({ route }: any) {
  const { product } = route.params;
  const { cart, addToCart, updateQuantity } = useCart();

  const cartItem = cart.find((item) => item.id === product.id || item.name === product.name);
  const currentQuantity = cartItem ? cartItem.quantity : 0;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: product.image }} style={styles.image} resizeMode="contain" />
        </View>

        <View style={styles.detailsContainer}>
          <View style={styles.categoryRow}>
            <View style={styles.categoryPill}>
              <Text style={styles.category}>{product.category.toUpperCase()}</Text>
            </View>
            <View style={styles.ratingBadge}>
              <Text style={styles.ratingText}>★ {product.rating}</Text>
            </View>
          </View>

          <Text style={styles.title}>{product.name}</Text>
          <Text style={styles.price}>₹{product.price.toFixed(2)}</Text>
          
          <View style={styles.stockStatus}>
            <View style={[styles.stockDot, { backgroundColor: product.stock > 0 ? '#16a34a' : '#ef4444' }]} />
            <Text style={[styles.stockText, product.stock > 0 ? styles.inStock : styles.outOfStock]}>
              {product.stock > 0 ? `In Stock (${product.stock} units available)` : 'Currently Out of Stock'}
            </Text>
          </View>

          <View style={styles.trustBadgeRow}>
            <View style={styles.trustBadge}>
              <Ionicons name="shield-checkmark-outline" size={18} color="#1a434e" style={{ marginRight: 6 }} />
              <Text style={styles.trustText}>Verified Quality</Text>
            </View>
            <View style={styles.trustBadge}>
              <Ionicons name="car-outline" size={18} color="#1a434e" style={{ marginRight: 6 }} />
              <Text style={styles.trustText}>Free Shipping</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>Product Details</Text>
          <Text style={styles.description}>
            {product.description || "No description provided for this item."}
            {" "}Crafted with precision and designed for everyday household excellence.
          </Text>

          <View style={styles.actionContainer}>
            {product.stock === 0 ? (
              <TouchableOpacity style={[styles.button, styles.buttonDisabled]} disabled={true}>
                <Text style={styles.buttonText}>Currently Unavailable</Text>
              </TouchableOpacity>
            ) : currentQuantity === 0 ? (
              <TouchableOpacity style={styles.button} onPress={() => addToCart(product)} activeOpacity={0.88}>
                <Ionicons name="bag-add-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
                <Text style={styles.buttonText}>Add to Shopping Bag</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.quantityRow}>
                <Text style={styles.inCartLabel}>In Your Bag</Text>
                <View style={styles.quantityControls}>
                  <TouchableOpacity style={styles.qtyBtn} onPress={() => updateQuantity(product.id, -1)}>
                    <Text style={styles.qtyBtnText}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.qtyText}>{currentQuantity}</Text>
                  <TouchableOpacity style={styles.qtyBtn} onPress={() => updateQuantity(product.id, 1)}>
                    <Text style={styles.qtyBtnText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  // Root screen container: expands to fill 100% of the screen height and width with a solid white background
  container: { flex: 1, backgroundColor: '#fff' },

  // ScrollView inner content: adds 130px bottom padding so the action button/bottom contents aren't hidden by navigation bars
  scrollContent: { paddingBottom: 130 },

  // Product image showcase box: 100% width, fixed 340px height, light gray background, 24px inner padding, centers image horizontally and vertically, 1px bottom border separator
  imageContainer: { width: '100%', height: 340, backgroundColor: '#f8fafc', padding: 24, justifyContent: 'center', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },

  // Main product image: scales to 88% of the showcase frame's width and height so it doesn't touch the borders
  image: { width: '88%', height: '88%' },

  // Main details container below the image: adds 20px horizontal breathing room and 22px top padding
  detailsContainer: { paddingHorizontal: 20, paddingTop: 22 },

  // Category and rating header row: horizontal row layout, spaces category pill left and rating badge right, vertically centered, 12px bottom margin
  categoryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },

  // Category pill tag: light gray background, 12px horizontal and 6px vertical padding, 16px rounded pill corners
  categoryPill: { backgroundColor: '#f1f5f9', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },

  // Category label text: slate-gray color, extra-bold weight (800), small 12px font size, wide 1.2px letter spacing for an uppercase look
  category: { color: '#475569', fontWeight: '800', fontSize: 12, letterSpacing: 1.2 },

  // Rating star badge: soft brownish-yellow background, 10px horizontal and 5px vertical padding, 10px rounded corners
  ratingBadge: { backgroundColor: '#fef08a', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10 },

  // Rating badge text: extra-bold weight (800), small 12px size, dark brownish-yellow contrast text color
  ratingText: { fontWeight: '800', fontSize: 12, color: '#713f12' },

  // Product title text: large 24px size, extra-bold weight (800), dark slate color, 8px bottom spacing, 30px line height for clean multi-line wrapping
  title: { fontSize: 24, fontWeight: '800', color: '#0f172a', marginBottom: 8, lineHeight: 30 },

  // Product price text: extra-large 26px font size, heavy bold weight (900), deep teal brand color, 12px bottom margin
  price: { fontSize: 26, fontWeight: '900', color: '#1a434e', marginBottom: 12 },

  // Stock status indicator row: horizontal row layout, vertically centered items, 16px bottom margin
  stockStatus: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },

  // Stock status colored dot: fixed 8x8px circle (4px border radius), 8px right margin
  stockDot: { width: 8, height: 8, borderRadius: 4, marginRight: 8 },

  // Stock status label text: 14px size, semi-bold weight (600)
  stockText: { fontSize: 14, fontWeight: '600' },

  // In-stock modifier color: bright green color text
  inStock: { color: '#16a34a' },

  // Out-of-stock modifier color: bright red color text
  outOfStock: { color: '#ef4444' },

  // Trust badge row ("Verified Quality" / "Free Shipping"): horizontal row layout, spaced between horizontally, 6px bottom margin
  trustBadgeRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },

  // Individual trust badge card: horizontal row layout, centered items, off-white background, 1px subtle gray border, 14px rounded corners, 10px vertical and 14px horizontal padding, takes up 48% width
  trustBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 14, paddingVertical: 10, paddingHorizontal: 14, flex: 0.48, justifyContent: 'center' },

  // Trust badge label text: 12px font size, bold weight (700), dark slate text color
  trustText: { fontSize: 12, fontWeight: '700', color: '#1e293b' },

  // Horizontal divider line: 1px height, light gray background, 18px top/bottom vertical margins
  divider: { height: 1, backgroundColor: '#f1f5f9', marginVertical: 18 },

  // "Product Details" section heading: 18px size, extra-bold weight (800), 10px bottom margin, dark slate text color
  sectionTitle: { fontSize: 18, fontWeight: '800', marginBottom: 10, color: '#0f172a' },

  // Product description paragraph: 15px size, slate-gray color, 24px line height for comfortable reading
  description: { fontSize: 15, color: '#475569', lineHeight: 24 },

  // Bottom action bar container: 28px top margin, 10px bottom margin
  actionContainer: { marginTop: 28, marginBottom: 10 },

  // Primary "Add to Shopping Bag" button: horizontal row, solid teal background, 18px vertical padding, 30px pill border radius, centered items, elevation 4 shadow
  button: { flexDirection: 'row', backgroundColor: '#1a434e', paddingVertical: 18, borderRadius: 30, alignItems: 'center', justifyContent: 'center', elevation: 4 },

  // Disabled button modifier (when item is out of stock): muted light gray background, removes shadow elevation
  buttonDisabled: { backgroundColor: '#cbd5e1', elevation: 0 },

  // Button label text: white color, 16px font size, extra-bold weight (800), slight letter spacing (0.3)
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '800', letterSpacing: 0.3 },

  // Quantity stepper row (when item is already in cart): horizontal row layout, spaced between, vertically centered, off-white background, 12px vertical and 20px horizontal padding, 30px pill radius, 1px gray border
  quantityRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8fafc', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 30, borderWidth: 1, borderColor: '#e2e8f0' },

  // "In Your Bag" label text: 16px size, extra-bold weight (800), dark slate color
  inCartLabel: { fontSize: 16, fontWeight: '800', color: '#0f172a' },

  // Quantity stepper controls wrapper: horizontal row layout, vertically centered items
  quantityControls: { flexDirection: 'row', alignItems: 'center' },

  // Quantity minus/plus circular buttons: fixed 36x36px circle (18px border radius), solid teal background, centered plus/minus text
  qtyBtn: { width: 36, height: 36, backgroundColor: '#1a434e', borderRadius: 18, justifyContent: 'center', alignItems: 'center' },

  // Plus/minus math symbol text inside stepper buttons: white text color, 18px size, bold weight
  qtyBtnText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },

  // Current item quantity number text: 16px left/right margins, 17px font size, extra-bold weight (800), dark slate color
  qtyText: { marginHorizontal: 16, fontSize: 17, fontWeight: '800', color: '#0f172a' }
});