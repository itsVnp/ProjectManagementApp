import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Use enum values as strings
const UserRole = {
  USER: 'USER',
  ADMIN: 'ADMIN',
  MODERATOR: 'MODERATOR'
} as const;

const TaskStatus = {
  TODO: 'TODO',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  ARCHIVED: 'ARCHIVED'
} as const;

const TaskPriority = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  URGENT: 'URGENT'
} as const;

const ProjectStatus = {
  ACTIVE: 'ACTIVE',
  ARCHIVED: 'ARCHIVED',
  COMPLETED: 'COMPLETED'
} as const;

const dummyUsers = [
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    role: UserRole.USER
  },
  {
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'password123',
    role: UserRole.USER
  },
  {
    name: 'Mike Johnson',
    email: 'mike@example.com',
    password: 'password123',
    role: UserRole.USER
  },
  {
    name: 'Sarah Wilson',
    email: 'sarah@example.com',
    password: 'password123',
    role: UserRole.USER
  }
];

const dummyProjects = [
  {
    name: 'Website Redesign',
    description: 'Complete redesign of the company website with modern UI/UX',
    color: '#3B82F6',
    isPublic: false,
    status: ProjectStatus.ACTIVE
  },
  {
    name: 'Mobile App Development',
    description: 'Build a new mobile app for iOS and Android platforms',
    color: '#10B981',
    isPublic: true,
    status: ProjectStatus.ACTIVE
  },
  {
    name: 'Marketing Campaign',
    description: 'Launch a comprehensive marketing campaign for Q4',
    color: '#F59E0B',
    isPublic: false,
    status: ProjectStatus.ACTIVE
  },
  {
    name: 'Product Launch',
    description: 'Prepare for the launch of our new product line',
    color: '#EF4444',
    isPublic: true,
    status: ProjectStatus.ACTIVE
  },
  {
    name: 'Customer Support System',
    description: 'Implement a new customer support ticketing system',
    color: '#8B5CF6',
    isPublic: false,
    status: ProjectStatus.ACTIVE
  }
];

const dummyTasks = [
  // Website Redesign Tasks
  {
    title: 'Design Homepage Mockup',
    description: 'Create wireframes and mockups for the new homepage design',
    status: TaskStatus.COMPLETED,
    priority: TaskPriority.HIGH,
    estimatedHours: 8,
    tags: ['design', 'ui/ux']
  },
  {
    title: 'Implement Responsive Layout',
    description: 'Code the responsive layout for all screen sizes',
    status: TaskStatus.IN_PROGRESS,
    priority: TaskPriority.HIGH,
    estimatedHours: 12,
    tags: ['development', 'responsive']
  },
  {
    title: 'Optimize Performance',
    description: 'Optimize website loading speed and performance',
    status: TaskStatus.TODO,
    priority: TaskPriority.MEDIUM,
    estimatedHours: 6,
    tags: ['performance', 'optimization']
  },
  {
    title: 'Content Migration',
    description: 'Migrate existing content to the new design',
    status: TaskStatus.TODO,
    priority: TaskPriority.LOW,
    estimatedHours: 4,
    tags: ['content', 'migration']
  },

  // Mobile App Tasks
  {
    title: 'Setup React Native Project',
    description: 'Initialize the React Native project with proper configuration',
    status: TaskStatus.COMPLETED,
    priority: TaskPriority.HIGH,
    estimatedHours: 4,
    tags: ['setup', 'react-native']
  },
  {
    title: 'Design App Screens',
    description: 'Create UI designs for all app screens',
    status: TaskStatus.IN_PROGRESS,
    priority: TaskPriority.HIGH,
    estimatedHours: 16,
    tags: ['design', 'mobile']
  },
  {
    title: 'Implement Authentication',
    description: 'Add user authentication and login functionality',
    status: TaskStatus.TODO,
    priority: TaskPriority.HIGH,
    estimatedHours: 8,
    tags: ['auth', 'security']
  },
  {
    title: 'API Integration',
    description: 'Integrate backend APIs with the mobile app',
    status: TaskStatus.TODO,
    priority: TaskPriority.MEDIUM,
    estimatedHours: 10,
    tags: ['api', 'integration']
  },

  // Marketing Campaign Tasks
  {
    title: 'Market Research',
    description: 'Conduct market research for target audience analysis',
    status: TaskStatus.COMPLETED,
    priority: TaskPriority.HIGH,
    estimatedHours: 12,
    tags: ['research', 'marketing']
  },
  {
    title: 'Create Campaign Materials',
    description: 'Design banners, social media posts, and email templates',
    status: TaskStatus.IN_PROGRESS,
    priority: TaskPriority.MEDIUM,
    estimatedHours: 20,
    tags: ['design', 'marketing']
  },
  {
    title: 'Social Media Strategy',
    description: 'Develop comprehensive social media strategy',
    status: TaskStatus.TODO,
    priority: TaskPriority.MEDIUM,
    estimatedHours: 8,
    tags: ['social-media', 'strategy']
  },
  {
    title: 'Launch Campaign',
    description: 'Execute the marketing campaign across all channels',
    status: TaskStatus.TODO,
    priority: TaskPriority.HIGH,
    estimatedHours: 6,
    tags: ['launch', 'execution']
  },

  // Product Launch Tasks
  {
    title: 'Product Testing',
    description: 'Conduct thorough testing of the new product',
    status: TaskStatus.IN_PROGRESS,
    priority: TaskPriority.URGENT,
    estimatedHours: 16,
    tags: ['testing', 'quality']
  },
  {
    title: 'Prepare Launch Event',
    description: 'Organize and prepare for the product launch event',
    status: TaskStatus.TODO,
    priority: TaskPriority.HIGH,
    estimatedHours: 12,
    tags: ['event', 'launch']
  },
  {
    title: 'Create Marketing Materials',
    description: 'Design product brochures and promotional materials',
    status: TaskStatus.TODO,
    priority: TaskPriority.MEDIUM,
    estimatedHours: 10,
    tags: ['design', 'marketing']
  },
  {
    title: 'Train Sales Team',
    description: 'Train the sales team on the new product features',
    status: TaskStatus.TODO,
    priority: TaskPriority.MEDIUM,
    estimatedHours: 8,
    tags: ['training', 'sales']
  },

  // Customer Support Tasks
  {
    title: 'Evaluate Support Systems',
    description: 'Research and evaluate different support system options',
    status: TaskStatus.COMPLETED,
    priority: TaskPriority.HIGH,
    estimatedHours: 8,
    tags: ['research', 'evaluation']
  },
  {
    title: 'Configure Support Platform',
    description: 'Set up and configure the chosen support platform',
    status: TaskStatus.IN_PROGRESS,
    priority: TaskPriority.HIGH,
    estimatedHours: 12,
    tags: ['setup', 'configuration']
  },
  {
    title: 'Train Support Team',
    description: 'Train the support team on the new system',
    status: TaskStatus.TODO,
    priority: TaskPriority.MEDIUM,
    estimatedHours: 6,
    tags: ['training', 'support']
  },
  {
    title: 'Migrate Existing Tickets',
    description: 'Migrate existing support tickets to the new system',
    status: TaskStatus.TODO,
    priority: TaskPriority.LOW,
    estimatedHours: 4,
    tags: ['migration', 'data']
  }
];

async function seed() {
  console.log('🌱 Starting database seeding...');

  try {
    // Clear existing data
    await prisma.comment.deleteMany();
    await prisma.task.deleteMany();
    await prisma.projectMember.deleteMany();
    await prisma.project.deleteMany();
    await prisma.user.deleteMany();

    console.log('✅ Cleared existing data');

    // Create users
    const users = [];
    for (const userData of dummyUsers) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const user = await prisma.user.create({
        data: {
          name: userData.name,
          email: userData.email,
          password: hashedPassword,
          role: userData.role
        }
      });
      users.push(user);
    }

    console.log('✅ Created users');

    // Create projects
    const projects = [];
    for (const projectData of dummyProjects) {
      const project = await prisma.project.create({
        data: {
          name: projectData.name,
          description: projectData.description,
          color: projectData.color,
          isPublic: projectData.isPublic,
          status: projectData.status,
          ownerId: users[0]!.id, // John Doe owns all projects
          members: {
            create: [
              { userId: users[0]!.id, role: UserRole.ADMIN },
              { userId: users[1]!.id, role: UserRole.USER },
              { userId: users[2]!.id, role: UserRole.USER }
            ]
          }
        }
      });
      projects.push(project);
    }

    console.log('✅ Created projects');

    // Create tasks
    let taskIndex = 0;
    for (let i = 0; i < projects.length; i++) {
      const project = projects[i]!;
      const tasksForProject = dummyTasks.slice(i * 4, (i + 1) * 4);
      
      for (const taskData of tasksForProject) {
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + Math.floor(Math.random() * 30) + 1);

        await prisma.task.create({
          data: {
            title: taskData.title,
            description: taskData.description,
            status: taskData.status,
            priority: taskData.priority,
            dueDate: dueDate,
            estimatedHours: taskData.estimatedHours,
            tags: taskData.tags,
            projectId: project.id,
            creatorId: users[Math.floor(Math.random() * users.length)]!.id,
            assigneeId: users[Math.floor(Math.random() * users.length)]!.id
          }
        });
        taskIndex++;
      }
    }

    console.log('✅ Created tasks');

    // Add some comments to tasks
    const tasks = await prisma.task.findMany();
    const comments = [
      'Great progress on this task!',
      'Need to review this implementation.',
      'This looks good, ready for testing.',
      'Please add more details to the documentation.',
      'The design looks perfect!',
      'Can we schedule a meeting to discuss this?',
      'This is ready for the next phase.',
      'Need to update the requirements.',
      'Excellent work on this feature!',
      'Let\'s prioritize this for the next sprint.'
    ];

    for (let i = 0; i < 20; i++) {
      const randomTask = tasks[Math.floor(Math.random() * tasks.length)]!;
      const randomUser = users[Math.floor(Math.random() * users.length)]!;
      const randomComment = comments[Math.floor(Math.random() * comments.length)]!;

      await prisma.comment.create({
        data: {
          content: randomComment,
          taskId: randomTask.id,
          userId: randomUser.id
        }
      });
    }

    console.log('✅ Created comments');

    console.log('🎉 Database seeding completed successfully!');
    console.log(`📊 Created ${users.length} users, ${projects.length} projects, ${tasks.length} tasks, and 20 comments`);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seed function
seed()
  .then(() => {
    console.log('✅ Seeding completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }); 