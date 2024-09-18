#!/bin/bash

# Update GitHub repository

# Ensure we're in the correct directory
cd /path/to/your/project

# Stage all changes
git add .

# Commit changes
echo "Enter commit message:"
read commit_message
git commit -m "$commit_message"

# Push to GitHub
git push origin main

echo "Changes pushed to GitHub successfully!"

# Optional: Create a new release
echo "Do you want to create a new release? (y/n)"
read create_release

if [ "$create_release" = "y" ]; then
    echo "Enter new version number (e.g., v1.1.0):"
    read version
    echo "Enter release title:"
    read title
    echo "Enter release description:"
    read description
    
    # Use GitHub CLI if installed, otherwise provide instructions
    if command -v gh &> /dev/null; then
        gh release create "$version" -t "$title" -n "$description"
        echo "Release $version created successfully!"
    else
        echo "To create a release, go to:"
        echo "https://github.com/yourusername/yourrepository/releases/new"
        echo "Use the following details:"
        echo "Tag version: $version"
        echo "Release title: $title"
        echo "Description: $description"
    fi
fi

echo "Process completed!"
