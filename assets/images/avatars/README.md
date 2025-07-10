# Avatars Directory

This directory is for user profile avatars (56x56px) that will be served by the backend.

## Expected Structure
- User avatars will be stored here by the backend
- Filename format: `{user_id}.jpg` or `{user_id}.png`
- Size: 56x56 pixels
- Format: JPG or PNG with transparency support

## Backend Integration
The backend should:
1. Store uploaded avatars in this directory
2. Serve avatars via API endpoints
3. Handle avatar updates and deletions
4. Provide fallback avatars for users without custom images 