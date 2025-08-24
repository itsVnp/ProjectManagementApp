# Git History Generator

This script creates a realistic git working history for your project from June 20, 2025 to today.

## Features

- **Realistic Patterns**: More commits on weekdays, fewer on weekends
- **Varied Activity**: 2-8 commits on weekdays, 0-3 on weekends
- **Milestone Days**: Special days (June 20, 25, July 1) get 8-15 commits
- **Realistic Messages**: Uses conventional commit format with varied content
- **File Modifications**: Creates and modifies different files across the project

## Usage

### 1. Run the Script

```bash
./scripts/git-history-generator.sh
```

### 2. Push to GitHub

After the script completes, push the generated history:

```bash
git push origin main --force
```

## What It Does

1. **Initializes Git**: Creates a new repository if none exists
2. **Sets Remote**: Adds your GitHub repository as origin
3. **Generates Commits**: Creates commits for each day with realistic activity levels
4. **Creates Files**: Generates placeholder files in various directories
5. **Sets Dates**: Each commit gets the correct author and commit dates

## Activity Pattern

- **Weekdays (Mon-Fri)**: 2-8 commits per day
- **Weekends (Sat-Sun)**: 0-3 commits per day
- **Milestone Days**: 8-15 commits (June 20, 25, July 1)

## File Structure

The script creates files in these directories:
- `src/components/`
- `src/pages/`
- `src/services/`
- `src/store/`
- `src/utils/`
- `src/styles/`
- `src/contexts/`
- `src/hooks/`

## Commit Messages

Uses conventional commit format:
- `feat:` New features
- `fix:` Bug fixes
- `refactor:` Code improvements
- `docs:` Documentation updates
- `style:` UI/styling changes
- `test:` Testing additions
- `chore:` Maintenance tasks
- `perf:` Performance improvements

## Warning

⚠️ **This script rewrites git history!** 

- Make sure you have a backup
- Only use on new repositories or when you're sure about the changes
- The `--force` push will overwrite the remote repository

## Customization

You can modify the script to:
- Change the date range
- Adjust commit frequency
- Add more milestone days
- Customize commit messages
- Modify file paths

## Example Output

```
================================
  Git History Generator
================================
🚀 Starting Git History Generation

[INFO] Generating history from 2025-06-20 to 2025-01-27
[INFO] Creating 12 commits for 2025-06-20
[INFO] Creating 5 commits for 2025-06-21
[INFO] Creating 3 commits for 2025-06-22
...

✅ Git history generation completed!
[INFO] Total commits created: 156

[INFO] Recent commit history:
a1b2c3d feat: add new user authentication system
e4f5g6h fix: resolve database connection timeout issue
i7j8k9l refactor: improve error handling in API routes
...

[INFO] Ready to push to GitHub!
[INFO] Run: git push origin main --force
```

## Troubleshooting

### Permission Denied
```bash
chmod +x scripts/git-history-generator.sh
```

### Git Not Found
Make sure git is installed and in your PATH.

### Date Issues
The script is tested on macOS. For other systems, you may need to adjust the date commands.

## Support

If you encounter issues, check:
1. Git is properly configured
2. You have write permissions
3. The script is executable
4. Your system date format is compatible
