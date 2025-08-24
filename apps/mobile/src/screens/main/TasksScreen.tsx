import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Card, Title, Paragraph, Button, Chip, FAB, Checkbox } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const TasksScreen: React.FC = () => {
  const tasks = [
    {
      id: '1',
      title: 'Design homepage mockups',
      description: 'Create wireframes and mockups for the new homepage design',
      status: 'In Progress',
      priority: 'High',
      dueDate: '2024-01-15',
      project: 'Website Redesign',
      projectColor: '#6366F1',
      completed: false,
    },
    {
      id: '2',
      title: 'Set up development environment',
      description: 'Configure local development environment for the mobile app',
      status: 'Todo',
      priority: 'Medium',
      dueDate: '2024-01-20',
      project: 'Mobile App Development',
      projectColor: '#10B981',
      completed: false,
    },
    {
      id: '3',
      title: 'Review marketing materials',
      description: 'Review and approve all marketing materials for Q4 campaign',
      status: 'Completed',
      priority: 'Low',
      dueDate: '2024-01-10',
      project: 'Marketing Campaign',
      projectColor: '#F59E0B',
      completed: true,
    },
    {
      id: '4',
      title: 'Write API documentation',
      description: 'Create comprehensive API documentation for developers',
      status: 'Todo',
      priority: 'High',
      dueDate: '2024-01-25',
      project: 'Website Redesign',
      projectColor: '#6366F1',
      completed: false,
    },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return '#EF4444';
      case 'Medium':
        return '#F59E0B';
      case 'Low':
        return '#10B981';
      default:
        return '#6B7280';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return '#10B981';
      case 'In Progress':
        return '#F59E0B';
      case 'Todo':
        return '#3B82F6';
      default:
        return '#6B7280';
    }
  };

  const TaskCard = ({ task }: { task: any }) => (
    <Card style={[styles.taskCard, task.completed && styles.completedTaskCard]}>
      <Card.Content>
        <View style={styles.taskHeader}>
          <View style={styles.taskInfo}>
            <View style={styles.taskTitleRow}>
              <Checkbox
                status={task.completed ? 'checked' : 'unchecked'}
                onPress={() => {}}
                color="#6366F1"
              />
              <Title style={[styles.taskTitle, task.completed && styles.completedTaskTitle]}>
                {task.title}
              </Title>
            </View>
            <Paragraph style={[styles.taskDescription, task.completed && styles.completedTaskDescription]}>
              {task.description}
            </Paragraph>
          </View>
        </View>
        
        <View style={styles.taskMeta}>
          <View style={styles.chipsContainer}>
            <Chip 
              mode="outlined"
              textStyle={[styles.statusChip, { color: getStatusColor(task.status) }]}
              style={[styles.statusChipContainer, { borderColor: getStatusColor(task.status) }]}
            >
              {task.status}
            </Chip>
            <Chip 
              mode="outlined"
              textStyle={[styles.priorityChip, { color: getPriorityColor(task.priority) }]}
              style={[styles.priorityChipContainer, { borderColor: getPriorityColor(task.priority) }]}
            >
              {task.priority}
            </Chip>
            <Chip 
              mode="outlined"
              textStyle={[styles.projectChip, { color: task.projectColor }]}
              style={[styles.projectChipContainer, { borderColor: task.projectColor }]}
            >
              {task.project}
            </Chip>
          </View>
          
          <View style={styles.taskFooter}>
            <View style={styles.dueDateContainer}>
              <MaterialCommunityIcons name="calendar" size={16} color="#6B7280" />
              <Text style={styles.dueDateText}>
                Due {new Date(task.dueDate).toLocaleDateString()}
              </Text>
            </View>
            <TouchableOpacity style={styles.moreButton}>
              <MaterialCommunityIcons name="dots-vertical" size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>
        </View>
      </Card.Content>
    </Card>
  );

  const stats = [
    { label: 'Total', value: '4', color: '#6366F1' },
    { label: 'Completed', value: '1', color: '#10B981' },
    { label: 'In Progress', value: '1', color: '#F59E0B' },
    { label: 'Todo', value: '2', color: '#3B82F6' },
  ];

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Tasks</Text>
          <Text style={styles.headerSubtitle}>Manage your tasks and track progress</Text>
        </View>

        {/* Stats Overview */}
        <View style={styles.statsContainer}>
          {stats.map((stat, index) => (
            <View key={index} style={styles.statCard}>
              <Text style={[styles.statNumber, { color: stat.color }]}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Filter Tabs */}
        <View style={styles.filterContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TouchableOpacity style={[styles.filterTab, styles.activeFilterTab]}>
              <Text style={[styles.filterText, styles.activeFilterText]}>All</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterTab}>
              <Text style={styles.filterText}>Todo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterTab}>
              <Text style={styles.filterText}>In Progress</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterTab}>
              <Text style={styles.filterText}>Completed</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Tasks List */}
        <View style={styles.tasksContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Your Tasks</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          
          {tasks.length === 0 ? (
            <Card style={styles.emptyCard}>
              <Card.Content style={styles.emptyContent}>
                <View style={styles.emptyIcon}>
                  <MaterialCommunityIcons name="checkbox-blank-outline" size={48} color="#9CA3AF" />
                </View>
                <Title style={styles.emptyTitle}>No Tasks Yet</Title>
                <Paragraph style={styles.emptyDescription}>
                  Create your first task to get started with task management
                </Paragraph>
                <Button 
                  mode="contained" 
                  style={styles.createButton}
                  labelStyle={styles.createButtonLabel}
                >
                  Create Task
                </Button>
              </Card.Content>
            </Card>
          ) : (
            tasks.map((task) => (
              <TaskCard key={task.id} task={task} />
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
                New Task
              </Button>
              <Button 
                mode="outlined" 
                icon="filter-variant"
                style={styles.quickActionButton}
                labelStyle={styles.quickActionLabel}
              >
                Filter
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
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
    textAlign: 'center',
  },
  filterContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
  },
  activeFilterTab: {
    backgroundColor: '#6366F1',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  activeFilterText: {
    color: '#FFFFFF',
  },
  tasksContainer: {
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
  taskCard: {
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
  completedTaskCard: {
    opacity: 0.7,
    backgroundColor: '#F9FAFB',
  },
  taskHeader: {
    marginBottom: 12,
  },
  taskInfo: {
    flex: 1,
  },
  taskTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    flex: 1,
    marginLeft: 8,
  },
  completedTaskTitle: {
    textDecorationLine: 'line-through',
    color: '#9CA3AF',
  },
  taskDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginLeft: 48,
  },
  completedTaskDescription: {
    color: '#9CA3AF',
  },
  taskMeta: {
    marginTop: 12,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  statusChip: {
    fontSize: 12,
    fontWeight: '600',
  },
  statusChipContainer: {
    borderWidth: 1,
  },
  priorityChip: {
    fontSize: 12,
    fontWeight: '600',
  },
  priorityChipContainer: {
    borderWidth: 1,
  },
  projectChip: {
    fontSize: 12,
    fontWeight: '600',
  },
  projectChipContainer: {
    borderWidth: 1,
  },
  taskFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dueDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dueDateText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  moreButton: {
    padding: 4,
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

export default TasksScreen; 