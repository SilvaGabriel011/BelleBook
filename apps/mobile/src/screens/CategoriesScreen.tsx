import React, { useEffect } from 'react';
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
import { setCategories, setFilter, setLoading, setError } from '../store/slices/catalogSlice';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import type { Category } from '../store/slices/catalogSlice';

type CategoriesScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Categories'>;

const CategoriesScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation<CategoriesScreenNavigationProp>();
  const { categories, isLoading, error } = useSelector((state: RootState) => state.catalog);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      const categoriesSnapshot = await getDocs(collection(db, 'categories'));
      const categoriesData: Category[] = categoriesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Category[];

      dispatch(setCategories(categoriesData));
    } catch (err) {
      dispatch(setError(err instanceof Error ? err.message : 'Failed to load categories'));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleCategoryPress = (category: Category) => {
    dispatch(setFilter({ categoryId: category.id }));
    navigation.navigate('ServiceList', { categoryId: category.id, categoryName: category.name });
  };

  const renderCategory = ({ item }: { item: Category }) => (
    <TouchableOpacity style={styles.categoryCard} onPress={() => handleCategoryPress(item)}>
      <Image source={{ uri: item.imageUrl }} style={styles.categoryImage} />
      <View style={styles.categoryInfo}>
        <Text style={styles.categoryName}>{item.name}</Text>
        <Text style={styles.categoryDescription}>{item.description}</Text>
        <Text style={styles.serviceCount}>
          {item.serviceCount} {item.serviceCount === 1 ? 'service' : 'services'}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (isLoading && categories.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#8B5CF6" />
        <Text style={styles.loadingText}>Loading categories...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadCategories}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Service Categories</Text>
        <Text style={styles.subtitle}>Browse beauty services by category</Text>
      </View>
      <FlatList
        data={categories}
        renderItem={renderCategory}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
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
  categoryCard: {
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
  categoryImage: {
    width: '100%',
    height: 180,
    backgroundColor: '#E5E7EB',
  },
  categoryInfo: {
    padding: 16,
  },
  categoryName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  categoryDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  serviceCount: {
    fontSize: 12,
    color: '#8B5CF6',
    fontWeight: '500',
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

export default CategoriesScreen;
