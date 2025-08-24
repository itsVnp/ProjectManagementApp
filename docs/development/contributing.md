# Contributing to Claro

Thank you for your interest in contributing to Claro! This document provides guidelines and information for contributors.

## 🚀 Quick Start

1. **Fork the repository**
2. **Clone your fork**: `git clone https://github.com/YOUR_USERNAME/claro.git`
3. **Set up the development environment**: `npm run setup`
4. **Create a feature branch**: `git checkout -b feature/amazing-feature`
5. **Make your changes**
6. **Run tests**: `npm test`
7. **Commit your changes**: `git commit -m 'feat: add amazing feature'`
8. **Push to your branch**: `git push origin feature/amazing-feature`
9. **Open a Pull Request**

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Development Setup](#development-setup)
- [Coding Standards](#coding-standards)
- [Git Workflow](#git-workflow)
- [Testing Guidelines](#testing-guidelines)
- [Pull Request Process](#pull-request-process)
- [Release Process](#release-process)
- [Getting Help](#getting-help)

## 🤝 Code of Conduct

We are committed to providing a welcoming and inspiring community for all. Please read our [Code of Conduct](CODE_OF_CONDUCT.md) to keep our community approachable and respectable.

## 🛠️ Development Setup

### Prerequisites

- **Node.js**: 18.0.0 or higher
- **npm**: 9.0.0 or higher
- **Git**: Latest version
- **React Native CLI**: For mobile development
- **Xcode**: For iOS development (macOS only)
- **Android Studio**: For Android development
- **PostgreSQL**: 14.0 or higher
- **Redis**: 6.0 or higher

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/claro-app/claro.git
cd claro
```

2. **Install dependencies**
```bash
npm run install:all
```

3. **Set up environment variables**
```bash
npm run setup:env
```

4. **Set up database**
```bash
npm run setup:db
```

5. **Start development servers**
```bash
npm run dev
```

### Development Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start all development servers |
| `npm run dev:backend` | Start backend server only |
| `npm run dev:web` | Start web app only |
| `npm run dev:mobile` | Start mobile app only |
| `npm test` | Run all tests |
| `npm run lint` | Run linting |
| `npm run lint:fix` | Fix linting issues |
| `npm run type-check` | Run TypeScript type checking |
| `npm run build` | Build all applications |

## 📝 Coding Standards

### TypeScript

- Use TypeScript for all new code
- Enable strict mode in `tsconfig.json`
- Use explicit types instead of `any`
- Prefer interfaces over types for object shapes
- Use enums for constants

```typescript
// ✅ Good
interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

enum TaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed'
}

// ❌ Bad
const user: any = {
  id: '123',
  name: 'John'
};
```

### React/React Native

- Use functional components with hooks
- Prefer named exports over default exports
- Use proper prop types and interfaces
- Implement proper error boundaries
- Use React.memo for expensive components

```typescript
// ✅ Good
interface TaskCardProps {
  task: Task;
  onComplete: (taskId: string) => void;
  onEdit: (task: Task) => void;
}

export const TaskCard: React.FC<TaskCardProps> = React.memo(({
  task,
  onComplete,
  onEdit
}) => {
  // Component implementation
});

// ❌ Bad
export default function TaskCard(props) {
  // Component implementation
}
```

### Naming Conventions

- **Files**: Use kebab-case for file names
- **Components**: Use PascalCase for component names
- **Functions**: Use camelCase for function names
- **Constants**: Use UPPER_SNAKE_CASE for constants
- **Types/Interfaces**: Use PascalCase

```typescript
// ✅ Good
// task-card.tsx
export interface TaskCardProps {
  task: Task;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const TASK_STATUS_COLORS = {
    todo: '#gray',
    in_progress: '#blue',
    completed: '#green'
  };
  
  const handleTaskComplete = () => {
    // Implementation
  };
};

// ❌ Bad
// TaskCard.tsx
export interface taskCardProps {
  Task: Task;
}

export const taskCard = ({ Task }) => {
  const taskStatusColors = {
    // Implementation
  };
};
```

### Code Organization

- Group imports: external libraries, internal modules, relative imports
- Use absolute imports for internal modules
- Keep functions small and focused
- Use meaningful variable names
- Add JSDoc comments for complex functions

```typescript
// ✅ Good
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { TaskService } from '@/services/task-service';
import { TaskCard } from '@/components/task-card';
import { useAuth } from '@/hooks/use-auth';

import './task-list.css';

/**
 * Displays a list of tasks with filtering and sorting capabilities
 * @param props - Component props
 * @returns JSX element
 */
export const TaskList: React.FC<TaskListProps> = ({ projectId }) => {
  // Implementation
};

// ❌ Bad
import React from 'react';
import { TaskCard } from './TaskCard';
import { useAuth } from '../../hooks/use-auth';
import { TaskService } from '../../../services/task-service';
```

## 🔄 Git Workflow

### Branch Naming

Use conventional branch naming:

- `feature/feature-name` - New features
- `bugfix/bug-description` - Bug fixes
- `hotfix/urgent-fix` - Critical fixes
- `chore/task-description` - Maintenance tasks
- `docs/documentation-update` - Documentation changes

### Commit Messages

Use conventional commits format:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```bash
feat(auth): add social login with Google
fix(task): resolve task completion bug
docs(readme): update installation instructions
refactor(api): improve error handling
test(task): add unit tests for task service
```

### Pull Request Process

1. **Create a feature branch from `develop`**
2. **Make your changes**
3. **Write tests for new functionality**
4. **Update documentation if needed**
5. **Run all tests and linting**
6. **Create a pull request**
7. **Fill out the PR template**
8. **Request reviews from team members**
9. **Address feedback and make changes**
10. **Merge when approved**

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] E2E tests pass
- [ ] Manual testing completed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No console errors
- [ ] No TypeScript errors

## Screenshots (if applicable)
Add screenshots for UI changes

## Related Issues
Closes #123
```

## 🧪 Testing Guidelines

### Test Structure

- **Unit Tests**: Test individual functions and components
- **Integration Tests**: Test API endpoints and service interactions
- **E2E Tests**: Test complete user workflows
- **Performance Tests**: Test application performance

### Testing Standards

- Maintain >90% code coverage
- Write tests before or alongside code (TDD)
- Use descriptive test names
- Test both success and failure scenarios
- Mock external dependencies

```typescript
// ✅ Good
describe('TaskService', () => {
  describe('createTask', () => {
    it('should create a new task successfully', async () => {
      const taskData = {
        title: 'Test Task',
        description: 'Test Description',
        projectId: 'project-123'
      };
      
      const result = await TaskService.createTask(taskData);
      
      expect(result).toMatchObject({
        id: expect.any(String),
        title: taskData.title,
        status: 'todo'
      });
    });

    it('should throw error for invalid task data', async () => {
      const invalidData = { title: '' };
      
      await expect(TaskService.createTask(invalidData))
        .rejects
        .toThrow('Task title is required');
    });
  });
});

// ❌ Bad
describe('TaskService', () => {
  it('should work', async () => {
    const result = await TaskService.createTask({});
    expect(result).toBeDefined();
  });
});
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run specific test suite
npm run test:backend
npm run test:web
npm run test:mobile

# Run E2E tests
npm run test:e2e

# Watch mode
npm run test:watch
```

## 📦 Release Process

### Version Management

We use semantic versioning (SemVer):

- **Major**: Breaking changes
- **Minor**: New features (backward compatible)
- **Patch**: Bug fixes (backward compatible)

### Release Steps

1. **Create release branch**: `git checkout -b release/v1.2.0`
2. **Update version**: Update version in all `package.json` files
3. **Update changelog**: Add changes to `CHANGELOG.md`
4. **Run full test suite**: `npm test`
5. **Build applications**: `npm run build`
6. **Create release PR**: Merge to `main`
7. **Tag release**: `git tag v1.2.0`
8. **Deploy**: Deploy to production
9. **Create GitHub release**: Add release notes

### Changelog Format

```markdown
# Changelog

## [1.2.0] - 2025-01-15

### Added
- New task filtering feature
- Dark mode support
- Export functionality

### Changed
- Improved performance of task list
- Updated UI components

### Fixed
- Task completion bug
- Authentication issue
```

## 🆘 Getting Help

### Resources

- **Documentation**: [docs.claro.app](https://docs.claro.app)
- **Issues**: [GitHub Issues](https://github.com/claro-app/claro/issues)
- **Discussions**: [GitHub Discussions](https://github.com/claro-app/claro/discussions)
- **Wiki**: [Project Wiki](https://github.com/claro-app/claro/wiki)

### Communication

- **Slack**: Join our [Slack workspace](https://claro-app.slack.com)
- **Email**: development@claro.app
- **Office Hours**: Every Tuesday 2-4 PM UTC

### Before Asking for Help

1. **Check the documentation**
2. **Search existing issues**
3. **Try to reproduce the issue**
4. **Provide detailed information**
5. **Include code examples**

### Issue Reporting

When reporting issues, please include:

- **Environment**: OS, Node.js version, npm version
- **Steps to reproduce**: Detailed steps
- **Expected behavior**: What should happen
- **Actual behavior**: What actually happens
- **Screenshots**: If applicable
- **Console logs**: Error messages and stack traces

## 🎯 Contribution Areas

We welcome contributions in these areas:

### High Priority
- **Bug fixes**
- **Performance improvements**
- **Security enhancements**
- **Accessibility improvements**

### Medium Priority
- **New features**
- **UI/UX improvements**
- **Documentation updates**
- **Test coverage**

### Low Priority
- **Code refactoring**
- **Style improvements**
- **Minor optimizations**

## 🏆 Recognition

Contributors will be recognized in:

- **Contributors list** on GitHub
- **Release notes** for significant contributions
- **Team acknowledgments** in documentation
- **Special mentions** in blog posts

---

Thank you for contributing to Claro! Your help makes this project better for everyone.

**Last Updated**: July 22, 2025 