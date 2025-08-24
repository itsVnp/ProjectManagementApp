import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Card, Title, Paragraph, Button, Chip, Avatar } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const DashboardScreen: React.FC = () => {
  const stats = [
    { number: '0', label: 'Projects', icon: 'folder-multiple', color: '#6366F1' },
    { number: '0', label: 'Tasks', icon: 'checkbox-marked-outline', color: '#10B981' },
    { number: '0', label: 'Completed', icon: 'check-circle', color: '#F59E0B' },
  ];

  const recentActivities = [
    { id: 1, type: 'project', title: 'No recent projects', time: 'Get started', icon: 'folder-plus' },
    { id: 2, type: 'task', title: 'No recent tasks', time: 'Create your first task', icon: 'plus-circle' },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.greeting}>Welcome to Claro</Text>
        <Text style={styles.subtitle}>Let's get you organized</Text>
      </View>
      
      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        {stats.map((stat, index) => (
          <Card key={index} style={styles.statCard}>
            <Card.Content style={styles.statContent}>
              <View style={[styles.iconContainer, { backgroundColor: `${stat.color}20` }]}>
                <MaterialCommunityIcons 
                  name={stat.icon as any} 
                  size={24} 
                  color={stat.color} 
                />
              </View>
              <Text style={styles.statNumber}>{stat.number}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </Card.Content>
          </Card>
        ))}
      </View>

      {/* Quick Actions */}
      <Card style={styles.actionCard}>
        <Card.Content>
          <Title style={styles.cardTitle}>Quick Actions</Title>
          <View style={styles.actionButtons}>
            <Button 
              mode="contained" 
              style={[styles.actionButton, { backgroundColor: '#6366F1' }]}
              labelStyle={styles.actionButtonLabel}
            >
              New Project
            </Button>
            <Button 
              mode="contained" 
              style={[styles.actionButton, { backgroundColor: '#10B981' }]}
              labelStyle={styles.actionButtonLabel}
            >
              New Task
            </Button>
          </View>
        </Card.Content>
      </Card>

      {/* Recent Activity */}
      <Card style={styles.activityCard}>
        <Card.Content>
          <Title style={styles.cardTitle}>Recent Activity</Title>
          {recentActivities.map((activity) => (
            <View key={activity.id} style={styles.activityItem}>
              <View style={styles.activityIcon}>
                <MaterialCommunityIcons 
                  name={activity.icon as any} 
                  size={20} 
                  color="#6B7280" 
                />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>{activity.title}</Text>
                <Text style={styles.activityTime}>{activity.time}</Text>
              </View>
            </View>
          ))}
        </Card.Content>
      </Card>

      {/* Tips Card */}
      <Card style={styles.tipsCard}>
        <Card.Content>
          <Title style={styles.cardTitle}>💡 Pro Tip</Title>
          <Paragraph style={styles.tipText}>
            Start by creating your first project. Break it down into smaller tasks to stay organized and track your progress effectively.
          </Paragraph>
          <Button 
            mode="outlined" 
            style={styles.tipButton}
            labelStyle={styles.tipButtonLabel}
          >
            Learn More
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    padding: 20,
    paddingTop: 40,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  greeting: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statContent: {
    alignItems: 'center',
    padding: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
    textAlign: 'center',
  },
  actionCard: {
    margin: 20,
    marginTop: 0,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    borderRadius: 8,
    elevation: 0,
  },
  actionButtonLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  activityCard: {
    margin: 20,
    marginTop: 0,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
    color: '#6B7280',
  },
  tipsCard: {
    margin: 20,
    marginTop: 0,
    marginBottom: 40,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    backgroundColor: '#FEF3C7',
  },
  tipText: {
    fontSize: 14,
    color: '#92400E',
    lineHeight: 20,
    marginBottom: 16,
  },
  tipButton: {
    borderColor: '#F59E0B',
    borderRadius: 8,
  },
  tipButtonLabel: {
    color: '#92400E',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default DashboardScreen; 