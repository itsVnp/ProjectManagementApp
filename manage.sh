#!/bin/bash

# Claro Project Management Script
# Usage: ./manage.sh [command]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Project root directory
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${BLUE}================================${NC}"
    echo -e "${BLUE}  Claro Project Management${NC}"
    echo -e "${BLUE}================================${NC}"
}

# Function to check if a port is in use
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        return 0
    else
        return 1
    fi
}

# Function to get process info
get_process_info() {
    local port=$1
    local process=$(lsof -ti:$port 2>/dev/null)
    if [ -n "$process" ]; then
        local cmd=$(ps -p $process -o command= 2>/dev/null | head -1)
        echo "$process:$cmd"
    else
        echo "none"
    fi
}

# Function to check database connection
check_database() {
    print_status "Checking database connection..."
    if docker exec -it claro-postgres psql -U claro_user -d claro_dev -c "SELECT 1;" >/dev/null 2>&1; then
        echo -e "${GREEN}✅ Database: Connected${NC}"
        return 0
    else
        echo -e "${RED}❌ Database: Connection failed${NC}"
        return 1
    fi
}

# Function to check Redis connection
check_redis() {
    print_status "Checking Redis connection..."
    if docker exec -it claro-redis redis-cli ping >/dev/null 2>&1; then
        echo -e "${GREEN}✅ Redis: Connected${NC}"
        return 0
    else
        echo -e "${RED}❌ Redis: Connection failed${NC}"
        return 1
    fi
}

# Function to check API health
check_api_health() {
    print_status "Checking API health..."
    if check_port 3001; then
        local response=$(curl -s -w "%{http_code}" http://localhost:3001/api/auth/login -H "Content-Type: application/json" -d '{"email":"admin@claro.com","password":"admin123"}' -o /dev/null 2>/dev/null || echo "000")
        if [ "$response" = "200" ]; then
            echo -e "${GREEN}✅ API Server: Running (Port 3001)${NC}"
            return 0
        else
            echo -e "${YELLOW}⚠️  API Server: Running but unhealthy (Port 3001)${NC}"
            return 1
        fi
    else
        echo -e "${RED}❌ API Server: Not running${NC}"
        return 1
    fi
}

# Function to check web app health
check_web_health() {
    print_status "Checking web application health..."
    local web_port=""
    for port in 3002 3003 3004 3005; do
        if check_port $port; then
            web_port=$port
            break
        fi
    done
    
    if [ -n "$web_port" ]; then
        local response=$(curl -s -w "%{http_code}" http://localhost:$web_port -o /dev/null 2>/dev/null || echo "000")
        if [ "$response" = "200" ]; then
            echo -e "${GREEN}✅ Web App: Running (Port $web_port)${NC}"
            return 0
        else
            echo -e "${YELLOW}⚠️  Web App: Running but unhealthy (Port $web_port)${NC}"
            return 1
        fi
    else
        echo -e "${RED}❌ Web App: Not running${NC}"
        return 1
    fi
}

# Function to check mobile app health
check_mobile_health() {
    print_status "Checking Claro mobile app health..."
    if check_port 8081; then
        echo -e "${GREEN}✅ Claro Mobile: Expo development server running (Port 8081)${NC}"
        return 0
    else
        echo -e "${RED}❌ Claro Mobile: Expo development server not running${NC}"
        return 1
    fi
}

# Function to show health status
health() {
    print_header
    echo -e "${CYAN}🔍 Health Check${NC}"
    echo ""
    
    # Check Docker containers
    print_status "Checking Docker containers..."
    if docker ps | grep -q "claro-postgres"; then
        echo -e "${GREEN}✅ PostgreSQL: Running${NC}"
    else
        echo -e "${RED}❌ PostgreSQL: Not running${NC}"
    fi
    
    if docker ps | grep -q "claro-redis"; then
        echo -e "${GREEN}✅ Redis: Running${NC}"
    else
        echo -e "${RED}❌ Redis: Not running${NC}"
    fi
    
    echo ""
    
    # Check database and Redis
    check_database
    check_redis
    echo ""
    
    # Check services
    check_api_health
    check_web_health
    check_mobile_health
    echo ""
    
    # Show URLs
    echo -e "${PURPLE}🌐 Access URLs:${NC}"
    echo -e "  Web App: ${CYAN}http://localhost:3002${NC} (or 3003/3004/3005)"
    echo -e "  API Docs: ${CYAN}http://localhost:3001/api/docs${NC}"
    echo -e "  Health Check: ${CYAN}http://localhost:3001/health${NC}"
    echo ""
    
    # Show test credentials
    echo -e "${PURPLE}🧪 Test Credentials:${NC}"
    echo -e "  Email: ${CYAN}admin@claro.com${NC}"
    echo -e "  Password: ${CYAN}admin123${NC}"
    echo ""
}

# Function to start all services
start() {
    local mode="${1:-full}"
    
    print_header
    echo -e "${CYAN}🚀 Starting Claro Project (${mode} mode)${NC}"
    echo ""
    
    case "$mode" in
        "full")
            print_status "Starting all services (web, backend, mobile)..."
            cd "$PROJECT_ROOT"
            npm run dev &
            
            print_status "Waiting for services to start..."
            sleep 10
            
            health
            ;;
        "web")
            print_status "Starting web and backend services only..."
            cd "$PROJECT_ROOT"
            
            # Start web and api using existing scripts
            npm run start:web &
            npm run start:api &
            
            print_status "Waiting for services to start..."
            sleep 8
            
            # Check health
            echo ""
            check_api_health
            check_web_health
            echo ""
            
            echo -e "${PURPLE}🌐 Access URLs:${NC}"
            echo -e "  Web App: ${CYAN}http://localhost:3002${NC} (or 3003/3004/3005)"
            echo -e "  API: ${CYAN}http://localhost:3001${NC}"
            echo ""
            ;;
        "mobile")
            print_status "Starting Claro mobile app (Expo)..."
            cd "$PROJECT_ROOT"
            
            # Check if Expo CLI is installed
            if ! command -v expo &> /dev/null; then
                print_error "Expo CLI not found. Installing..."
                npm install -g @expo/cli
            fi
            
            # Start mobile app using clean Expo command
            npm run start:mobile &
            
            print_status "Waiting for Expo development server to start..."
            sleep 5
            
            if check_port 8081; then
                echo -e "${GREEN}✅ Claro Mobile: Expo development server running on port 8081${NC}"
                echo ""
                echo -e "${PURPLE}📱 Mobile Access:${NC}"
                echo -e "  Scan QR code in terminal or visit: ${CYAN}http://localhost:8081${NC}"
                echo -e "  Expo Go: Scan QR code with Expo Go app"
                echo -e "  Development: Clean Expo workflow"
                echo ""
            else
                echo -e "${RED}❌ Claro Mobile: Failed to start Expo server${NC}"
            fi
            ;;
        *)
            print_error "Invalid start mode. Use: full, web, or mobile"
            echo ""
            echo -e "${PURPLE}Available start modes:${NC}"
            echo -e "  ${GREEN}full${NC}   - Start all services (web, backend, mobile)"
            echo -e "  ${GREEN}web${NC}    - Start only web and backend services"
            echo -e "  ${GREEN}mobile${NC} - Start only mobile app"
            echo ""
            ;;
    esac
}

# Function to stop all services
stop() {
    print_header
    echo -e "${CYAN}🛑 Stopping Claro Project${NC}"
    echo ""
    
    print_status "Stopping all Node.js processes..."
    
    # Kill processes on specific ports
    for port in 3001 3002 3003 3004 3005 8081; do
        local pids=$(lsof -ti:$port 2>/dev/null)
        if [ -n "$pids" ]; then
            print_status "Stopping process on port $port..."
            kill -9 $pids 2>/dev/null || true
        fi
    done
    
    # Kill turbo processes
    local turbo_pids=$(pgrep -f "turbo" 2>/dev/null)
    if [ -n "$turbo_pids" ]; then
        print_status "Stopping Turbo processes..."
        kill -9 $turbo_pids 2>/dev/null || true
    fi
    
    # Kill vite processes
    local vite_pids=$(pgrep -f "vite" 2>/dev/null)
    if [ -n "$vite_pids" ]; then
        print_status "Stopping Vite processes..."
        kill -9 $vite_pids 2>/dev/null || true
    fi
    
    # Kill nodemon processes
    local nodemon_pids=$(pgrep -f "nodemon" 2>/dev/null)
    if [ -n "$nodemon_pids" ]; then
        print_status "Stopping Nodemon processes..."
        kill -9 $nodemon_pids 2>/dev/null || true
    fi
    
    print_status "All services stopped!"
    echo ""
}

# Function to restart all services
restart() {
    print_header
    echo -e "${CYAN}🔄 Restarting Claro Project${NC}"
    echo ""
    
    stop
    sleep 2
    start "full"
}

# Function to fix database permissions
fix_db() {
    print_header
    echo -e "${CYAN}🔧 Fixing Database Permissions${NC}"
    echo ""
    
    print_status "Granting database permissions..."
    
    docker exec -it claro-postgres psql -U claro_user -d claro_dev -c "
        GRANT ALL ON ALL TABLES IN SCHEMA public TO claro_user;
        GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO claro_user;
        GRANT ALL ON SCHEMA public TO claro_user;
        ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO claro_user;
        ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO claro_user;
    " 2>/dev/null || print_error "Failed to fix database permissions"
    
    print_status "Database permissions updated!"
    echo ""
}

# Function to show logs
logs() {
    print_header
    echo -e "${CYAN}📋 Service Logs${NC}"
    echo ""
    
    echo -e "${PURPLE}Recent API logs:${NC}"
    echo "Press Ctrl+C to exit logs"
    echo ""
    
    # Show recent logs from the development process
    tail -f /dev/null & # Placeholder for actual log following
}

# Function to show help
show_help() {
    print_header
    echo -e "${CYAN}📖 Available Commands:${NC}"
    echo ""
    echo -e "  ${GREEN}health${NC}          - Check health of all services"
    echo -e "  ${GREEN}start [mode]${NC}     - Start services (full, web, mobile)"
    echo -e "  ${GREEN}stop${NC}            - Stop all services"
    echo -e "  ${GREEN}restart${NC}         - Restart all services"
    echo -e "  ${GREEN}fix-db${NC}          - Fix database permissions"
    echo -e "  ${GREEN}logs${NC}            - Show service logs"
    echo -e "  ${GREEN}help${NC}            - Show this help message"
    echo ""
    echo -e "${PURPLE}Start Modes:${NC}"
    echo -e "  ${GREEN}full${NC}   - Start all services (web, backend, mobile)"
    echo -e "  ${GREEN}web${NC}    - Start only web and backend services"
    echo -e "  ${GREEN}mobile${NC} - Start only Claro mobile app (Expo)"
    echo ""
    echo -e "${PURPLE}Examples:${NC}"
    echo -e "  ./manage.sh health"
    echo -e "  ./manage.sh start full"
    echo -e "  ./manage.sh start web"
    echo -e "  ./manage.sh start mobile"
    echo -e "  ./manage.sh stop"
    echo ""
}

# Main script logic
case "${1:-help}" in
    "health")
        health
        ;;
    "start")
        start "${2:-full}"
        ;;
    "stop")
        stop
        ;;
    "restart")
        restart
        ;;
    "fix-db")
        fix_db
        ;;
    "logs")
        logs
        ;;
    "help"|*)
        show_help
        ;;
esac 