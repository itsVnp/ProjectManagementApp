import React, { useState } from 'react';
import {
  View,
  ScrollView,
  Alert,
  StyleSheet,
  Switch,
  TouchableOpacity,
} from 'react-native';
import {
  Text,
  Title,
  Card,
  Button,
  Avatar,
  List,
  Divider,
  TextInput,
  Portal,
  Modal,
} from 'react-native-paper';
import { LinearGradient } from 'react-native-linear-gradient';
import * as Keychain from 'react-native-keychain';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../contexts/AuthContext';
import { User } from '@claro/types';

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation();
  const { user, logout, updateProfile } = useAuth();
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedUser, setEditedUser] = useState<Partial<User>>({
    name: user?.name || '',
    email: user?.email || '',
  });
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(true);
  const [isDarkModeEnabled, setIsDarkModeEnabled] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  const handleUpdateProfile = async () => {
    try {
      await updateProfile(editedUser);
      setIsEditMode(false);
      setIsEditModalVisible(false);
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
              // Simple navigation approach
              (navigation as any).reset({
                index: 0,
                routes: [{ name: 'Login' }],
              });
            } catch (error) {
              console.error('Logout error:', error);
            }
          },
        },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This action cannot be undone. All your data will be permanently deleted.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              'Confirm Deletion',
              'Please type "DELETE" to confirm account deletion',
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Delete',
                  style: 'destructive',
                  onPress: () => {
                    // Implement account deletion
                    Alert.alert('Not Implemented', 'Account deletion will be implemented in a future update');
                  },
                },
              ]
            );
          },
        },
      ]
    );
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getSubscriptionColor = (tier: string) => {
    switch (tier) {
      case 'ENTERPRISE':
        return '#8B5CF6';
      case 'PRO':
        return '#3B82F6';
      case 'FREE':
        return '#10B981';
      default:
        return '#6B7280';
    }
  };

  const getSubscriptionText = (tier: string) => {
    switch (tier) {
      case 'ENTERPRISE':
        return 'Enterprise';
      case 'PRO':
        return 'Pro';
      case 'FREE':
        return 'Free';
      default:
        return tier;
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#6366F1', '#8B5CF6']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Avatar.Text
            size={80}
            label={getInitials(user?.name || '')}
            style={styles.avatar}
          />
          <Title style={styles.userName}>{user?.name}</Title>
          <Text style={styles.userEmail}>{user?.email}</Text>
          <View style={[
            styles.subscriptionBadge,
            { backgroundColor: getSubscriptionColor(user?.subscriptionTier || 'FREE') }
          ]}>
            <Text style={styles.subscriptionText}>
              {getSubscriptionText(user?.subscriptionTier || 'FREE')}
            </Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Account Information */}
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.cardTitle}>Account Information</Title>
            <List.Item
              title="Name"
              description={user?.name}
              left={(props) => <List.Icon {...props} icon="account" />}
              right={(props) => (
                <TouchableOpacity onPress={() => {
                  setEditedUser({ name: user?.name || '', email: user?.email || '' });
                  setIsEditMode(true);
                  setIsEditModalVisible(true);
                }}>
                  <List.Icon
                    {...props}
                    icon="pencil"
                  />
                </TouchableOpacity>
              )}
            />
            <Divider />
            <List.Item
              title="Email"
              description={user?.email}
              left={(props) => <List.Icon {...props} icon="email" />}
            />
            <Divider />
            <List.Item
              title="Role"
              description={user?.role}
              left={(props) => <List.Icon {...props} icon="shield-account" />}
            />
            <Divider />
            <List.Item
              title="Member Since"
              description={user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
              left={(props) => <List.Icon {...props} icon="calendar" />}
            />
          </Card.Content>
        </Card>

        {/* Settings */}
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.cardTitle}>Settings</Title>
            <List.Item
              title="Push Notifications"
              description="Receive notifications for updates"
              left={(props) => <List.Icon {...props} icon="bell" />}
              right={() => (
                <Switch
                  value={isNotificationsEnabled}
                  onValueChange={setIsNotificationsEnabled}
                />
              )}
            />
            <Divider />
            <List.Item
              title="Dark Mode"
              description="Use dark theme"
              left={(props) => <List.Icon {...props} icon="theme-light-dark" />}
              right={() => (
                <Switch
                  value={isDarkModeEnabled}
                  onValueChange={setIsDarkModeEnabled}
                />
              )}
            />
            <Divider />
            <List.Item
              title="Network Status"
              description="Connected"
              left={(props) => (
                <List.Icon
                  {...props}
                  icon="wifi"
                  color="#10B981"
                />
              )}
            />
          </Card.Content>
        </Card>

        {/* Actions */}
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.cardTitle}>Actions</Title>
            <List.Item
              title="Change Password"
              left={(props) => <List.Icon {...props} icon="lock" />}
              onPress={() => Alert.alert('Not Implemented', 'Change password functionality will be implemented in a future update')}
            />
            <Divider />
            <List.Item
              title="Export Data"
              left={(props) => <List.Icon {...props} icon="download" />}
              onPress={() => Alert.alert('Not Implemented', 'Data export will be implemented in a future update')}
            />
            <Divider />
            <List.Item
              title="Privacy Policy"
              left={(props) => <List.Icon {...props} icon="shield" />}
              onPress={() => Alert.alert('Privacy Policy', 'Privacy policy content will be displayed here')}
            />
            <Divider />
            <List.Item
              title="Terms of Service"
              left={(props) => <List.Icon {...props} icon="file-document" />}
              onPress={() => Alert.alert('Terms of Service', 'Terms of service content will be displayed here')}
            />
          </Card.Content>
        </Card>

        {/* Danger Zone */}
        <Card style={[styles.card, styles.dangerCard]}>
          <Card.Content>
            <Title style={[styles.cardTitle, styles.dangerTitle]}>Danger Zone</Title>
            <Button
              mode="outlined"
              onPress={handleLogout}
              style={styles.logoutButton}
              textColor="#EF4444"
              buttonColor="transparent"
            >
              Logout
            </Button>
            <Button
              mode="outlined"
              onPress={handleDeleteAccount}
              style={styles.deleteButton}
              textColor="#EF4444"
              buttonColor="transparent"
            >
              Delete Account
            </Button>
          </Card.Content>
        </Card>

        {/* App Info */}
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.cardTitle}>App Information</Title>
            <List.Item
              title="Version"
              description="1.0.0"
              left={(props) => <List.Icon {...props} icon="information" />}
            />
            <Divider />
            <List.Item
              title="Build"
              description="2025.07.24"
              left={(props) => <List.Icon {...props} icon="code-tags" />}
            />
          </Card.Content>
        </Card>
      </ScrollView>

      {/* Edit Profile Dialog */}
      <Portal>
        <Modal visible={isEditModalVisible} onDismiss={() => setIsEditModalVisible(false)}>
          <Card>
            <Card.Content>
              <Title>Edit Profile</Title>
              <TextInput
                label="Name"
                value={editedUser.name}
                onChangeText={(text) => setEditedUser({ ...editedUser, name: text })}
                mode="outlined"
                style={styles.input}
              />
              <TextInput
                label="Email"
                value={editedUser.email}
                onChangeText={(text) => setEditedUser({ ...editedUser, email: text })}
                mode="outlined"
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </Card.Content>
            <Card.Actions>
              <Button onPress={() => setIsEditModalVisible(false)}>Cancel</Button>
              <Button
                onPress={handleUpdateProfile}
              >
                Save
              </Button>
            </Card.Actions>
          </Card>
        </Modal>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 32,
    paddingHorizontal: 20,
  },
  headerContent: {
    alignItems: 'center',
  },
  avatar: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginBottom: 16,
  },
  userName: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  userEmail: {
    color: '#E0E7FF',
    fontSize: 16,
    marginBottom: 12,
  },
  subscriptionBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  subscriptionText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  card: {
    marginBottom: 16,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  dangerCard: {
    borderColor: '#FEE2E2',
    borderWidth: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  dangerTitle: {
    color: '#EF4444',
  },
  logoutButton: {
    marginBottom: 8,
    borderColor: '#EF4444',
  },
  deleteButton: {
    borderColor: '#EF4444',
  },
  input: {
    marginBottom: 16,
  },
});

export default ProfileScreen; 