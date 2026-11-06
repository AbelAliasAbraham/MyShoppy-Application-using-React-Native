/**
 * @file CartScreen.tsx
 * @description Advanced e-commerce checkout flow with delivery form, payment method selection, validation, +/- controls, and trash removal icon.
 */
import React, { useState, useCallback, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { CommonActions, useFocusEffect } from '@react-navigation/native';
import { useCart } from '../context/CartContext';
import { Ionicons } from '@expo/vector-icons';

export default function CartScreen({ navigation }: any) {
  const { cart, cartTotal, updateQuantity, removeFromCart, clearCart } = useCart();
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [showDeliveryForm, setShowDeliveryForm] = useState(false);
  const [transactionId, setTransactionId] = useState('');
  
  const scrollViewRef = useRef<ScrollView>(null);

  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [addressType, setAddressType] = useState<'Home' | 'Work' | 'Other'>('Home');
  const addressTypes = ['Home', 'Work', 'Other'] as const;
  
  const addressTypeLabels: Record<'Home' | 'Work' | 'Other', string> = {
    Home: '🏠 Home',
    Work: '🏢 Work',
    Other: '📍 Other',
  };

  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'UPI' | 'Card'>('Cash');
  const paymentMethods = ['Cash', 'UPI', 'Card'] as const;
  const paymentLabels: Record<'Cash' | 'UPI' | 'Card', string> = {
    Cash: '💵 Cash on Delivery',
    UPI: '📱 UPI Payment',
    Card: '💳 Credit / Debit Card',
  };
  
  const [formError, setFormError] = useState('');
  const [errorField, setErrorField] = useState<'name' | 'address' | 'phone' | null>(null);

  useFocusEffect(
    useCallback(() => {
      scrollViewRef.current?.scrollTo({ y: 0, animated: false });

      // Automatically reset/cancel the delivery form and clear inputs whenever leaving this screen
      return () => {
        setShowDeliveryForm(false);
        setFormError('');
        setErrorField(null);
        setName('');
        setAddress('');
        setPhone('');
        setAddressType('Home');
        setPaymentMethod('Cash');
      };
    }, [])
  );

  const handleInitialPlaceOrderClick = () => {
    if (cart.length === 0) {
      setFormError("Your cart is currently empty.");
      return;
    }
    setFormError('');
    setErrorField(null);
    setShowDeliveryForm(true);
  };

  const handleCancelCheckout = () => {
    setShowDeliveryForm(false);
    setFormError('');
    setErrorField(null);
    setName('');
    setAddress('');
    setPhone('');
    setAddressType('Home');
    setPaymentMethod('Cash');
  };

  const handleFinalCheckout = () => {
    const trimmedName = name.trim();
    const trimmedAddress = address.trim();
    const trimmedPhone = phone.trim();

    if (!trimmedName || trimmedName.length < 2) {
      setErrorField('name');
      setFormError("Please enter the receiver's full name (at least 2 characters).");
      return;
    }

    const phoneRegex = /^[6-9]\d{9}$/;
    if (!trimmedPhone || !phoneRegex.test(trimmedPhone)) {
      setErrorField('phone');
      setFormError("Please enter a valid 10-digit mobile number starting with 6, 7, 8, or 9.");
      return;
    }

    if (!trimmedAddress || trimmedAddress.length < 8) {
      setErrorField('address');
      setFormError("Please enter your complete shipping address (minimum 8 characters).");
      return;
    }

    const generatedId = Math.floor(Math.random() * 899999999 + 100000000).toString();
    setTransactionId(generatedId);
    setFormError('');
    setErrorField(null);

    clearCart();
    setOrderPlaced(true);
    setShowDeliveryForm(false);
  };

  const handleAddMoreProducts = () => {
    navigation.navigate('HomeStack', { screen: 'MyShoppy' });
  };

  const handleBackToCategories = () => {
    if (showDeliveryForm) {
      handleCancelCheckout();
      scrollViewRef.current?.scrollTo({ y: 0, animated: false });
      return;
    }

    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'CategoriesTab', state: { routes: [{ name: 'CategoriesList' }] } }],
      })
    );
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView 
        ref={scrollViewRef}
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topRow}>
          <TouchableOpacity style={styles.backButton} onPress={handleBackToCategories} activeOpacity={0.7}>
            <Ionicons name="arrow-back" size={20} color="#1a434e" />
            <Text style={styles.backText}>Categories</Text>
          </TouchableOpacity>
          <Text style={styles.header}>Review & Shipping</Text>
        </View>
        
        {cart.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>Your cart is empty</Text>
            <Text style={styles.emptySubtitle}>Explore our household categories and add items to your cart.</Text>
          </View>
        ) : (
          <>
            {cart.map((item) => (
              <View key={item.id} style={styles.cartItem}>
                <View style={styles.itemImageFrame}>
                  <Image source={{ uri: item.image }} style={styles.itemImage} resizeMode="contain" />
                </View>
                <View style={styles.itemDetails}>
                  <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
                  <Text style={styles.itemPrice}>₹{(item.price * item.quantity).toFixed(2)}</Text>

                  {!showDeliveryForm ? (
                    <View style={styles.controlsRow}>
                      <View style={styles.quantityContainer}>
                        <TouchableOpacity onPress={() => updateQuantity(item.id, -1)} style={styles.qtyBtn}>
                          <Text style={styles.qtySymbol}>-</Text>
                        </TouchableOpacity>
                        <Text style={styles.qtyText}>{item.quantity}</Text>
                        <TouchableOpacity onPress={() => updateQuantity(item.id, 1)} style={styles.qtyBtn}>
                          <Text style={styles.qtySymbol}>+</Text>
                        </TouchableOpacity>
                      </View>

                      <TouchableOpacity 
                        onPress={() => removeFromCart(item.id)} 
                        style={styles.removeBtn}
                        activeOpacity={0.7}
                      >
                        <Ionicons name="trash-outline" size={18} color="#ef4444" />
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <View style={styles.lockedQuantityContainer}>
                      <Text style={styles.lockedQuantityText}>Quantity: {item.quantity}</Text>
                    </View>
                  )}
                </View>
              </View>
            ))}

            {!showDeliveryForm && (
              <TouchableOpacity style={styles.addMoreButton} onPress={handleAddMoreProducts} activeOpacity={0.85}>
                <Ionicons name="add-circle-outline" size={18} color="#1a434e" />
                <Text style={styles.addMoreButtonText}>Add More Products</Text>
              </TouchableOpacity>
            )}
          </>
        )}
        
        <View style={styles.footer}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalAmount}>₹{cartTotal.toFixed(2)}</Text>
          </View>

          {showDeliveryForm && (
            <View style={styles.deliveryCard}>
              <View style={styles.deliveryHeaderRow}>
                <Ionicons name="location-outline" size={20} color="#1a434e" />
                <Text style={styles.checkoutLabel}>Delivery Address</Text>
              </View>

              <View style={styles.addressTypeRow}>
                {addressTypes.map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[styles.typeChip, addressType === type && styles.typeChipActive]}
                    onPress={() => setAddressType(type)}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.typeChipText, addressType === type && styles.typeChipTextActive]}>
                      {addressTypeLabels[type]}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.fieldLabel}>Receiver's Full Name</Text>
              <TextInput
                style={[styles.input, errorField === 'name' && styles.inputError]}
                placeholder="e.g. Abel Abraham"
                placeholderTextColor="#94a3b8"
                value={name}
                onChangeText={(text) => { 
                  setName(text.replace(/[^a-zA-Z\s]/g, '')); 
                  if (errorField === 'name') { setErrorField(null); setFormError(''); }
                }}
              />

              <Text style={styles.fieldLabel}>Mobile Number (For Delivery Updates)</Text>
              <TextInput
                style={[styles.input, errorField === 'phone' && styles.inputError]}
                placeholder="10-Digit Mobile Number (e.g. 9876543210)"
                placeholderTextColor="#94a3b8"
                keyboardType="numeric"
                maxLength={10}
                value={phone}
                onChangeText={(text) => { 
                  setPhone(text.replace(/[^0-9]/g, '')); 
                  if (errorField === 'phone') { setErrorField(null); setFormError(''); }
                }}
              />

              <Text style={styles.fieldLabel}>Complete Shipping Address</Text>
              <TextInput
                style={[styles.input, styles.multilineInput, errorField === 'address' && styles.inputError]}
                placeholder="House / Flat No., Building Name, Street, Area, City & PIN Code"
                placeholderTextColor="#94a3b8"
                multiline={true}
                numberOfLines={3}
                textAlignVertical="top"
                value={address}
                onChangeText={(text) => { 
                  setAddress(text); 
                  if (errorField === 'address') { setErrorField(null); setFormError(''); }
                }}
              />

              <View style={styles.divider} />

              <View style={styles.deliveryHeaderRow}>
                <Ionicons name="card-outline" size={20} color="#1a434e" />
                <Text style={styles.checkoutLabel}>Payment Method</Text>
              </View>

              <View style={styles.paymentTypeRow}>
                {paymentMethods.map((method) => (
                  <TouchableOpacity
                    key={method}
                    style={[styles.paymentChip, paymentMethod === method && styles.paymentChipActive]}
                    onPress={() => setPaymentMethod(method)}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.paymentChipText, paymentMethod === method && styles.paymentChipTextActive]}>
                      {paymentLabels[method]}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {formError !== '' && <Text style={styles.errorText}>{formError}</Text>}
          
          <View style={styles.buttonActionGroup}>
            <TouchableOpacity 
              style={[styles.placeOrderButton, showDeliveryForm && styles.placeOrderButtonHalf]} 
              onPress={showDeliveryForm ? handleFinalCheckout : handleInitialPlaceOrderClick}
              activeOpacity={0.88}
            >
              <Text style={styles.placeOrderText}>{showDeliveryForm ? 'Confirm Order' : 'Place Order'}</Text>
            </TouchableOpacity>

            {showDeliveryForm && (
              <TouchableOpacity style={styles.cancelButton} onPress={handleCancelCheckout} activeOpacity={0.88}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>

      {orderPlaced && (
        <View style={styles.modalOverlay}>
          <View style={styles.successModalCard}>
            <View style={styles.iconCircle}>
              <Text style={styles.checkIcon}>✓</Text>
            </View>
            <Text style={styles.successTitle}>Your order has been accepted</Text>
            <Text style={styles.transactionIdText}>Transaction ID: #{transactionId}</Text>
            <Text style={styles.paymentMethodText}>Payment Method: {paymentLabels[paymentMethod]}</Text>
            
            <TouchableOpacity 
              style={styles.modalContinueButton} 
              onPress={() => {
                setOrderPlaced(false);
                setName('');
                setAddress('');
                setPhone('');
                setAddressType('Home');
                setPaymentMethod('Cash');
                navigation.navigate('HomeStack', { screen: 'MyShoppy' });
              }}
              activeOpacity={0.88}
            >
              <Text style={styles.continueButtonText}>Continue Shopping</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 130,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 14,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#f1f5f9',
    borderRadius: 20,
  },
  backText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1a434e',
    marginLeft: 4,
  },
  header: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0f172a',
  },
  emptyCard: {
    paddingVertical: 36,
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#64748b',
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#f1f5f9',
    borderRadius: 16,
    padding: 12,
    elevation: 1,
  },
  itemImageFrame: {
    width: 76,
    height: 76,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    marginRight: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemImage: {
    width: '85%',
    height: '85%',
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 17,
    fontWeight: '800',
    color: '#1a434e',
    marginBottom: 8,
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  removeBtn: {
    padding: 6,
    backgroundColor: '#fef2f2',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#fee2e2',
  },
  lockedQuantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  lockedQuantityText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#475569',
  },
  qtyBtn: {
    width: 30,
    height: 30,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
  },
  qtySymbol: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
  },
  qtyText: {
    marginHorizontal: 14,
    fontSize: 15,
    fontWeight: '800',
    color: '#0f172a',
  },
  addMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8fafc',
    borderWidth: 1.5,
    borderColor: '#1a434e',
    borderStyle: 'dashed',
    borderRadius: 16,
    paddingVertical: 14,
    marginBottom: 16,
  },
  addMoreButtonText: {
    color: '#1a434e',
    fontSize: 15,
    fontWeight: '700',
    marginLeft: 8,
  },
  footer: {
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    marginTop: 10,
  },
  deliveryCard: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 16,
    padding: 16,
    marginVertical: 14,
    elevation: 2,
  },
  deliveryHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  checkoutLabel: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
    marginLeft: 6,
  },
  addressTypeRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  typeChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginRight: 8,
  },
  typeChipActive: {
    backgroundColor: '#1a434e',
    borderColor: '#1a434e',
  },
  typeChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748b',
  },
  typeChipTextActive: {
    color: '#ffffff',
  },
  divider: {
    height: 1,
    backgroundColor: '#e2e8f0',
    marginVertical: 16,
  },
  paymentTypeRow: {
    flexDirection: 'column',
    gap: 10,
  },
  paymentChip: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  paymentChipActive: {
    backgroundColor: '#1a434e',
    borderColor: '#1a434e',
  },
  paymentChipText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#475569',
  },
  paymentChipTextActive: {
    color: '#ffffff',
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 14,
    fontSize: 15,
    color: '#0f172a',
  },
  multilineInput: {
    minHeight: 84,
    paddingTop: 12,
  },
  inputError: {
    borderColor: '#ef4444',
    borderWidth: 1.5,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 13,
    marginBottom: 12,
    fontWeight: '700',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  totalLabel: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0f172a',
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: '900',
    color: '#1a434e',
  },
  buttonActionGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  placeOrderButton: {
    backgroundColor: '#1a434e',
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: 'center',
    flex: 1,
    elevation: 4,
  },
  placeOrderButtonHalf: {
    flex: 0.48,
  },
  placeOrderText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  cancelButton: {
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: 'center',
    flex: 0.48,
  },
  cancelButtonText: {
    color: '#475569',
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.82)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
    paddingHorizontal: 24,
  },
  successModalCard: {
    width: '92%',
    backgroundColor: '#ffffff',
    borderRadius: 28,
    paddingVertical: 32,
    paddingHorizontal: 24,
    alignItems: 'center',
    elevation: 10,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  iconCircle: {
    width: 76,
    height: 76,
    backgroundColor: '#dcfce7',
    borderRadius: 38,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  checkIcon: {
    color: '#16a34a',
    fontSize: 38,
    fontWeight: '800',
  },
  successTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 8,
    textAlign: 'center',
  },
  transactionIdText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748b',
    marginBottom: 6,
  },
  paymentMethodText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1a434e',
    marginBottom: 24,
  },
  modalContinueButton: {
    backgroundColor: '#f97316',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 25,
    width: '100%',
    alignItems: 'center',
  },
  continueButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '800',
  },
});