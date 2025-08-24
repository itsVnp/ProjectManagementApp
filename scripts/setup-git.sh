#!/bin/bash

# Git Setup Script for Claro Project
# This script helps set up git configuration before running the history generator

set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

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
    echo -e "${BLUE}  Git Setup for Claro Project${NC}"
    echo -e "${BLUE}================================${NC}"
}

setup_git() {
    print_header
    echo -e "${GREEN}🚀 Setting up Git for Claro Project${NC}"
    echo ""
    
    # Check if git is installed
    if ! command -v git &> /dev/null; then
        print_error "Git is not installed. Please install git first."
        exit 1
    fi
    
    # Check if we're in a git repository
    if [ -d ".git" ]; then
        print_warning "Git repository already exists."
        read -p "Do you want to remove it and start fresh? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            print_status "Removing existing git repository..."
            rm -rf .git
        else
            print_status "Keeping existing repository."
            return 0
        fi
    fi
    
    # Initialize git repository
    print_status "Initializing git repository..."
    git init
    
    # Configure git user
    print_status "Configuring git user..."
    
    # Get current git config or set defaults
    local current_name=$(git config --global user.name 2>/dev/null || echo "")
    local current_email=$(git config --global user.email 2>/dev/null || echo "")
    
    if [ -z "$current_name" ]; then
        read -p "Enter your name for git commits: " git_name
        git config user.name "$git_name"
    else
        print_status "Using global git name: $current_name"
        git config user.name "$current_name"
    fi
    
    if [ -z "$current_email" ]; then
        read -p "Enter your email for git commits: " git_email
        git config user.email "$git_email"
    else
        print_status "Using global git email: $current_email"
        git config user.email "$current_email"
    fi
    
    # Add remote origin
    print_status "Adding remote origin..."
    git remote add origin https://github.com/itsVnp/ProjectManagementApp.git
    
    # Create initial commit
    print_status "Creating initial commit..."
    echo "# Claro Project Management App" > README.md
    echo "" >> README.md
    echo "A comprehensive project management application with web, mobile, and API components." >> README.md
    echo "" >> README.md
    echo "## Features" >> README.md
    echo "- Web Application (React + TypeScript)" >> README.md
    echo "- Mobile App (React Native + Expo)" >> README.md
    echo "- Backend API (Node.js + Express)" >> README.md
    echo "- Database (PostgreSQL + Redis)" >> README.md
    echo "" >> README.md
    echo "## Getting Started" >> README.md
    echo "See the documentation for setup instructions." >> README.md
    
    git add README.md
    git commit -m "Initial commit: Project setup and documentation"
    
    # Create main branch
    print_status "Creating main branch..."
    git branch -M main
    
    echo ""
    print_status "✅ Git setup completed!"
    echo ""
    print_status "Next steps:"
    print_status "1. Run: ./scripts/git-history-generator.sh"
    print_status "2. Push to GitHub: git push origin main --force"
    echo ""
}

show_help() {
    print_header
    echo -e "${GREEN}📖 Git Setup Help${NC}"
    echo ""
    echo -e "This script sets up git configuration for your Claro project."
    echo -e "It will:"
    echo -e "  • Initialize a new git repository"
    echo -e "  • Configure user name and email"
    echo -e "  • Add GitHub remote origin"
    echo -e "  • Create initial commit"
    echo -e "  • Set up main branch"
    echo ""
    echo -e "${BLUE}Usage:${NC}"
    echo -e "  ./scripts/setup-git.sh"
    echo ""
    echo -e "${BLUE}After setup:${NC}"
    echo -e "  ./scripts/git-history-generator.sh"
    echo ""
}

# Main script logic
case "${1:-setup}" in
    "help"|"-h"|"--help")
        show_help
        ;;
    "setup"|*)
        setup_git
        ;;
esac
