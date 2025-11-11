import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import HomeScreen from '../screens/HomeScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import ProfileScreen from '../screens/ProfileScreen';
import CategoriesScreen from '../screens/CategoriesScreen';
import ServiceListScreen from '../screens/ServiceListScreen';
import ServiceDetailScreen from '../screens/ServiceDetailScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import BookingFlowScreen from '../screens/BookingFlowScreen';

export type RootStackParamList = {
  Onboarding: undefined;
  Login: undefined;
  Signup: undefined;
  Home: undefined;
  Categories: undefined;
  ServiceList: { categoryId?: string; categoryName?: string };
  ServiceDetail: { serviceId: string };
  Favorites: undefined;
  BookingFlow: { serviceId: string };
  Profile: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  return (
    <Stack.Navigator
      initialRouteName="Onboarding"
      screenOptions={{
        headerShown: false,
      }}
    >
      {!isAuthenticated ? (
        <>
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="Categories" component={CategoriesScreen} />
          <Stack.Screen name="ServiceList" component={ServiceListScreen} />
          <Stack.Screen name="ServiceDetail" component={ServiceDetailScreen} />
          <Stack.Screen name="Favorites" component={FavoritesScreen} />
          <Stack.Screen name="BookingFlow" component={BookingFlowScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;
