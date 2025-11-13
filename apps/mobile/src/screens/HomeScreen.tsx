import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import WebLayout from '../components/WebLayout';
import { responsiveStyles, fontSize, spacing } from '../utils/responsive';
import { isWeb, getDeviceType } from '../utils/platform';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const user = useSelector((state: RootState) => state.auth.user);
  const deviceType = getDeviceType();

  const ServiceCard = ({ title, subtitle, onPress, isPrimary = false }: any) => (
    <TouchableOpacity
      style={[
        responsiveStyles.button,
        isPrimary ? responsiveStyles.primaryButton : responsiveStyles.secondaryButton,
        styles.serviceButton,
      ]}
      onPress={onPress}
    >
      <Text style={[
        responsiveStyles.buttonText,
        { color: isPrimary ? '#fff' : '#8B5CF6' }
      ]}>
        {title}
      </Text>
      {subtitle && (
        <Text style={[
          styles.buttonSubtext,
          { color: isPrimary ? '#E9D5FF' : '#6B7280' }
        ]}>
          {subtitle}
        </Text>
      )}
    </TouchableOpacity>
  );

  return (
    <WebLayout backgroundColor="#F9FAFB">
      <View style={styles.header}>
        <Text style={styles.title}>BelleBook</Text>
        <Text style={styles.subtitle}>Beauty Services Booking</Text>
      </View>

      {user && (
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeText}>Welcome, {user.displayName || user.email}!</Text>
        </View>
      )}

      <View style={[
        styles.section,
        isWeb && deviceType === 'desktop' && styles.desktopSection
      ]}>
        <Text style={responsiveStyles.sectionTitle}>Explore Services</Text>
        <View style={isWeb && deviceType === 'desktop' ? styles.cardGrid : null}>
          <ServiceCard
            title="Browse Categories"
            subtitle="Find services by category"
            onPress={() => navigation.navigate('Categories')}
            isPrimary={true}
          />
          <ServiceCard
            title="View All Services"
            subtitle="Explore our full catalog"
            onPress={() => navigation.navigate('ServiceList', {})}
          />
        </View>
      </View>

      <View style={[
        styles.section,
        isWeb && deviceType === 'desktop' && styles.desktopSection
      ]}>
        <Text style={responsiveStyles.sectionTitle}>Your Account</Text>
        <View style={isWeb && deviceType === 'desktop' ? styles.cardGrid : null}>
          <ServiceCard
            title="My Favorites"
            subtitle="View saved services"
            onPress={() => navigation.navigate('Favorites')}
          />
          <ServiceCard
            title="My Profile"
            subtitle="Manage your account"
            onPress={() => navigation.navigate('Profile')}
          />
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Welcome to BelleBook</Text>
        <Text style={styles.footerSubtext}>
          Discover and book beauty services from professional providers
        </Text>
      </View>
    </WebLayout>
  );
};

const styles = StyleSheet.create({
  serviceButton: {
    marginBottom: spacing('sm'),
    ...(isWeb && {
      transition: 'transform 0.2s ease' as any,
      ':hover': {
        transform: 'translateY(-2px)' as any,
      },
    }),
  },
  buttonSubtext: {
    fontSize: fontSize('sm'),
    marginTop: 4,
  },
  cardGrid: {
    ...(isWeb && {
      display: 'grid' as any,
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' as any,
      gap: spacing('md'),
    }),
  },
  desktopSection: {
    marginBottom: spacing('xl'),
  },
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  contentContainer: {
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 20,
  },
  title: {
    fontSize: fontSize('4xl'),
    fontWeight: 'bold',
    color: '#8B5CF6',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: fontSize('xl'),
    color: '#6B7280',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  primaryButton: {
    backgroundColor: '#8B5CF6',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#8B5CF6',
  },
  secondaryButtonText: {
    color: '#8B5CF6',
    fontSize: 18,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 20,
  },
  footerText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  footerSubtext: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  welcomeContainer: {
    marginBottom: 24,
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: fontSize('lg'),
    color: '#333',
    textAlign: 'center',
  },
});

export default HomeScreen;
