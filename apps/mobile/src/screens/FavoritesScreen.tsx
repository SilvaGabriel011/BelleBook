import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { RootState } from '../store';
import {
  setFavorites,
  setSelectedService,
  toggleFavorite,
  setLoading,
  setError,
} from '../store/slices/catalogSlice';
import { collection, query, where, getDocs, doc, getDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import type { ServiceStyle } from '../store/slices/catalogSlice';

type FavoritesScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Favorites'>;

const FavoritesScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation<FavoritesScreenNavigationProp>();
  const { isLoading, error } = useSelector((state: RootState) => state.catalog);
  const user = useSelector((state: RootState) => state.auth.user);

  const [favoriteServices, setFavoriteServices] = useState<ServiceStyle[]>([]);
  const [removingId, setRemovingId] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadFavorites();
    }
  }, [user]);

  const loadFavorites = async () => {
    if (!user) return;

    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      const favoritesQuery = query(collection(db, 'favorites'), where('userId', '==', user.id));
      const favoritesSnapshot = await getDocs(favoritesQuery);

      const favoriteIds = favoritesSnapshot.docs.map((doc) => doc.data().serviceId);
      dispatch(setFavorites(favoriteIds));

      if (favoriteIds.length === 0) {
        setFavoriteServices([]);
        dispatch(setLoading(false));
        return;
      }

      const servicesPromises = favoriteIds.map(async (serviceId) => {
        const serviceDoc = await getDoc(doc(db, 'service_styles', serviceId));
        if (serviceDoc.exists()) {
          return {
            id: serviceDoc.id,
            ...serviceDoc.data(),
          } as ServiceStyle;
        }
        return null;
      });

      const services = await Promise.all(servicesPromises);
      const validServices = services.filter((s) => s !== null) as ServiceStyle[];
      setFavoriteServices(validServices);
    } catch (err) {
      dispatch(setError(err instanceof Error ? err.message : 'Failed to load favorites'));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleRemoveFavorite = async (service: ServiceStyle) => {
    if (!user) return;

    try {
      setRemovingId(service.id);

      const favQuery = query(
        collection(db, 'favorites'),
        where('userId', '==', user.id),
        where('serviceId', '==', service.id)
      );
      const favSnapshot = await getDocs(favQuery);

      for (const favDoc of favSnapshot.docs) {
        await deleteDoc(doc(db, 'favorites', favDoc.id));
      }

      dispatch(toggleFavorite(service.id));
      setFavoriteServices((prev) => prev.filter((s) => s.id !== service.id));
    } catch (err) {
      console.error('Error removing favorite:', err);
    } finally {
      setRemovingId(null);
    }
  };

  const handleServicePress = (service: ServiceStyle) => {
    dispatch(setSelectedService(service));
    navigation.navigate('ServiceDetail', { serviceId: service.id });
  };

  const renderService = ({ item }: { item: ServiceStyle }) => (
    <TouchableOpacity style={styles.serviceCard} onPress={() => handleServicePress(item)}>
      <Image source={{ uri: item.imageUrl }} style={styles.serviceImage} />
      <View style={styles.serviceInfo}>
        <Text style={styles.serviceName}>{item.name}</Text>
        <Text style={styles.serviceDescription} numberOfLines={2}>
          {item.description}
        </Text>
        <View style={styles.serviceFooter}>
          <Text style={styles.servicePrice}>${item.price.toFixed(2)}</Text>
          <View style={styles.likesContainer}>
            <Text style={styles.likesText}>♥ {item.likes}</Text>
          </View>
        </View>
      </View>
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => handleRemoveFavorite(item)}
        disabled={removingId === item.id}
      >
        {removingId === item.id ? (
          <ActivityIndicator size="small" color="#EF4444" />
        ) : (
          <Text style={styles.removeButtonText}>Remove</Text>
        )}
      </TouchableOpacity>
    </TouchableOpacity>
  );

  if (!user) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyText}>Please sign in to view favorites</Text>
        <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('Home')}>
          <Text style={styles.actionButtonText}>Go to Home</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (isLoading && favoriteServices.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#8B5CF6" />
        <Text style={styles.loadingText}>Loading favorites...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadFavorites}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>My Favorites</Text>
        <Text style={styles.subtitle}>
          {favoriteServices.length} {favoriteServices.length === 1 ? 'service' : 'services'}
        </Text>
      </View>

      <FlatList
        data={favoriteServices}
        renderItem={renderService}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>♡</Text>
            <Text style={styles.emptyText}>No favorites yet</Text>
            <Text style={styles.emptySubtext}>
              Start adding services to your favorites to see them here
            </Text>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate('Categories')}
            >
              <Text style={styles.actionButtonText}>Browse Services</Text>
            </TouchableOpacity>
          </View>
        }
      />
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
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    marginBottom: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: '#8B5CF6',
    fontWeight: '500',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  listContainer: {
    padding: 16,
  },
  serviceCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  serviceImage: {
    width: '100%',
    height: 200,
    backgroundColor: '#E5E7EB',
  },
  serviceInfo: {
    padding: 16,
  },
  serviceName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  serviceDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
  },
  serviceFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  servicePrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#8B5CF6',
  },
  likesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  likesText: {
    fontSize: 14,
    color: '#EF4444',
  },
  removeButton: {
    backgroundColor: '#FEE2E2',
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#FEE2E2',
    minHeight: 48,
    justifyContent: 'center',
  },
  removeButtonText: {
    color: '#EF4444',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 40,
    marginTop: 60,
  },
  emptyIcon: {
    fontSize: 64,
    color: '#D1D5DB',
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    marginBottom: 24,
  },
  actionButton: {
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
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

export default FavoritesScreen;
