# Stories Directory

This directory is for social story content (images and videos) that will be served by the backend.

## Expected Structure
- Story images and videos will be stored here by the backend
- Filename format: `{story_id}.jpg`, `{story_id}.png`, or `{story_id}.mp4`
- Image size: 600x400 pixels (3:2 aspect ratio)
- Video size: 600x400 pixels, MP4 format
- Duration: 10-30 seconds for videos

## Backend Integration
The backend should:
1. Store uploaded story content in this directory
2. Serve stories via API endpoints
3. Handle story updates and deletions
4. Support both image and video content
5. Provide content moderation and filtering
6. Handle story expiration and archiving 