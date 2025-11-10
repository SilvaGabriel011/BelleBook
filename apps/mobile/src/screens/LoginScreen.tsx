import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useDispatch } from 'react-redux';
import { setUser, setLoading, setError } from '../store/slices/authSlice';
import { signInWithEmailAndPassword, sendSignInLinkToEmail } from 'firebase/auth';
import { auth, db } from '../config/firebase';
import { doc, getDoc } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

const LoginScreen = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const dispatch = useDispatch();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [authMethod, setAuthMethod] = useState<'email' | 'magic-link' | 'phone'>('email');

  const handleEmailPasswordLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    setIsLoading(true);
    dispatch(setLoading(true));

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userDoc = await getDoc(doc(db, 'users', user.uid));
      const userData = userDoc.data();

      dispatch(
        setUser({
          id: user.uid,
          email: user.email || '',
          role: userData?.role || 'customer',
          displayName: userData?.displayName || user.displayName || '',
          avatarUrl: userData?.avatarUrl || '',
        })
      );

      navigation.navigate('Home');
    } catch (error) {
      console.error('Login error:', error);
      const err = error as { code?: string };
      let errorMessage = 'Failed to login. Please try again.';

      if (err.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email.';
      } else if (err.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password.';
      } else if (err.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address.';
      } else if (err.code === 'auth/user-disabled') {
        errorMessage = 'This account has been disabled.';
      }

      Alert.alert('Login Failed', errorMessage);
      dispatch(setError(errorMessage));
    } finally {
      setIsLoading(false);
      dispatch(setLoading(false));
    }
  };

  const handleMagicLinkLogin = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    setIsLoading(true);
    dispatch(setLoading(true));

    try {
      const actionCodeSettings = {
        url: 'https://bellebook.app/finishSignIn',
        handleCodeInApp: true,
      };

      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      await AsyncStorage.setItem('emailForSignIn', email);

      Alert.alert(
        'Check Your Email',
        'We sent you a magic link! Click the link in your email to sign in.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Magic link error:', error);
      const err = error as { code?: string };
      let errorMessage = 'Failed to send magic link. Please try again.';

      if (err.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address.';
      }

      Alert.alert('Error', errorMessage);
      dispatch(setError(errorMessage));
    } finally {
      setIsLoading(false);
      dispatch(setLoading(false));
    }
  };

  const handlePhoneLogin = async () => {
    if (!phoneNumber) {
      Alert.alert('Error', 'Please enter your phone number');
      return;
    }

    setIsLoading(true);
    dispatch(setLoading(true));

    try {
      Alert.alert(
        'Phone Authentication',
        'Phone authentication requires additional setup. Please use email/password or magic link for now.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Phone login error:', error);
      Alert.alert('Error', 'Failed to send verification code. Please try again.');
      dispatch(setError('Failed to send verification code'));
    } finally {
      setIsLoading(false);
      dispatch(setLoading(false));
    }
  };

  const handleLogin = () => {
    if (authMethod === 'email') {
      handleEmailPasswordLogin();
    } else if (authMethod === 'magic-link') {
      handleMagicLinkLogin();
    } else if (authMethod === 'phone') {
      handlePhoneLogin();
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to continue</Text>

          <View style={styles.authMethodContainer}>
            <TouchableOpacity
              style={[
                styles.authMethodButton,
                authMethod === 'email' && styles.authMethodButtonActive,
              ]}
              onPress={() => setAuthMethod('email')}
            >
              <Text
                style={[
                  styles.authMethodText,
                  authMethod === 'email' && styles.authMethodTextActive,
                ]}
              >
                Email
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.authMethodButton,
                authMethod === 'magic-link' && styles.authMethodButtonActive,
              ]}
              onPress={() => setAuthMethod('magic-link')}
            >
              <Text
                style={[
                  styles.authMethodText,
                  authMethod === 'magic-link' && styles.authMethodTextActive,
                ]}
              >
                Magic Link
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.authMethodButton,
                authMethod === 'phone' && styles.authMethodButtonActive,
              ]}
              onPress={() => setAuthMethod('phone')}
            >
              <Text
                style={[
                  styles.authMethodText,
                  authMethod === 'phone' && styles.authMethodTextActive,
                ]}
              >
                Phone
              </Text>
            </TouchableOpacity>
          </View>

          {authMethod === 'email' && (
            <>
              <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                editable={!isLoading}
              />
              <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                editable={!isLoading}
              />
            </>
          )}

          {authMethod === 'magic-link' && (
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              editable={!isLoading}
            />
          )}

          {authMethod === 'phone' && (
            <TextInput
              style={styles.input}
              placeholder="Phone Number (+1234567890)"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
              editable={!isLoading}
            />
          )}

          <TouchableOpacity
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>
                {authMethod === 'email'
                  ? 'Sign In'
                  : authMethod === 'magic-link'
                    ? 'Send Magic Link'
                    : 'Send Code'}
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => navigation.navigate('Signup')}
            disabled={isLoading}
          >
            <Text style={styles.linkText}>
              Don&apos;t have an account? <Text style={styles.linkTextBold}>Sign Up</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 32,
    textAlign: 'center',
  },
  authMethodContainer: {
    flexDirection: 'row',
    marginBottom: 24,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    padding: 4,
  },
  authMethodButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 6,
  },
  authMethodButtonActive: {
    backgroundColor: '#007AFF',
  },
  authMethodText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  authMethodTextActive: {
    color: '#fff',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  linkButton: {
    marginTop: 16,
    alignItems: 'center',
  },
  linkText: {
    fontSize: 14,
    color: '#666',
  },
  linkTextBold: {
    fontWeight: '600',
    color: '#007AFF',
  },
});

export default LoginScreen;
