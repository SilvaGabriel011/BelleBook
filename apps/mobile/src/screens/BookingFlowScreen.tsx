import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type BookingFlowScreenNavigationProp = StackNavigationProp<RootStackParamList, 'BookingFlow'>;
type BookingFlowScreenRouteProp = RouteProp<RootStackParamList, 'BookingFlow'>;

const BookingFlowScreen = () => {
  const navigation = useNavigation<BookingFlowScreenNavigationProp>();
  const route = useRoute<BookingFlowScreenRouteProp>();
  const serviceId = route.params?.serviceId;

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Booking Flow</Text>
        <Text style={styles.subtitle}>Coming Soon</Text>
        <Text style={styles.description}>
          The booking flow for service {serviceId} will be implemented in a future milestone.
        </Text>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 20,
    color: '#8B5CF6',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 32,
  },
  backButton: {
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default BookingFlowScreen;
