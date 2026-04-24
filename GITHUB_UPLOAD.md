#!/bin/bash
# GitHub Upload Instructions for Hemnath V Portfolio

## STEP 1: Create a GitHub Repository

1. Go to https://github.com/Hem2007 (or your GitHub account)
2. Click the "+" icon in the top-right corner → "New repository"
3. Repository name: `portfolio`
4. Description: "Professional MERN Stack Developer & Data Analyst Portfolio"
5. Choose: Public (so others can see your work)
6. Do NOT initialize with README (we already have one)
7. Click "Create repository"

## STEP 2: Connect Local Repo to GitHub

After creating the repository, GitHub will show you commands. Run these in your terminal:

```bash
cd C:\Users\vhemn\Documents\portfolio

# Set the remote repository URL
git remote add origin https://github.com/Hem2007/portfolio.git

# Rename branch to main (optional, GitHub preference)
git branch -M main

# Push your code to GitHub
git push -u origin main
```

Replace `Hem2007` with your actual GitHub username if different.

## STEP 3: Verify Upload

1. Go to https://github.com/Hem2007/portfolio
2. Confirm all files are visible:
   - index.html, skills.html, resume.html ✓
   - styles.css, script.js ✓
   - assets folder (profile.jpg, resume.pdf) ✓
   - README.md, .gitignore ✓

## STEP 4: Deploy Using GitHub Pages (Optional)

1. Go to your repository on GitHub
2. Click "Settings" tab
3. Scroll to "Pages" section on the left
4. Source: Select "Deploy from a branch"
5. Branch: Select "main" (or "master")
6. Folder: Select "/ (root)"
7. Click "Save"

Your portfolio will be live at: https://Hem2007.github.io/portfolio

## STEP 5: Update GitHub Profile

1. Go to your GitHub profile
2. Edit profile bio to mention your portfolio
3. Add portfolio link to your profile

## Quick Command Reference

```bash
# Check git status
git status

# View commit history
git log --oneline

# Make changes and commit
git add .
git commit -m "Your commit message"

# Push to GitHub
git push

# Pull latest changes
git pull
```

## Troubleshooting

### Authentication Issues
If you get "Authentication failed" error:
1. Use GitHub Personal Access Token
2. Or use SSH keys (recommended for long-term)

Visit: https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token

### SSH Setup (Advanced)
```bash
# Generate SSH key
ssh-keygen -t rsa -b 4096 -C "vhemnath24@gmail.com"

# Add to SSH agent
ssh-add ~/.ssh/id_rsa

# Copy public key to GitHub Settings > SSH Keys
```

## Future Updates

After initial push, to update your portfolio:

```bash
# Make changes to files
# Then:
git add .
git commit -m "Update: Description of changes"
git push
```

---
Your portfolio is now ready for GitHub! 🎉