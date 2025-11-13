import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { NavigationContainer, LinkingOptions } from '@react-navigation/native';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import * as Linking from 'expo-linking';
import { store } from './src/store';
import AppNavigator from './src/navigation/AppNavigator';
import { auth, db } from './src/config/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { setUser, clearUser, setLoading } from './src/store/slices/authSlice';
import { isWeb } from './src/utils/platform';
import { RootStackParamList } from './src/navigation/AppNavigator';
import ErrorBoundary from './src/components/ErrorBoundary';

// Web URL configuration
const linking: LinkingOptions<RootStackParamList> = {
  prefixes: [
    Linking.createURL('/'),
    'http://localhost:8081',
    'http://localhost:8082',
    'http://localhost:8083',
  ],
  config: {
    screens: {
      Home: '',
      Onboarding: 'welcome',
      Login: 'login',
      Signup: 'signup',
      Categories: 'categories',
      ServiceList: 'services',
      ServiceDetail: 'service/:serviceId',
      BookingFlow: 'booking/:serviceId',
      Favorites: 'favorites',
      Profile: 'profile',
    },
  },
};

function AppContent() {
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      store.dispatch(setLoading(true));

      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          const userData = userDoc.data();

          store.dispatch(
            setUser({
              id: firebaseUser.uid,
              email: firebaseUser.email || '',
              role: userData?.role || 'customer',
              displayName: userData?.displayName || firebaseUser.displayName || '',
              avatarUrl: userData?.avatarUrl || firebaseUser.photoURL || '',
            })
          );
        } catch (error) {
          console.error('Error fetching user data:', error);
          store.dispatch(clearUser());
        }
      } else {
        store.dispatch(clearUser());
      }

      store.dispatch(setLoading(false));
      setIsInitializing(false);
    });

    return () => unsubscribe();
  }, []);

  if (isInitializing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <NavigationContainer linking={isWeb ? linking : undefined}>
      {isWeb ? (
        <View style={styles.webContainer}>
          <AppNavigator />
        </View>
      ) : (
        <>
          <AppNavigator />
          <StatusBar style="auto" />
        </>
      )}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <SafeAreaProvider>
          <AppContent />
        </SafeAreaProvider>
      </Provider>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  webContainer: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    ...(isWeb && {
      height: '100vh' as any,
      overflow: 'auto' as any,
    }),
  },
});
