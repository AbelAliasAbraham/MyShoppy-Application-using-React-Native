/**
 * @file App.tsx
 * @description Main entry point. Handles application routing, navigation stacks, global state, and custom curved bottom navigation tab bar.
 */

import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { CartProvider, useCart } from './src/context/CartContext';

// Screens
import HomeScreen from './src/screens/HomeScreen';
import CategoriesScreen from './src/screens/CategoriesScreen';
import CategoryProductsScreen from './src/screens/CategoryProductsScreen';
import CartScreen from './src/screens/CartScreen';
import ProductDetailsScreen from './src/screens/ProductDetailsScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const HomeStackNav = createNativeStackNavigator();
const CartStackNav = createNativeStackNavigator();

export const HeaderLogo = () => (
  <View style={styles.logoWrapper}>
    <Text style={styles.logoText}>MyShoppy</Text>
    <View style={styles.logoUnderline}>
      <View style={styles.logoDot} />
    </View>
  </View>
);

function HomeStack() {
  return (
    <HomeStackNav.Navigator 
      screenOptions={{ 
        headerTitleAlign: 'center', 
        headerShadowVisible: false, 
        headerTitle: () => <HeaderLogo />,
        headerStyle: { backgroundColor: '#fff' },
        headerBackVisible: false,
      }}
    >
      <HomeStackNav.Screen name="MyShoppy" component={HomeScreen} options={{ title: '' }} />
      <HomeStackNav.Screen name="ProductDetails" component={ProductDetailsScreen} options={{ title: '' }} />
    </HomeStackNav.Navigator>
  );
}

function CategoriesStack() {
  return (
    <Stack.Navigator 
      screenOptions={{ 
        headerTitleAlign: 'center', 
        headerShadowVisible: false, 
        headerTitle: () => <HeaderLogo />,
        headerStyle: { backgroundColor: '#fff' },
        headerBackVisible: false,
      }}
    >
      <Stack.Screen name="CategoriesList" component={CategoriesScreen} options={{ title: '' }} />
      <Stack.Screen name="CategoryProducts" component={CategoryProductsScreen} options={{ title: '' }} />
      <Stack.Screen name="ProductDetails" component={ProductDetailsScreen} options={{ title: '' }} />
    </Stack.Navigator>
  );
}

function CartStack() {
  return (
    <CartStackNav.Navigator
      screenOptions={{
        headerTitleAlign: 'center',
        headerShadowVisible: false,
        headerTitle: () => <HeaderLogo />,
        headerStyle: { backgroundColor: '#fff' },
        headerBackVisible: false,
      }}
    >
      <CartStackNav.Screen name="CartMain" component={CartScreen} options={{ title: '' }} />
    </CartStackNav.Navigator>
  );
}

function CartIconWithBadge({ focused, color, size }: { focused: boolean; color: string; size: number }) {
  const { cart } = useCart();
  const totalItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <View style={styles.iconWrapper}>
      <Ionicons name={focused ? 'cart' : 'cart-outline'} size={size} color={color} />
      {totalItemsCount > 0 && (
        <View style={styles.badgeContainer}>
          <Text style={styles.badgeText}>{totalItemsCount}</Text>
        </View>
      )}
    </View>
  );
}

export default function App() {
  return (
    <CartProvider>
      <NavigationContainer>
        <Tab.Navigator 
          screenOptions={({ route }) => ({ 
            headerTitleAlign: 'center', 
            headerShadowVisible: false, 
            headerStyle: { backgroundColor: '#fff' },
            headerTitle: () => <HeaderLogo />, 
            tabBarActiveTintColor: '#ffffff', 
            tabBarInactiveTintColor: '#88a4a8', 
            tabBarStyle: { 
              backgroundColor: '#1a434e', 
              borderTopWidth: 0,
              elevation: 10,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: -3 },
              shadowOpacity: 0.15,
              shadowRadius: 6,
              position: 'absolute',
              bottom: 10,  
              left: 30,    
              right: 30,   
              borderRadius: 25, 
              height: 65,  
              paddingBottom: 4,
              paddingTop: 4
            }, 
            tabBarLabelStyle: {
              fontSize: 15, 
              fontWeight: '600',
              marginBottom: 2
            },
            
            tabBarIcon: ({ focused, color }) => {
              let iconName;
              const compactSize = 20; 
              if (route.name === 'HomeStack') {
                iconName = focused ? 'home' : 'home-outline';
                return <Ionicons name={iconName as any} size={compactSize} color={color} />;
              } else if (route.name === 'CategoriesTab') {
                iconName = focused ? 'grid' : 'grid-outline';
                return <Ionicons name={iconName as any} size={compactSize} color={color} />;
              } else if (route.name === 'Cart') {
                return <CartIconWithBadge focused={focused} color={color} size={compactSize} />;
              }
            },
          })}
        >
          <Tab.Screen 
            name="HomeStack" 
            component={HomeStack} 
            options={{ headerShown: false, tabBarLabel: 'Home' }}
            listeners={({ navigation }) => ({
              tabPress: (e) => {
                e.preventDefault();
                navigation.navigate('HomeStack', { screen: 'MyShoppy' });
              },
            })}
          />
          
          <Tab.Screen 
            name="CategoriesTab" 
            component={CategoriesStack} 
            options={{ 
              headerShown: false, 
              tabBarLabel: 'Categories' 
            }}
            listeners={({ navigation }) => ({
              tabPress: (e) => {
                e.preventDefault();
                navigation.navigate('CategoriesTab', { screen: 'CategoriesList' });
              },
            })}
          />
          
          <Tab.Screen name="Cart" component={CartStack} options={{ headerShown: false, tabBarLabel: 'Cart' }} />
        </Tab.Navigator>
      </NavigationContainer>
    </CartProvider>
  );
}

const styles = StyleSheet.create({
  // Logo container: centers the logo horizontally, adds 10px top padding and 20px bottom padding for spacing
  logoWrapper: { alignItems: 'center', paddingTop: 10, paddingBottom: 20 },

  // Main brand text: large 40px size, italicized, bold font weight, slate-teal color (#4f7278), 2px bottom spacing above the underline
  logoText: { fontSize: 40, fontStyle: 'italic', color: '#4f7278', fontWeight: 'bold', marginBottom: 2 },

  // Decorative underline bar: 2px height, slate-teal background, spans 82% of wrapper width, flex row aligned to right edge to hold the trailing dot
  logoUnderline: { height: 2, backgroundColor: '#4f7278', width: '82%', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' },

  // Decorative trailing circle dot: fixed 8x8px circle (4px border radius), slate-teal background, pulled 4px further right (-4px margin) over the underline end
  logoDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#4f7278', marginRight: -4 },

  // Icon container (e.g., cart or menu icon): fixed 20x20px box, perfectly centers inner icon horizontally and vertically
  iconWrapper: { width: 20, height: 20, justifyContent: 'center', alignItems: 'center' },

  // Notification count badge: absolute positioning pushed 6px above and 10px right of the icon, bright red background (#ef4444), 8px border radius, minimum 14x14px pill size, centered items, 2px horizontal padding for multi-digit numbers
  badgeContainer: { position: 'absolute', top: -6, right: -10, backgroundColor: '#ef4444', borderRadius: 8, minWidth: 14, height: 14, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 2 },

  // Badge count number text: crisp white color, tiny 9px font size, bold font weight
  badgeText: { color: '#fff', fontSize: 9, fontWeight: 'bold' }
});