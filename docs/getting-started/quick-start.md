# Quick Start Guide

Get Claro up and running on your local machine in minutes.

## 🚀 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: 18.0.0 or higher
- **npm**: 9.0.0 or higher
- **Git**: Latest version
- **React Native CLI**: For mobile development
- **Xcode**: For iOS development (macOS only)
- **Android Studio**: For Android development
- **PostgreSQL**: 14.0 or higher
- **Redis**: 6.0 or higher

### Verify Prerequisites

```bash
# Check Node.js version
node --version  # Should be 18.0.0 or higher

# Check npm version
npm --version   # Should be 9.0.0 or higher

# Check Git version
git --version   # Should be latest stable

# Check if React Native CLI is installed
npx react-native --version
```

## ⚡ Quick Installation

### 1. Clone the Repository

```bash
git clone https://github.com/claro-app/claro.git
cd claro
```

### 2. Install Dependencies

```bash
# Install root dependencies
npm install

# Install workspace dependencies
npx turbo run install
```

### 3. Set Up Environment Variables

```bash
# Copy environment templates
cp apps/api/.env.example apps/api/.env
cp apps/mobile/.env.example apps/mobile/.env
cp apps/web/.env.example apps/web/.env
```

### 4. Set Up Database

```bash
# Navigate to API directory
cd apps/api

# Run database migrations
npm run db:migrate

# Seed the database with initial data
npm run db:seed
```

### 5. Start Development Servers

```bash
# Return to root directory
cd ../..

# Start all applications
./start-all.sh
```

Or start individual services:

```bash
# Terminal 1: Start backend API
cd apps/api && npm run dev

# Terminal 2: Start web application
cd apps/web && npm run dev

# Terminal 3: Start mobile development server
cd apps/mobile && npm run dev
```

## 🌐 Access Your Applications

Once all services are running, you can access:

- **Web Application**: http://localhost:3002
- **API Documentation**: http://localhost:3001/api/docs
- **Mobile Development**: Expo DevTools will open automatically

## 📱 Mobile Development

### iOS Development
```bash
cd apps/mobile
npm run ios
```

### Android Development
```bash
cd apps/mobile
npm run android
```

### Expo Development
```bash
cd apps/mobile
npm run dev
```

## 🧪 Verify Installation

### Test Backend API
```bash
curl http://localhost:3001/api/health
# Should return: {"status":"ok","timestamp":"2025-07-22T..."}
```

### Test Web Application
1. Open http://localhost:3002 in your browser
2. You should see the Claro login page
3. Try creating a test account

### Test Mobile Application
1. Open Expo DevTools
2. Scan the QR code with Expo Go app
3. The mobile app should load successfully

## 🔧 Common Issues

### Port Conflicts
If you encounter port conflicts, the startup script will automatically handle them. If issues persist:

```bash
# Check what's using the ports
lsof -i :3001  # Backend API
lsof -i :3002  # Web app
lsof -i :8082  # Mobile Expo

# Kill processes if needed
kill -9 <PID>
```

### Database Connection Issues
```bash
# Check if PostgreSQL is running
brew services list | grep postgresql  # macOS
sudo systemctl status postgresql      # Linux

# Start PostgreSQL if needed
brew services start postgresql        # macOS
sudo systemctl start postgresql       # Linux
```

### Node Modules Issues
```bash
# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📚 Next Steps

Now that you have Claro running locally:

1. **Explore the Codebase**: Check out the [Project Structure](../architecture/project-structure.md)
2. **Read the Documentation**: Browse the [API Documentation](../architecture/api-documentation.md)
3. **Start Contributing**: Review the [Contributing Guidelines](../development/contributing.md)
4. **Run Tests**: Execute `npm test` to run the test suite

## 🆘 Need Help?

- **Documentation**: Browse the [docs](../README.md) directory
- **Issues**: Check [GitHub Issues](https://github.com/claro-app/claro/issues)
- **Discussions**: Join [GitHub Discussions](https://github.com/claro-app/claro/discussions)
- **Email**: support@claro.app

---

**Last Updated**: July 22, 2025 