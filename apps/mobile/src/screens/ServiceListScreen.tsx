import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  TextInput,
  Modal,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { RootState } from '../store';
import {
  setServices,
  setSearchQuery,
  setFilter,
  clearFilters,
  setLoading,
  setError,
  setSelectedService,
  SortOption,
} from '../store/slices/catalogSlice';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '../config/firebase';
import type { ServiceStyle } from '../store/slices/catalogSlice';

type ServiceListScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ServiceList'>;
type ServiceListScreenRouteProp = RouteProp<RootStackParamList, 'ServiceList'>;

const ServiceListScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation<ServiceListScreenNavigationProp>();
  const route = useRoute<ServiceListScreenRouteProp>();
  const { filteredServices, searchQuery, filters, isLoading, error, favorites } = useSelector(
    (state: RootState) => state.catalog
  );

  const [showFilters, setShowFilters] = useState(false);
  const [tempPriceMin, setTempPriceMin] = useState('');
  const [tempPriceMax, setTempPriceMax] = useState('');

  const categoryId = route.params?.categoryId;
  const categoryName = route.params?.categoryName;

  useEffect(() => {
    if (categoryId) {
      dispatch(setFilter({ categoryId }));
    }
    loadServices();
  }, [categoryId]);

  const loadServices = async () => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      let servicesQuery = query(collection(db, 'service_styles'));

      if (categoryId) {
        servicesQuery = query(
          collection(db, 'service_styles'),
          where('categoryId', '==', categoryId),
          orderBy('likes', 'desc')
        );
      }

      const servicesSnapshot = await getDocs(servicesQuery);
      const servicesData: ServiceStyle[] = servicesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as ServiceStyle[];

      dispatch(setServices(servicesData));
    } catch (err) {
      dispatch(setError(err instanceof Error ? err.message : 'Failed to load services'));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleServicePress = (service: ServiceStyle) => {
    dispatch(setSelectedService(service));
    navigation.navigate('ServiceDetail', { serviceId: service.id });
  };

  const handleSearch = (text: string) => {
    dispatch(setSearchQuery(text));
  };

  const handleSortChange = (sortBy: SortOption) => {
    dispatch(setFilter({ sortBy }));
  };

  const handleApplyFilters = () => {
    const priceMin = tempPriceMin ? parseFloat(tempPriceMin) : null;
    const priceMax = tempPriceMax ? parseFloat(tempPriceMax) : null;
    dispatch(setFilter({ priceMin, priceMax }));
    setShowFilters(false);
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
    setTempPriceMin('');
    setTempPriceMax('');
    setShowFilters(false);
  };

  const isFavorite = (serviceId: string) => favorites.includes(serviceId);

  const renderService = ({ item }: { item: ServiceStyle }) => (
    <TouchableOpacity style={styles.serviceCard} onPress={() => handleServicePress(item)}>
      <Image source={{ uri: item.imageUrl }} style={styles.serviceImage} />
      {isFavorite(item.id) && (
        <View style={styles.favoriteBadge}>
          <Text style={styles.favoriteBadgeText}>♥</Text>
        </View>
      )}
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
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search services..."
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>

      <View style={styles.controlsContainer}>
        <TouchableOpacity style={styles.filterButton} onPress={() => setShowFilters(true)}>
          <Text style={styles.filterButtonText}>Filters</Text>
        </TouchableOpacity>

        <View style={styles.sortContainer}>
          <Text style={styles.sortLabel}>Sort by:</Text>
          <TouchableOpacity
            style={[styles.sortButton, filters.sortBy === 'popularity' && styles.sortButtonActive]}
            onPress={() => handleSortChange('popularity')}
          >
            <Text
              style={[
                styles.sortButtonText,
                filters.sortBy === 'popularity' && styles.sortButtonTextActive,
              ]}
            >
              Popular
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.sortButton, filters.sortBy === 'price-low' && styles.sortButtonActive]}
            onPress={() => handleSortChange('price-low')}
          >
            <Text
              style={[
                styles.sortButtonText,
                filters.sortBy === 'price-low' && styles.sortButtonTextActive,
              ]}
            >
              Price ↑
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.sortButton, filters.sortBy === 'price-high' && styles.sortButtonActive]}
            onPress={() => handleSortChange('price-high')}
          >
            <Text
              style={[
                styles.sortButtonText,
                filters.sortBy === 'price-high' && styles.sortButtonTextActive,
              ]}
            >
              Price ↓
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.resultsCount}>
        {filteredServices.length} {filteredServices.length === 1 ? 'service' : 'services'} found
      </Text>
    </View>
  );

  if (isLoading && filteredServices.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#8B5CF6" />
        <Text style={styles.loadingText}>Loading services...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadServices}>
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
        <Text style={styles.title}>{categoryName || 'All Services'}</Text>
      </View>

      <FlatList
        data={filteredServices}
        renderItem={renderService}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No services found</Text>
            <Text style={styles.emptySubtext}>Try adjusting your search or filters</Text>
          </View>
        }
      />

      <Modal visible={showFilters} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Filter Services</Text>

            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>Price Range</Text>
              <View style={styles.priceInputContainer}>
                <TextInput
                  style={styles.priceInput}
                  placeholder="Min"
                  keyboardType="numeric"
                  value={tempPriceMin}
                  onChangeText={setTempPriceMin}
                />
                <Text style={styles.priceSeparator}>-</Text>
                <TextInput
                  style={styles.priceInput}
                  placeholder="Max"
                  keyboardType="numeric"
                  value={tempPriceMax}
                  onChangeText={setTempPriceMax}
                />
              </View>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.clearButton} onPress={handleClearFilters}>
                <Text style={styles.clearButtonText}>Clear All</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.applyButton} onPress={handleApplyFilters}>
                <Text style={styles.applyButtonText}>Apply Filters</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.closeButton} onPress={() => setShowFilters(false)}>
              <Text style={styles.closeButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  headerContainer: {
    padding: 16,
    backgroundColor: '#fff',
    marginBottom: 8,
  },
  searchContainer: {
    marginBottom: 12,
  },
  searchInput: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  controlsContainer: {
    marginBottom: 12,
  },
  filterButton: {
    backgroundColor: '#8B5CF6',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  filterButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  sortLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginRight: 8,
  },
  sortButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: '#F9FAFB',
    marginRight: 8,
    marginBottom: 4,
  },
  sortButtonActive: {
    backgroundColor: '#8B5CF6',
  },
  sortButtonText: {
    fontSize: 13,
    color: '#6B7280',
  },
  sortButtonTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  resultsCount: {
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
  favoriteBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#EF4444',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteBadgeText: {
    color: '#fff',
    fontSize: 16,
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
  emptyContainer: {
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9CA3AF',
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    minHeight: 300,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 24,
  },
  filterSection: {
    marginBottom: 24,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  priceInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceInput: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  priceSeparator: {
    marginHorizontal: 12,
    fontSize: 16,
    color: '#6B7280',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  clearButton: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  clearButtonText: {
    color: '#6B7280',
    fontSize: 16,
    fontWeight: '600',
  },
  applyButton: {
    flex: 1,
    backgroundColor: '#8B5CF6',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  closeButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#6B7280',
    fontSize: 16,
  },
});

export default ServiceListScreen;
