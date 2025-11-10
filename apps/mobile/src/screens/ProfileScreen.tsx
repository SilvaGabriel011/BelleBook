import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { clearUser, updateDisplayName, updateAvatarUrl, setLoading } from '../store/slices/authSlice';
import { signOut, updateProfile } from 'firebase/auth';
import { auth, db, storage } from '../config/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import * as ImagePicker from 'expo-image-picker';

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Profile'>;

const ProfileScreen = () => {
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);

  const [displayName, setDisplayNameLocal] = useState(user?.displayName || '');
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  const handleUpdateProfile = async () => {
    if (!user || !auth.currentUser) {
      Alert.alert('Error', 'No user is currently logged in');
      return;
    }

    if (!displayName.trim()) {
      Alert.alert('Error', 'Display name cannot be empty');
      return;
    }

    setIsLoading(true);
    dispatch(setLoading(true));

    try {
      await updateProfile(auth.currentUser, { displayName });

      await updateDoc(doc(db, 'users', user.id), {
        displayName,
      });

      dispatch(updateDisplayName(displayName));
      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error) {
      console.error('Profile update error:', error);
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
      dispatch(setLoading(false));
    }
  };

  const handlePickImage = async () => {
    if (!user || !auth.currentUser) {
      Alert.alert('Error', 'No user is currently logged in');
      return;
    }

    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert('Permission Required', 'Permission to access camera roll is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled && result.assets[0]) {
      await handleUploadAvatar(result.assets[0].uri);
    }
  };

  const handleUploadAvatar = async (uri: string) => {
    if (!user || !auth.currentUser) {
      return;
    }

    setIsUploadingAvatar(true);

    try {
      const response = await fetch(uri);
      const blob = await response.blob();

      const storageRef = ref(storage, `avatars/${user.id}/${Date.now()}.jpg`);
      await uploadBytes(storageRef, blob);

      const downloadURL = await getDownloadURL(storageRef);

      await updateDoc(doc(db, 'users', user.id), {
        avatarUrl: downloadURL,
      });

      await updateProfile(auth.currentUser, { photoURL: downloadURL });

      dispatch(updateAvatarUrl(downloadURL));
      Alert.alert('Success', 'Avatar updated successfully');
    } catch (error) {
      console.error('Avatar upload error:', error);
      Alert.alert('Error', 'Failed to upload avatar. Please try again.');
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut(auth);
              dispatch(clearUser());
              navigation.navigate('Onboarding');
            } catch (error) {
              console.error('Logout error:', error);
              Alert.alert('Error', 'Failed to logout. Please try again.');
            }
          },
        },
      ]
    );
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No user is currently logged in</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.buttonText}>Go to Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Profile</Text>

        <View style={styles.avatarContainer}>
          <TouchableOpacity onPress={handlePickImage} disabled={isUploadingAvatar}>
            {user.avatarUrl ? (
              <Image source={{ uri: user.avatarUrl }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarPlaceholderText}>
                  {user.displayName ? user.displayName.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                </Text>
              </View>
            )}
            {isUploadingAvatar && (
              <View style={styles.avatarLoading}>
                <ActivityIndicator color="#fff" />
              </View>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.changeAvatarButton}
            onPress={handlePickImage}
            disabled={isUploadingAvatar}
          >
            <Text style={styles.changeAvatarText}>Change Avatar</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.label}>Email</Text>
          <View style={styles.infoBox}>
            <Text style={styles.infoText}>{user.email}</Text>
          </View>

          <Text style={styles.label}>Role</Text>
          <View style={styles.infoBox}>
            <Text style={styles.infoText}>
              {user.role === 'customer' ? 'Customer' : 'Provider'}
            </Text>
          </View>

          <Text style={styles.label}>Display Name</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={displayName}
              onChangeText={setDisplayNameLocal}
              placeholder="Enter display name"
              editable={!isLoading}
            />
          ) : (
            <View style={styles.infoBox}>
              <Text style={styles.infoText}>
                {user.displayName || 'Not set'}
              </Text>
            </View>
          )}

          {isEditing ? (
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.button, styles.buttonSecondary, { flex: 1, marginRight: 8 }]}
                onPress={() => {
                  setDisplayNameLocal(user.displayName || '');
                  setIsEditing(false);
                }}
                disabled={isLoading}
              >
                <Text style={styles.buttonSecondaryText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, { flex: 1, marginLeft: 8 }]}
                onPress={handleUpdateProfile}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Save</Text>
                )}
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={[styles.button, styles.buttonSecondary]}
              onPress={() => setIsEditing(true)}
            >
              <Text style={styles.buttonSecondaryText}>Edit Profile</Text>
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          style={[styles.button, styles.logoutButton]}
          onPress={handleLogout}
        >
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarPlaceholderText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
  },
  avatarLoading: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  changeAvatarButton: {
    marginTop: 12,
  },
  changeAvatarText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
  },
  infoSection: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  infoBox: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    backgroundColor: '#f9f9f9',
  },
  infoText: {
    fontSize: 16,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    fontSize: 16,
  },
  buttonRow: {
    flexDirection: 'row',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonSecondary: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonSecondaryText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
    marginTop: 12,
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
});

export default ProfileScreen;
