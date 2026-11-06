/**
 * @file HomeScreen.tsx
 * @description Flagship landing screen loading featured products directly from db.json data.
 */
import React, { useState, useCallback, useRef, memo } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput, 
  FlatList, 
  Image, 
  ScrollView 
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useCart, Product } from '../context/CartContext';
import { Ionicons } from '@expo/vector-icons';
import dbData from '../data/db.json'; // Adjust the relative path to your db.json file as needed

const ProductCard = memo(({ item, cart, addToCart, updateQuantity, navigation }: { 
  item: Product; 
  cart: any[]; 
  addToCart: (p: Product) => void; 
  updateQuantity: (id: string, amount: number) => void; 
  navigation: any; 
}) => {
  const cartItem = cart.find((ci) => ci.id === item.id || ci.name === item.name);
  const qty = cartItem ? cartItem.quantity : 0;

  return (
    <TouchableOpacity 
      style={styles.card} 
      activeOpacity={0.9}
      onPress={() => navigation.navigate('ProductDetails', { product: item })}
    >
      <View style={styles.imageBox}>
        <Image source={{ uri: item.image }} style={styles.cardImage} resizeMode="contain" />
        <View style={styles.ratingBadge}>
           <Text style={styles.ratingText}>★ {item.rating}</Text>
        </View>
        <View style={styles.tagBadge}>
          <Text style={styles.tagText}>BESTSELLER</Text>
        </View>
      </View>

      <Text style={styles.cardName} numberOfLines={2}>{item.name}</Text>
      <Text style={styles.cardPrice}>₹{item.price.toFixed(2)}</Text>
      
      {qty === 0 ? (
        <TouchableOpacity style={styles.addButton} onPress={() => addToCart(item)} activeOpacity={0.85}>
          <Text style={styles.addButtonText}>+ Add to Bag</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.quantityControls}>
          <TouchableOpacity style={styles.qtyBtn} onPress={() => updateQuantity(item.id, -1)}>
            <Text style={styles.qtyBtnText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.qtyText}>{qty}</Text>
          <TouchableOpacity style={styles.qtyBtn} onPress={() => updateQuantity(item.id, 1)}>
            <Text style={styles.qtyBtnText}>+</Text>
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );
});

export default function HomeScreen({ navigation }: any) {
  const { cart, addToCart, updateQuantity } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [priceFilter, setPriceFilter] = useState('All'); 

  const flatListRef = useRef<FlatList>(null);

  useFocusEffect(
    useCallback(() => {
      setSearchQuery('');
      setPriceFilter('All');
      if (flatListRef.current) {
        flatListRef.current.scrollToOffset({ offset: 0, animated: false });
      }
    }, [])
  );

  // Load featured products directly from db.json products list
  const featuredProducts: Product[] = (dbData.products || []).slice(0, 12).map((item: any, index: number) => ({
    id: String(item.id || `home-${index}`),
    name: item.name,
    price: item.price,
    category: item.category,
    image: item.image,
    description: item.description,
    rating: item.rating,
    stock: item.stock
  }));

  const displayedProducts = featuredProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    let matchesFilter = true;
    if (priceFilter === 'Under ₹1000') matchesFilter = product.price < 1000;
    else if (priceFilter === 'Over ₹1000') matchesFilter = product.price >= 1000;
    else if (priceFilter === 'In Stock') matchesFilter = product.stock > 0;
    return matchesSearch && matchesFilter;
  });

  const renderProductItem = useCallback(({ item }: { item: Product }) => (
    <ProductCard 
      item={item} 
      cart={cart} 
      addToCart={addToCart} 
      updateQuantity={updateQuantity} 
      navigation={navigation} 
    />
  ), [cart, addToCart, updateQuantity, navigation]);

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={displayedProducts}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        maxToRenderPerBatch={6}
        windowSize={5}
        initialNumToRender={4}
        updateCellsBatchingPeriod={50}
        getItemLayout={(data, index) => ({
          length: 270,
          offset: 270 * Math.floor(index / 2),
          index,
        })}
        ListHeaderComponent={
          <>
            <View style={styles.bannerCard}>
              <View style={styles.imageFrame}>
                <Image 
                  source={{ uri: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&q=80' }} 
                  style={styles.bannerImage}
                  resizeMode="cover"
                />
              </View>
              <View style={styles.bannerTextWrapper}>
                <View style={styles.bannerBadge}>
                  <Text style={styles.bannerBadgeText}>✨ CURATED FOR YOU</Text>
                </View>
                <Text style={styles.header}>Shopping And{'\n'}Department Store.</Text>
                <Text style={styles.subtitle}>
                  Discover curated household essentials crafted for modern living.
                </Text>
                <TouchableOpacity 
                  style={styles.bannerCTA}
                  activeOpacity={0.88}
                  onPress={() => navigation.navigate('CategoriesTab', { screen: 'CategoriesList' })}
                >
                  <Text style={styles.bannerCTAText}>Explore Collection →</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.searchContainer}>
              <View style={styles.searchBox}>
                <Ionicons name="search-outline" size={18} color="#64748b" style={{ marginRight: 8 }} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search household products..."
                  placeholderTextColor="#94a3b8"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
              </View>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll} contentContainerStyle={styles.filterContainer}>
              {['All', 'Under ₹1000', 'Over ₹1000', 'In Stock'].map(filter => (
                <TouchableOpacity 
                  key={filter}
                  style={[styles.filterChip, priceFilter === filter && styles.filterChipActive]}
                  onPress={() => setPriceFilter(filter)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.filterText, priceFilter === filter && styles.filterTextActive]}>
                    {filter}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={styles.sectionHeader}>
              <View>
                <Text style={styles.sectionTitle}>Featured Catalog</Text>
                <Text style={styles.sectionSubtitle}>Handpicked recommendations</Text>
              </View>
              <TouchableOpacity onPress={() => navigation.navigate('CategoriesTab', { screen: 'CategoriesList' })}>
                <Text style={styles.viewAllLink}>View All →</Text>
              </TouchableOpacity>
            </View>
          </>
        }
        ListEmptyComponent={
          <View style={styles.emptyStateContainer}>
            <Ionicons name="search-outline" size={40} color="#94a3b8" style={{ marginBottom: 8 }} />
            <Text style={styles.emptyStateTitle}>No products found</Text>
            <Text style={styles.emptyStateSubtitle}>Try adjusting your search or filter criteria.</Text>
          </View>
        }
        numColumns={2}
        columnWrapperStyle={styles.row}
        renderItem={renderProductItem}
        contentContainerStyle={{ paddingBottom: 130 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  // Root screen container: expands to fill 100% of the screen height and width with a solid white background
  container: { flex: 1, backgroundColor: '#fff', width: '100%' },

  // Featured promotional banner card: 16px left/right margins, 20px bottom spacing, dark forest-green background, 26px rounded corners, clips inner children, elevation 6 and shadow properties for Android/iOS depth
  bannerCard: { 
    marginHorizontal: 16,
    marginBottom: 20, 
    backgroundColor: '#133840', 
    borderRadius: 26, 
    overflow: 'hidden',
    elevation: 6,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 10
  },

  // Banner image container frame: spans 100% of card width, fixed 210px height, darker slate-green backdrop color
  imageFrame: { width: '100%', height: 210, backgroundColor: '#0d252a' },

  // Promotional banner image: stretches to cover 100% of the image frame's width and height
  bannerImage: { width: '100%', height: '100%' },

  // Banner text section below image: 100% width, forest-green background, 22px top/bottom padding, 20px left/right padding, centers text items horizontally
  bannerTextWrapper: { width: '100%', backgroundColor: '#133840', paddingVertical: 22, paddingHorizontal: 20, alignItems: 'center' },

  // "✨ CURATED FOR YOU" badge pill: semi-transparent white backdrop (12% opacity), 14px horizontal and 6px vertical padding, 20px pill border radius, 12px bottom spacing
  bannerBadge: { backgroundColor: 'rgba(255, 255, 255, 0.12)', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, marginBottom: 12 },

  // Text inside curated badge: light gray-white color, small 11px font size, extra-bold weight (800), 1px letter spacing for an uppercase look
  bannerBadgeText: { color: '#e2e8f0', fontSize: 11, fontWeight: '800', letterSpacing: 1 },

  // Main banner header text: 25px size, heavy bold weight (900), crisp white color, 32px line height for two-line spacing, centered text alignment
  header: { fontSize: 25, fontWeight: '900', color: '#ffffff', lineHeight: 32, textAlign: 'center' },

  // Banner subtitle description text: 13px size, medium weight (500), light slate-gray color, 6px top spacing, centered text, 18px line height
  subtitle: { fontSize: 13, fontWeight: '500', color: '#cbd5e1', marginTop: 6, textAlign: 'center', lineHeight: 18 },

  // "Explore Collection →" button: 16px top margin, solid white background, 24px horizontal and 10px vertical padding, 25px rounded pill corners
  bannerCTA: { marginTop: 16, backgroundColor: '#ffffff', paddingHorizontal: 24, paddingVertical: 10, borderRadius: 25 },

  // CTA button label text: forest-green theme color, 14px size, extra-bold weight (800)
  bannerCTAText: { color: '#133840', fontSize: 14, fontWeight: '800' },

  // Search section wrapper: 16px left/right padding, 14px bottom margin below search box
  searchContainer: { paddingHorizontal: 16, marginBottom: 14 },

  // Search input pill box: horizontal row layout, vertically centered items, off-white background, 16px rounded corners, 16px horizontal and 12px vertical padding, 1px subtle gray border
  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f8fafc', borderRadius: 16, paddingHorizontal: 16, paddingVertical: 12, borderWidth: 1, borderColor: '#e2e8f0' },

  // Text input field: flex 1 allows it to expand and fill remaining space inside the box, 15px font size, dark slate text color, resets platform default padding to 0
  searchInput: { flex: 1, fontSize: 15, color: '#0f172a', padding: 0 },

  // Filter chips scroll view wrapper: 16px horizontal padding, 22px bottom margin before catalog section begins
  filterScroll: { paddingHorizontal: 16, marginBottom: 22 },

  // Inner filter scroll container: adds 32px right padding so the last filter chip isn't cut off against the right edge
  filterContainer: { paddingRight: 32 },

  // Unselected filter chip pill: 18px horizontal and 9px vertical padding, 25px rounded pill corners, solid white background, 1px light gray border, 10px right spacing between chips
  filterChip: { paddingHorizontal: 18, paddingVertical: 9, borderRadius: 25, backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#e2e8f0', marginRight: 10 },

  // Active/selected filter chip pill: overrides background and border color to solid theme teal
  filterChipActive: { backgroundColor: '#1a434e', borderColor: '#1a434e' },

  // Unselected filter chip text: muted slate-gray color, semi-bold weight (600), 13px font size
  filterText: { color: '#64748b', fontWeight: '600', fontSize: 13 },

  // Active/selected filter chip text: overrides color to crisp white for contrast against teal
  filterTextActive: { color: '#ffffff' },

  // Catalog section header row: horizontal row, pushes title left and "View All" link right, vertically centered, 16px left/right padding, 16px bottom margin
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, marginBottom: 16 },

  // Catalog section title ("Featured Catalog"): 22px size, extra-bold weight (800), dark slate color
  sectionTitle: { fontSize: 22, fontWeight: '800', color: '#0f172a' },

  // Catalog section subtitle ("Handpicked recommendations"): 13px size, muted slate-gray color, semi-bold weight (600), 2px top margin
  sectionSubtitle: { fontSize: 13, color: '#64748b', fontWeight: '600', marginTop: 2 },

  // "View All →" clickable link text: 14px size, bold weight (700), teal theme color
  viewAllLink: { fontSize: 14, fontWeight: '700', color: '#1a434e' },

  // FlatList column wrapper: evenly spaces out the 2 grid columns horizontally across the row with 16px left/right padding
  row: { justifyContent: 'space-between', paddingHorizontal: 16 },

  // Product card tile: takes up 48% of row width, 12px inner padding, 16px bottom margin, solid white background, 20px rounded corners, centers items, 1px border, shadow properties for depth
  card: { flex: 0.48, padding: 12, marginBottom: 16, backgroundColor: '#ffffff', borderRadius: 20, alignItems: 'center', borderWidth: 1, borderColor: '#f1f5f9', elevation: 3, shadowColor: '#0f172a', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.06, shadowRadius: 8 },

  // Product thumbnail frame: 100% card width, fixed 144px height, relative positioning (for absolute badges inside), 10px bottom margin, off-white background, 14px border radius, centers image
  imageBox: { width: '100%', height: 144, position: 'relative', marginBottom: 10, backgroundColor: '#f8fafc', borderRadius: 14, justifyContent: 'center', alignItems: 'center' },

  // Product thumbnail image: scales to 88% of the frame's width and height so it doesn't touch the borders
  cardImage: { width: '88%', height: '88%' },

  // Rating star badge: absolutely positioned 8px from top and left of the image box, soft yellow background, 7px horizontal and 3px vertical padding, 8px rounded corners
  ratingBadge: { position: 'absolute', top: 8, left: 8, backgroundColor: '#fef08a', paddingHorizontal: 7, paddingVertical: 3, borderRadius: 8 },

  // Rating badge text: small 11px size, extra-bold weight (800), dark brownish-yellow contrast text color
  ratingText: { fontSize: 11, fontWeight: '800', color: '#713f12' },

  // "BESTSELLER" tag badge: absolutely positioned 8px from bottom and right of the image box, dark slate background, 6px horizontal and 2px vertical padding, 6px rounded corners
  tagBadge: { position: 'absolute', bottom: 8, right: 8, backgroundColor: '#1e293b', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },

  // Bestseller tag badge text: tiny 9px font size, extra-bold weight (800), crisp white color, 0.5px letter spacing
  tagText: { fontSize: 9, fontWeight: '800', color: '#ffffff', letterSpacing: 0.5 },

  // Product title text: 13px size, bold weight (700), centered text, fixed 36px height (for consistent 2-line alignment), dark slate color, 2px top margin
  cardName: { fontSize: 13, fontWeight: '700', textAlign: 'center', height: 36, color: '#1e293b', marginTop: 2 },

  // Product price text: 16px size, extra-bold weight (800), 6px top/bottom margins, dark slate text color
  cardPrice: { fontSize: 16, fontWeight: '800', marginVertical: 6, color: '#0f172a' },

  // "+ Add to Bag" button: off-white background, 1.5px teal border, 20px rounded pill corners, 7px top/bottom padding, 22px left/right padding, 4px top margin
  addButton: { backgroundColor: '#f8fafc', borderWidth: 1.5, borderColor: '#1a434e', borderRadius: 20, paddingVertical: 7, paddingHorizontal: 22, marginTop: 4 },

  // "+ Add to Bag" label text: teal theme color, 13px size, bold weight (700)
  addButtonText: { color: '#1a434e', fontSize: 13, fontWeight: '700' },

  // Quantity stepper wrapper (when item is in cart): horizontal row layout, vertically centered, light gray background, 20px pill radius, 4px vertical / 10px horizontal padding, 4px top margin
  quantityControls: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f1f5f9', borderRadius: 20, paddingVertical: 4, paddingHorizontal: 10, marginTop: 4 },

  // Quantity minus/plus circular buttons: fixed 26x26px circle (13px border radius), solid teal background, centers math symbol
  qtyBtn: { width: 26, height: 26, backgroundColor: '#1a434e', borderRadius: 13, justifyContent: 'center', alignItems: 'center' },

  // Plus/minus math symbol text inside stepper buttons: white text color, 15px size, bold weight
  qtyBtnText: { color: '#fff', fontSize: 15, fontWeight: 'bold' },

  // Current quantity number text: 12px left/right margins, 14px size, extra-bold weight (800), dark slate color
  qtyText: { marginHorizontal: 12, fontSize: 14, fontWeight: '800', color: '#0f172a' },

  // Empty state container (when filters/search return no results): 50px vertical padding, horizontally/vertically centered, 100% width
  emptyStateContainer: { paddingVertical: 50, alignItems: 'center', justifyContent: 'center', width: '100%' },

  // Empty state main title ("No products found"): 16px size, extra-bold weight (800), dark slate color, 4px bottom spacing
  emptyStateTitle: { fontSize: 16, fontWeight: '800', color: '#0f172a', marginBottom: 4 },

  // Empty state subtitle text: 13px size, muted slate-gray color
  emptyStateSubtitle: { fontSize: 13, color: '#64748b' }
});