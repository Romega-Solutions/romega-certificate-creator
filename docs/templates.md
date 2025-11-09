# Certificate Templates Feature

## Overview

The Templates feature allows you to manage certificate background templates locally. Templates are stored in `/public/certificates/` and automatically detected by the application.

## Features

### ✅ View Templates

- Browse all available templates in a responsive grid
- Preview templates in full-screen modal
- Templates are displayed with thumbnails and names

### ✅ Upload Templates

- Upload PNG/JPG images as templates
- Automatic numbering (template1.png, template2.png, etc.)
- File validation and size checks
- Supports up to 20 templates

### ✅ Delete Templates

- Remove unwanted templates
- Confirmation dialog before deletion
- Automatic cleanup

### ✅ Use Templates

- Click "Use Template" to start creating certificates
- Templates automatically load in the generator
- URL parameter support: `/generator?template=1`

## File Structure

```
public/
  certificates/
    template1.png
    template2.png
    template3.png
    ...
```

## API Routes

### Upload Template

- **Endpoint**: `POST /api/templates/upload`
- **Body**: FormData with `template` file
- **Response**: `{ success, filename, templateNumber }`

### Delete Template

- **Endpoint**: `DELETE /api/templates/delete?filename=templateX.png`
- **Response**: `{ success, message }`

## Template Guidelines

1. **File Format**: PNG or JPG recommended
2. **Resolution**: 1920x1080px or higher for print quality
3. **Naming**: Automatically handled by the system
4. **Limit**: Maximum 20 templates
5. **Storage**: Local filesystem (`/public/certificates/`)

## Usage Flow

1. **Dashboard** → Click "View Templates" (Green card)
2. **Templates Page** → Click "Upload Template"
3. **Select Image** → Choose PNG/JPG file
4. **Auto-numbered** → System assigns next available number
5. **Use Template** → Click to open in generator
6. **Create Certificate** → Add text/images and generate

## Best Practices

- Use high-resolution images (minimum 1920x1080px)
- Keep file sizes reasonable (under 5MB)
- Use PNG for transparent backgrounds
- Test templates in generator before bulk creation
- Organize templates by type (completion, participation, etc.)

## Security

- File type validation on upload
- Filename sanitization (only templateX.png allowed)
- Directory traversal protection
- Maximum file limit enforced

## Responsive Design

- Mobile-friendly grid layout
- Touch-optimized buttons
- Full-screen preview on all devices
- Adaptive image sizing
