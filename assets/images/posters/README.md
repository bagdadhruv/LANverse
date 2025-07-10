# Posters Directory

This directory is for party/event posters (600x180px) that will be served by the backend.

## Expected Structure
- Party posters will be stored here by the backend
- Filename format: `{event_id}.jpg` or `{event_id}.png`
- Size: 600x180 pixels (10:3 aspect ratio)
- Format: JPG or PNG

## Backend Integration
The backend should:
1. Store uploaded party posters in this directory
2. Serve posters via API endpoints
3. Handle poster updates and deletions
4. Provide fallback posters for events without custom images
5. Support multiple poster versions (thumbnail, full-size) 