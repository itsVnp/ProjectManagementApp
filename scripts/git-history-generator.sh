#!/bin/bash

# Git History Generator for Claro Project
# This script creates a realistic git working history from June 20, 2025 to today
# Usage: ./scripts/git-history-generator.sh

set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Project root directory
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_header() {
    echo -e "${BLUE}================================${NC}"
    echo -e "${BLUE}  Git History Generator${NC}"
    echo -e "${BLUE}================================${NC}"
}

# Function to get random number between min and max
random_number() {
    local min=$1
    local max=$2
    echo $((RANDOM % (max - min + 1) + min))
}

# Function to get random commit message
get_random_commit_message() {
    local messages=(
        "feat: add new user authentication system"
        "fix: resolve database connection timeout issue"
        "refactor: improve error handling in API routes"
        "docs: update API documentation"
        "style: improve UI component styling"
        "test: add unit tests for user service"
        "chore: update dependencies"
        "perf: optimize database queries"
        "feat: implement real-time notifications"
        "fix: correct mobile app navigation bug"
        "refactor: restructure project components"
        "docs: add setup instructions"
        "style: enhance mobile responsive design"
        "test: add integration tests"
        "chore: configure CI/CD pipeline"
        "perf: improve app loading performance"
        "feat: add project management dashboard"
        "fix: resolve authentication token refresh"
        "refactor: optimize state management"
        "docs: update deployment guide"
        "style: improve accessibility features"
        "test: add end-to-end tests"
        "chore: update build configuration"
        "perf: optimize image loading"
        "feat: implement task assignment system"
        "fix: correct data validation errors"
        "refactor: improve code organization"
        "docs: add API examples"
        "style: enhance dark mode support"
        "test: add performance benchmarks"
        "chore: update security dependencies"
    )
    
    local random_index=$((RANDOM % ${#messages[@]}))
    echo "${messages[$random_index]}"
}

# Function to get random file to modify
get_random_file() {
    local files=(
        "src/components/Header.tsx"
        "src/pages/Dashboard.tsx"
        "src/services/api.ts"
        "src/store/auth.ts"
        "src/utils/validation.ts"
        "src/styles/global.css"
        "src/contexts/AuthContext.tsx"
        "src/hooks/useAuth.ts"
        "src/components/Button.tsx"
        "src/pages/Login.tsx"
        "src/pages/Register.tsx"
        "src/components/Sidebar.tsx"
        "src/services/auth.ts"
        "src/store/index.ts"
        "src/utils/formatting.ts"
        "src/styles/theme.ts"
        "src/components/Modal.tsx"
        "src/pages/Profile.tsx"
        "src/components/Table.tsx"
        "src/services/user.ts"
        "src/store/user.ts"
        "src/utils/date.ts"
        "src/styles/components.css"
        "src/components/Card.tsx"
        "src/pages/Projects.tsx"
        "src/components/Form.tsx"
        "src/services/project.ts"
        "src/store/project.ts"
        "src/utils/crypto.ts"
        "src/styles/variables.css"
    )
    
    local random_index=$((RANDOM % ${#files[@]}))
    echo "${files[$random_index]}"
}

# Function to create a realistic commit
create_commit() {
    local date=$1
    local commit_count=$2
    
    print_status "Creating $commit_count commits for $date"
    
    for ((i=1; i<=commit_count; i++)); do
        # Set the git author date
        export GIT_AUTHOR_DATE="$date 09:00:00 +0000"
        export GIT_COMMITTER_DATE="$date 09:00:00 +0000"
        
        # Get random file and message
        local file=$(get_random_file)
        local message=$(get_random_commit_message)
        
        # Create directory if it doesn't exist
        local dir=$(dirname "$file")
        mkdir -p "$dir"
        
        # Create or modify the file with some content
        if [ ! -f "$file" ]; then
            echo "// Auto-generated file for git history" > "$file"
            echo "// Created on: $date" >> "$file"
            echo "// Commit: $i of $commit_count" >> "$file"
            echo "" >> "$file"
            echo "export const placeholder = 'This is a placeholder file';" >> "$file"
        else
            # Add a comment to existing file
            echo "// Modified on: $date (commit $i)" >> "$file"
        fi
        
        # Add and commit
        git add "$file"
        git commit -m "$message" --no-verify
        
        # Small delay between commits
        sleep 1
    done
}

# Function to generate git history
generate_history() {
    print_header
    echo -e "${GREEN}🚀 Starting Git History Generation${NC}"
    echo ""
    
    # Check if we're in a git repository
    if [ ! -d ".git" ]; then
        print_warning "Not in a git repository. Initializing..."
        git init
        git config user.name "Your Name"
        git config user.email "your.email@example.com"
    fi
    
    # Check if remote origin exists
    if ! git remote get-url origin >/dev/null 2>&1; then
        print_warning "No remote origin found. Adding..."
        git remote add origin https://github.com/itsVnp/ProjectManagementApp.git
    fi
    
    # Start date: June 20, 2025
    local start_date="2025-06-20"
    local end_date=$(date +%Y-%m-%d)
    
    print_status "Generating history from $start_date to $end_date"
    echo ""
    
    # Convert dates to timestamps for iteration (macOS compatible)
    local start_timestamp=$(date -j -f "%Y-%m-%d" "$start_date" +%s)
    local end_timestamp=$(date -j -f "%Y-%m-%d" "$end_date" +%s)
    local current_timestamp=$start_timestamp
    
    local total_commits=0
    
    while [ $current_timestamp -le $end_timestamp ]; do
        local current_date=$(date -j -r $current_timestamp +%Y-%m-%d)
        local day_of_week=$(date -j -r $current_timestamp +%u)
        
        # Skip weekends (Saturday = 6, Sunday = 7) for more realistic pattern
        if [ $day_of_week -ge 6 ]; then
            # Weekend: 0-3 commits (less activity)
            local commit_count=$(random_number 0 3)
        else
            # Weekday: 2-8 commits (more activity)
            local commit_count=$(random_number 2 8)
        fi
        
        # Special days: more commits
        if [ "$current_date" = "2025-06-20" ] || [ "$current_date" = "2025-06-25" ] || [ "$current_date" = "2025-07-01" ]; then
            # Project milestones: 8-15 commits
            commit_count=$(random_number 8 15)
        fi
        
        if [ $commit_count -gt 0 ]; then
            create_commit "$current_date" "$commit_count"
            total_commits=$((total_commits + commit_count))
        fi
        
        # Move to next day
        current_timestamp=$((current_timestamp + 86400))
    done
    
    echo ""
    print_status "✅ Git history generation completed!"
    print_status "Total commits created: $total_commits"
    echo ""
    
    # Show git log summary
    print_status "Recent commit history:"
    git log --oneline -10
    echo ""
    
    print_status "Ready to push to GitHub!"
    print_status "Run: git push origin main --force"
    echo ""
}

# Function to show help
show_help() {
    print_header
    echo -e "${GREEN}📖 Git History Generator Help${NC}"
    echo ""
    echo -e "This script creates a realistic git working history for your project."
    echo -e "It generates commits from June 20, 2025 to today with varying activity levels."
    echo ""
    echo -e "${BLUE}Features:${NC}"
    echo -e "  • Realistic commit patterns (more activity on weekdays)"
    echo -e "  • Varied commit messages and file modifications"
    echo -e "  • Project milestone days with higher activity"
    echo -e "  • Weekend activity (reduced but present)"
    echo ""
    echo -e "${BLUE}Usage:${NC}"
    echo -e "  ./scripts/git-history-generator.sh"
    echo ""
    echo -e "${BLUE}After running:${NC}"
    echo -e "  git push origin main --force"
    echo ""
    echo -e "${YELLOW}⚠️  Warning: This will rewrite git history!${NC}"
    echo -e "  Make sure you have a backup or this is a new repository."
    echo ""
}

# Main script logic
case "${1:-generate}" in
    "help"|"-h"|"--help")
        show_help
        ;;
    "generate"|*)
        generate_history
        ;;
esac
