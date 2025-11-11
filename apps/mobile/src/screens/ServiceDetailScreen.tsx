import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { RootState } from '../store';
import {
  setSelectedService,
  toggleFavorite,
  setLoading,
  setError,
} from '../store/slices/catalogSlice';
import {
  doc,
  getDoc,
  collection,
  addDoc,
  deleteDoc,
  query,
  where,
  getDocs,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import type { ServiceStyle } from '../store/slices/catalogSlice';

type ServiceDetailScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ServiceDetail'>;
type ServiceDetailScreenRouteProp = RouteProp<RootStackParamList, 'ServiceDetail'>;

const ServiceDetailScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation<ServiceDetailScreenNavigationProp>();
  const route = useRoute<ServiceDetailScreenRouteProp>();
  const { selectedService, favorites, isLoading, error } = useSelector(
    (state: RootState) => state.catalog
  );
  const user = useSelector((state: RootState) => state.auth.user);

  const [service, setService] = useState<ServiceStyle | null>(selectedService);
  const [isFavoriting, setIsFavoriting] = useState(false);

  const serviceId = route.params?.serviceId;

  useEffect(() => {
    if (!selectedService && serviceId) {
      loadService();
    } else if (selectedService) {
      setService(selectedService);
    }
  }, [serviceId, selectedService]);

  const loadService = async () => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      const serviceDoc = await getDoc(doc(db, 'service_styles', serviceId));
      if (serviceDoc.exists()) {
        const serviceData = {
          id: serviceDoc.id,
          ...serviceDoc.data(),
        } as ServiceStyle;
        setService(serviceData);
        dispatch(setSelectedService(serviceData));
      } else {
        dispatch(setError('Service not found'));
      }
    } catch (err) {
      dispatch(setError(err instanceof Error ? err.message : 'Failed to load service'));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleToggleFavorite = async () => {
    if (!user || !service) return;

    try {
      setIsFavoriting(true);
      const isFav = favorites.includes(service.id);

      if (isFav) {
        const favQuery = query(
          collection(db, 'favorites'),
          where('userId', '==', user.id),
          where('serviceId', '==', service.id)
        );
        const favSnapshot = await getDocs(favQuery);

        for (const favDoc of favSnapshot.docs) {
          await deleteDoc(doc(db, 'favorites', favDoc.id));
        }
      } else {
        await addDoc(collection(db, 'favorites'), {
          userId: user.id,
          serviceId: service.id,
          createdAt: new Date().toISOString(),
        });
      }

      dispatch(toggleFavorite(service.id));
    } catch (err) {
      console.error('Error toggling favorite:', err);
    } finally {
      setIsFavoriting(false);
    }
  };

  const handleBookNow = () => {
    if (!service) return;
    navigation.navigate('BookingFlow', { serviceId: service.id });
  };

  const isFavorite = service ? favorites.includes(service.id) : false;

  if (isLoading && !service) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#8B5CF6" />
        <Text style={styles.loadingText}>Loading service details...</Text>
      </View>
    );
  }

  if (error || !service) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error || 'Service not found'}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => navigation.goBack()}>
          <Text style={styles.retryButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: service.imageUrl }} style={styles.serviceImage} />
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.favoriteButton, isFavorite && styles.favoriteButtonActive]}
            onPress={handleToggleFavorite}
            disabled={isFavoriting || !user}
          >
            <Text style={styles.favoriteButtonText}>{isFavorite ? '♥' : '♡'}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.contentContainer}>
          <View style={styles.header}>
            <Text style={styles.serviceName}>{service.name}</Text>
            <Text style={styles.servicePrice}>${service.price.toFixed(2)}</Text>
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{service.likes}</Text>
              <Text style={styles.statLabel}>Likes</Text>
            </View>
            {service.providerName && (
              <View style={styles.statItem}>
                <Text style={styles.statValue}>Provider</Text>
                <Text style={styles.statLabel}>{service.providerName}</Text>
              </View>
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{service.description}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Service Details</Text>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Category ID:</Text>
              <Text style={styles.detailValue}>{service.categoryId}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Provider ID:</Text>
              <Text style={styles.detailValue}>{service.providerId}</Text>
            </View>
            {service.createdAt && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Listed:</Text>
                <Text style={styles.detailValue}>
                  {new Date(service.createdAt).toLocaleDateString()}
                </Text>
              </View>
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>What to Expect</Text>
            <Text style={styles.description}>
              This professional beauty service is provided by experienced professionals. Book now to
              secure your appointment and enjoy a premium beauty experience.
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.footerPriceContainer}>
          <Text style={styles.footerPriceLabel}>Total Price</Text>
          <Text style={styles.footerPrice}>${service.price.toFixed(2)}</Text>
        </View>
        <TouchableOpacity style={styles.bookButton} onPress={handleBookNow}>
          <Text style={styles.bookButtonText}>Book Now</Text>
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
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 20,
  },
  imageContainer: {
    position: 'relative',
  },
  serviceImage: {
    width: '100%',
    height: 300,
    backgroundColor: '#E5E7EB',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  backButtonText: {
    fontSize: 16,
    color: '#8B5CF6',
    fontWeight: '600',
  },
  favoriteButton: {
    position: 'absolute',
    top: 40,
    right: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteButtonActive: {
    backgroundColor: '#EF4444',
  },
  favoriteButtonText: {
    fontSize: 24,
    color: '#EF4444',
  },
  contentContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -24,
    paddingTop: 24,
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  header: {
    marginBottom: 20,
  },
  serviceName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  servicePrice: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#8B5CF6',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 24,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  detailLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  detailValue: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '500',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  footerPriceContainer: {
    flex: 1,
  },
  footerPriceLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  footerPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8B5CF6',
  },
  bookButton: {
    backgroundColor: '#8B5CF6',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6B7280',
  },
  errorText: {
    fontSize: 16,
    color: '#EF4444',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ServiceDetailScreen;
