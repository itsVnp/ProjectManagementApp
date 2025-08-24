import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Card, Title, Paragraph, Button, Chip, FAB } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const ProjectsScreen: React.FC = () => {
  const projects = [
    {
      id: '1',
      name: 'Website Redesign',
      description: 'Complete overhaul of company website with modern design',
      status: 'In Progress',
      progress: 65,
      color: '#6366F1',
      tasks: 12,
      completed: 8,
    },
    {
      id: '2',
      name: 'Mobile App Development',
      description: 'iOS and Android app for customer engagement',
      status: 'Planning',
      progress: 25,
      color: '#10B981',
      tasks: 8,
      completed: 2,
    },
    {
      id: '3',
      name: 'Marketing Campaign',
      description: 'Q4 marketing campaign for product launch',
      status: 'Completed',
      progress: 100,
      color: '#F59E0B',
      tasks: 15,
      completed: 15,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return '#10B981';
      case 'In Progress':
        return '#F59E0B';
      case 'Planning':
        return '#3B82F6';
      default:
        return '#6B7280';
    }
  };

  const ProjectCard = ({ project }: { project: any }) => (
    <Card style={styles.projectCard}>
      <Card.Content>
        <View style={styles.projectHeader}>
          <View style={[styles.projectIcon, { backgroundColor: `${project.color}20` }]}>
            <MaterialCommunityIcons 
              name="folder" 
              size={24} 
              color={project.color} 
            />
          </View>
          <View style={styles.projectInfo}>
            <Title style={styles.projectTitle}>{project.name}</Title>
            <Chip 
              mode="outlined"
              textStyle={[styles.statusChip, { color: getStatusColor(project.status) }]}
              style={[styles.statusChipContainer, { borderColor: getStatusColor(project.status) }]}
            >
              {project.status}
            </Chip>
          </View>
        </View>
        
        <Paragraph style={styles.projectDescription}>
          {project.description}
        </Paragraph>
        
        <View style={styles.progressContainer}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressText}>Progress</Text>
            <Text style={styles.progressPercentage}>{project.progress}%</Text>
          </View>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { 
                  width: `${project.progress}%`,
                  backgroundColor: project.color 
                }
              ]} 
            />
          </View>
        </View>
        
        <View style={styles.projectStats}>
          <View style={styles.statItem}>
            <MaterialCommunityIcons name="checkbox-marked-outline" size={16} color="#6B7280" />
            <Text style={styles.statText}>{project.completed}/{project.tasks} tasks</Text>
          </View>
          <View style={styles.statItem}>
            <MaterialCommunityIcons name="calendar" size={16} color="#6B7280" />
            <Text style={styles.statText}>Due in 5 days</Text>
          </View>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Projects</Text>
          <Text style={styles.headerSubtitle}>Manage your projects and track progress</Text>
        </View>

        {/* Stats Overview */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <MaterialCommunityIcons name="folder-multiple" size={24} color="#6366F1" />
            <Text style={styles.statNumber}>3</Text>
            <Text style={styles.statLabel}>Total Projects</Text>
          </View>
          <View style={styles.statCard}>
            <MaterialCommunityIcons name="check-circle" size={24} color="#10B981" />
            <Text style={styles.statNumber}>1</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
          <View style={styles.statCard}>
            <MaterialCommunityIcons name="clock-outline" size={24} color="#F59E0B" />
            <Text style={styles.statNumber}>2</Text>
            <Text style={styles.statLabel}>In Progress</Text>
          </View>
        </View>

        {/* Projects List */}
        <View style={styles.projectsContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Your Projects</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          
          {projects.length === 0 ? (
            <Card style={styles.emptyCard}>
              <Card.Content style={styles.emptyContent}>
                <View style={styles.emptyIcon}>
                  <MaterialCommunityIcons name="folder-plus" size={48} color="#9CA3AF" />
                </View>
                <Title style={styles.emptyTitle}>No Projects Yet</Title>
                <Paragraph style={styles.emptyDescription}>
                  Create your first project to get started with project management
                </Paragraph>
                <Button 
                  mode="contained" 
                  style={styles.createButton}
                  labelStyle={styles.createButtonLabel}
                >
                  Create Project
                </Button>
              </Card.Content>
            </Card>
          ) : (
            projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))
          )}
        </View>

        {/* Quick Actions */}
        <Card style={styles.quickActionsCard}>
          <Card.Content>
            <Title style={styles.quickActionsTitle}>Quick Actions</Title>
            <View style={styles.quickActionsButtons}>
              <Button 
                mode="outlined" 
                icon="plus"
                style={styles.quickActionButton}
                labelStyle={styles.quickActionLabel}
              >
                New Project
              </Button>
              <Button 
                mode="outlined" 
                icon="import"
                style={styles.quickActionButton}
                labelStyle={styles.quickActionLabel}
              >
                Import
              </Button>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => {}}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 40,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 4,
  },
  headerSubtitle: {
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
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1F2937',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
    textAlign: 'center',
  },
  projectsContainer: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },
  viewAllText: {
    fontSize: 14,
    color: '#6366F1',
    fontWeight: '600',
  },
  projectCard: {
    marginBottom: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  projectHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  projectIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  projectInfo: {
    flex: 1,
  },
  projectTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  statusChip: {
    fontSize: 12,
    fontWeight: '600',
  },
  statusChipContainer: {
    alignSelf: 'flex-start',
    borderWidth: 1,
  },
  projectDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 16,
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  progressPercentage: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  projectStats: {
    flexDirection: 'row',
    gap: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  emptyCard: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  emptyContent: {
    alignItems: 'center',
    padding: 40,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#6B7280',
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  createButton: {
    backgroundColor: '#6366F1',
    borderRadius: 8,
    paddingHorizontal: 24,
  },
  createButtonLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  quickActionsCard: {
    margin: 20,
    marginTop: 0,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  quickActionsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
  },
  quickActionsButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  quickActionButton: {
    flex: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
  },
  quickActionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#6366F1',
  },
});

export default ProjectsScreen; 