/**
 * @file CategoriesScreen.tsx
 * @description Visual category showcase loading departments dynamically directly from local db.json data.
 */
import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, TextInput } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import dbData from '../data/db.json'; // Adjust the relative path to your db.json file as needed

export default function CategoriesScreen({ navigation }: any) {
  const [searchQuery, setSearchQuery] = useState('');

  useFocusEffect(
    useCallback(() => {
      setSearchQuery('');
    }, [])
  );

  // Load categories directly from db.json
  const categoriesList = dbData.categories || [];

  const filteredCategories = categoriesList.filter((category: any) =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.screenTitle}>Household Departments</Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Ionicons name="search-outline" size={18} color="#64748b" style={{ marginRight: 8 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search departments..."
            placeholderTextColor="#94a3b8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <FlatList
        data={filteredCategories}
        numColumns={2}
        keyExtractor={(item) => item.id}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 110 }}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={[styles.card, { backgroundColor: item.color }]}
            onPress={() => navigation.navigate('CategoryProducts', { categoryName: item.name })}
            activeOpacity={0.88}
          >
            {item.image && (
              <Image source={{ uri: item.image }} style={styles.cardImage} resizeMode="cover" />
            )}
            <View style={styles.overlay}>
              <Text style={styles.title}>{item.name}</Text>
              <View style={styles.exploreBadge}>
                <Text style={styles.exploreText}>EXPLORE →</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  // Root container: fills 100% of available screen space, sets a white background, adds 16px horizontal breathing room, and 10px top spacing
  container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 16, paddingTop: 10 },

  // Header row container: aligns title items horizontally in a row, vertically centered, with a 16px bottom margin
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },

  // Main screen heading ("Household Departments"): 22px font size, extra-bold weight (800), dark slate color for high contrast
  screenTitle: { fontSize: 22, fontWeight: '800', color: '#0f172a' },

  // Search section wrapper: adds 18px of spacing below the search bar before the category grid begins
  searchContainer: { marginBottom: 18 },

  // Search input pill box: horizontal row layout, vertically centered items, off-white background, 16px rounded corners, 16px horizontal and 12px vertical padding, 1px subtle gray border
  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f8fafc', borderRadius: 16, paddingHorizontal: 16, paddingVertical: 12, borderWidth: 1, borderColor: '#e2e8f0' },

  // Text input field: flex 1 allows it to expand and fill remaining space inside the box, 15px font size, dark slate text color, resets platform default padding to 0
  searchInput: { flex: 1, fontSize: 15, color: '#0f172a', padding: 0 },

  // FlatList column wrapper: evenly spaces out the 2 grid columns horizontally and adds 16px spacing below each row
  row: { justifyContent: 'space-between', marginBottom: 16 },

  // Category card tile: takes up 48% of row width, fixed 170px height, 22px rounded corners, clips child elements inside edges, elevation 4 for Android shadow, shadow properties for iOS depth
  card: { flex: 0.48, height: 170, borderRadius: 22, overflow: 'hidden', elevation: 4, shadowColor: '#0f172a', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 8 },

  // Card background image: absolutely positioned at top-left (0,0), stretches to fill 100% of the tile's width and height
  cardImage: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' },

  // Dark gradient overlay: expands to fill card (flex: 1), 14px inner padding, aligns text to bottom edge, 40% opaque black tint so white text stays readable over images
  overlay: { flex: 1, padding: 14, justifyContent: 'flex-end', backgroundColor: 'rgba(0, 0, 0, 0.4)' },

  // Category name title text: 18px size, extra-bold weight (800), white color, slight letter spacing (0.3), drop shadow for extra contrast against background photos
  title: { fontSize: 18, fontWeight: '800', color: '#ffffff', letterSpacing: 0.3, textShadowColor: 'rgba(0, 0, 0, 0.7)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 4 },

  // "EXPLORE →" badge wrapper: 4px top spacing, shrinks wrapper width to fit its text instead of stretching full card width
  exploreBadge: { marginTop: 4, alignSelf: 'flex-start' },

  // "EXPLORE →" badge text: small 11px size, extra-bold weight (800), light slate-gray color, wide letter spacing (1) for a modern uppercase look
  exploreText: { fontSize: 11, fontWeight: '800', color: '#cbd5e1', letterSpacing: 1 },
});