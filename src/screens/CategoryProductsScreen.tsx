/**
 * @file CategoryProductsScreen.tsx
 * @description Category catalog screen loading products directly from local db.json data, featuring search, multi-option filtering, and price/rating sorting.
 */
import React, { useState, useEffect, useCallback, memo } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Image, TextInput, ScrollView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useCart, Product } from '../context/CartContext';
import { Ionicons } from '@expo/vector-icons';
import dbData from '../data/db.json'; // Adjust the relative path to your db.json file as needed

const FILTER_OPTIONS = [
  'All',
  'Price: Low to High',
  'Price: High to Low',
  'Top Rated',
  'Under ₹1000',
  'Over ₹1000',
  'In Stock'
] as const;

type FilterType = typeof FILTER_OPTIONS[number];

const CategoryProductCard = memo(({ item, cart, addToCart, updateQuantity, navigation }: {
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
        <Image source={{ uri: item.image }} style={styles.image} resizeMode="contain" />
        <View style={styles.ratingBadge}>
          <Text style={styles.ratingText}>★ {item.rating}</Text>
        </View>
      </View>

      <Text style={styles.name} numberOfLines={2}>{item.name}</Text>
      <Text style={styles.price}>₹{item.price.toFixed(2)}</Text>
      
      {qty === 0 ? (
        <TouchableOpacity style={styles.button} onPress={() => addToCart(item)} activeOpacity={0.85}>
          <Text style={styles.buttonText}>Add to Bag</Text>
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

export default function CategoryProductsScreen({ route, navigation }: any) {
  const { categoryName } = route.params; 
  const { cart, addToCart, updateQuantity } = useCart(); 
  const [products, setProducts] = useState<Product[]>([]); 
  const [isLoading, setIsLoading] = useState(true); 
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('All');

  useFocusEffect(
    useCallback(() => {
      setSearchQuery('');
      setSelectedFilter('All');
    }, [])
  );

  useEffect(() => {
    setIsLoading(true);

    // Filter products from db.json matching the selected category name
    const matchedProducts = dbData.products.filter(
      (item: any) => item.category.toLowerCase() === categoryName.toLowerCase()
    );

    const formattedData: Product[] = matchedProducts.map((item: any, index: number) => {
      const uniqueSuffix = `${index}-${Math.floor(Math.random() * 1000)}`;
      return {
        id: String(item.id ? `${item.id}-${uniqueSuffix}` : `${categoryName}-${uniqueSuffix}`),
        name: item.name,
        price: item.price,
        category: categoryName,
        image: item.image || 'https://via.placeholder.com/150',
        description: item.description || "A quality household item designed for everyday convenience.",
        rating: item.rating || 4.5,
        stock: item.stock ?? 20
      };
    });

    setProducts(formattedData);
    setIsLoading(false);
  }, [categoryName]);

  // Apply search query, condition filtering, and price/rating sorting
  const getProcessedProducts = () => {
    let result = products.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      let matchesCondition = true;

      if (selectedFilter === 'Under ₹1000') {
        matchesCondition = item.price < 1000;
      } else if (selectedFilter === 'Over ₹1000') {
        matchesCondition = item.price >= 1000;
      } else if (selectedFilter === 'In Stock') {
        matchesCondition = item.stock > 0;
      }

      return matchesSearch && matchesCondition;
    });

    // Handle sorting selections without mutating the original array
    if (selectedFilter === 'Price: Low to High') {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (selectedFilter === 'Price: High to Low') {
      result = [...result].sort((a, b) => b.price - a.price);
    } else if (selectedFilter === 'Top Rated') {
      result = [...result].sort((a, b) => b.rating - a.rating);
    }

    return result;
  };

  const processedProducts = getProcessedProducts();

  const renderCategoryItem = useCallback(({ item }: { item: Product }) => (
    <CategoryProductCard 
      item={item} 
      cart={cart} 
      addToCart={addToCart} 
      updateQuantity={updateQuantity} 
      navigation={navigation} 
    />
  ), [cart, addToCart, updateQuantity, navigation]);

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#1a434e" />
        <Text style={styles.loadingText}>Loading {categoryName} collection...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>{categoryName} Collection</Text>

      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Ionicons name="search-outline" size={18} color="#64748b" style={{ marginRight: 8 }} />
          <TextInput
            style={styles.searchInput}
            placeholder={`Search ${categoryName}...`}
            placeholderTextColor="#94a3b8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Dynamic Filter & Sort Bar */}
      <View style={styles.filterWrapper}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.filterScrollContainer}
        >
          {FILTER_OPTIONS.map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[styles.filterChip, selectedFilter === filter && styles.filterChipActive]}
              onPress={() => setSelectedFilter(filter)}
              activeOpacity={0.8}
            >
              <Text style={[styles.filterText, selectedFilter === filter && styles.filterTextActive]}>
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <FlatList<Product>
        data={processedProducts}
        numColumns={2}
        keyExtractor={(item) => item.id}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        maxToRenderPerBatch={6}
        windowSize={5}
        initialNumToRender={4}
        updateCellsBatchingPeriod={50}
        getItemLayout={(data, index) => ({
          length: 260,
          offset: 260 * Math.floor(index / 2),
          index,
        })}
        ListEmptyComponent={
          <View style={styles.emptyStateContainer}>
            <Ionicons name="filter-circle-outline" size={44} color="#94a3b8" style={{ marginBottom: 8 }} />
            <Text style={styles.emptyStateTitle}>No products found</Text>
            <Text style={styles.emptyStateSubtitle}>Try clearing your filter or searching for another term.</Text>
          </View>
        }
        contentContainerStyle={{ paddingBottom: 110 }}
        renderItem={renderCategoryItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  // Root screen container: fills 100% of available height/width, 16px left/right padding, 10px top padding, solid white background
  container: { flex: 1, paddingHorizontal: 16, paddingTop: 10, backgroundColor: '#fff' },

  // Center alignment wrapper: used to center the ActivityIndicator spinner and loading text horizontally and vertically
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  // Loading spinner text: 12px space above text, muted slate-gray color, 15px size, semi-bold weight (600)
  loadingText: { marginTop: 12, color: '#64748b', fontSize: 15, fontWeight: '600' },

  // Main screen header title ("<Category> Collection"): 24px size, extra-bold weight (800), 14px bottom margin, dark slate text
  headerTitle: { fontSize: 24, fontWeight: '800', marginBottom: 14, color: '#0f172a' },

  // Search section wrapper: adds 12px bottom spacing below the search box before the filter chips start
  searchContainer: { marginBottom: 12 },

  // Search input pill box: horizontal row layout, vertically centered items, off-white background, 16px rounded corners, 16px horizontal and 12px vertical padding, 1px subtle gray border
  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f8fafc', borderRadius: 16, paddingHorizontal: 16, paddingVertical: 12, borderWidth: 1, borderColor: '#e2e8f0' },

  // Text input field: flex 1 allows it to expand and fill remaining space inside the box, 15px font size, dark slate text color, resets platform default padding to 0
  searchInput: { flex: 1, fontSize: 15, color: '#0f172a', padding: 0 },

  // Filter bar wrapper: adds 16px of vertical space below the horizontal filter chips before the product grid starts
  filterWrapper: { marginBottom: 16 },

  // Filter scroll container: adds 16px right padding inside the scroll view so the last chip doesn't cut off against the screen edge
  filterScrollContainer: { paddingRight: 16 },

  // Unselected filter chip pill: 16px left/right padding, 8px top/bottom padding, 20px rounded pill corners, off-white background, 1px light gray border, 8px right spacing between chips
  filterChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#e2e8f0', marginRight: 8 },

  // Active/selected filter chip pill: overrides background and border color to your solid theme teal color
  filterChipActive: { backgroundColor: '#1a434e', borderColor: '#1a434e' },

  // Unselected filter chip label text: muted slate-gray color, semi-bold weight (600), 13px font size
  filterText: { color: '#64748b', fontWeight: '600', fontSize: 13 },

  // Active/selected filter chip label text: overrides color to crisp white for contrast against teal
  filterTextActive: { color: '#ffffff' },

  // FlatList column wrapper: evenly spaces out the 2 grid columns horizontally across the row
  row: { justifyContent: 'space-between' },

  // Product card tile: takes up 48% of row width, 12px inner padding, 16px bottom margin, solid white background, 18px rounded corners, centers inner items, 1px border, shadow properties for depth
  card: { flex: 0.48, padding: 12, marginBottom: 16, backgroundColor: '#ffffff', borderRadius: 18, alignItems: 'center', borderWidth: 1, borderColor: '#f1f5f9', elevation: 3, shadowColor: '#0f172a', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.06, shadowRadius: 8 },

  // Product thumbnail frame: 100% card width, fixed 140px height, relative positioning (for absolute badge inside), 10px bottom margin, off-white background, 14px border radius, centers image
  imageBox: { width: '100%', height: 140, position: 'relative', marginBottom: 10, backgroundColor: '#f8fafc', borderRadius: 14, justifyContent: 'center', alignItems: 'center' },

  // Product thumbnail image: scales to 88% of the frame's width and height so it doesn't touch the edges
  image: { width: '88%', height: '88%' },

  // Rating star badge: absolutely positioned 8px from top and left of the image box, soft yellow background, 7px horizontal and 3px vertical padding, 8px rounded corners
  ratingBadge: { position: 'absolute', top: 8, left: 8, backgroundColor: '#fef08a', paddingHorizontal: 7, paddingVertical: 3, borderRadius: 8 },

  // Rating badge text: small 11px size, extra-bold weight (800), dark brownish-yellow contrast text color
  ratingText: { fontSize: 11, fontWeight: '800', color: '#713f12' },

  // Product title text: 13px size, bold weight (700), centered text, fixed 36px height (for consistent 2-line alignment), dark slate color, 2px top margin
  name: { fontSize: 13, fontWeight: '700', textAlign: 'center', height: 36, color: '#1e293b', marginTop: 2 },

  // Product price text: 16px size, extra-bold weight (800), 6px top/bottom margins, dark slate text color
  price: { fontSize: 16, fontWeight: '800', marginVertical: 6, color: '#0f172a' },

  // "Add to Bag" button: off-white background, 1.5px teal border, 20px rounded pill corners, 7px top/bottom padding, 22px left/right padding, 4px top margin
  button: { backgroundColor: '#f8fafc', borderWidth: 1.5, borderColor: '#1a434e', borderRadius: 20, paddingVertical: 7, paddingHorizontal: 22, marginTop: 4 },

  // "Add to Bag" label text: teal theme color, 13px size, bold weight (700)
  buttonText: { color: '#1a434e', fontSize: 13, fontWeight: '700' },

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

  // Empty state main title ("No products found"): 16px size, extra-bold weight (800), dark slate color, 4px bottom spacing[cite: 3]
  emptyStateTitle: { fontSize: 16, fontWeight: '800', color: '#0f172a', marginBottom: 4 },

  // Empty state subtitle text: 13px size, muted slate-gray color[cite: 3]
  emptyStateSubtitle: { fontSize: 13, color: '#64748b' }
});