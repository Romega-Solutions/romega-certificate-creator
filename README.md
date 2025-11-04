# CertGen - Professional Certificate Generator

A modern Next.js application for creating and managing professional certificates with advanced customization options and real-time preview capabilities.

## ✨ Key Features

- 🔐 Secure Authentication System
  - Protected routes
  - User dashboard
  - Session management
- 🎨 Advanced Certificate Editor
  - Drag & drop interface
  - Real-time preview
  - Multiple templates
  - Custom text positioning
- 📝 Text Customization
  - Font selection (including Merriweather)
  - Size adjustment
  - Color picker
  - Position control
- 🖼️ Image Management
  - Template selection
  - Custom image upload
  - Position adjustment
- 💾 Export Options
  - High-quality PNG export
  - Custom filename
  - 2x scale for better quality
- 🌗 Theme Support
  - Dark/Light mode
  - Custom color system
  - Responsive design

## 🚀 Tech Stack

- **Framework:** [Next.js 14](https://nextjs.org/)
- **Styling:**
  - [Tailwind CSS](https://tailwindcss.com/)
  - Custom CSS variables
  - Romega Solutions color system
- **Components:** [Shadcn/ui](https://ui.shadcn.com/)
- **Icons:** [Lucide Icons](https://lucide.dev/)
- **Export:** [html2canvas](https://html2canvas.hertzen.com/)
- **Typography:** Merriweather (local fonts)

## 🛠️ Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/certgen.git

# Navigate to project
cd certgen

# Install dependencies
npm install

# Start development
npm run dev
```

## 📁 Project Structure

```
certgen/
├── src/
│   ├── app/                    # Next.js pages
│   │   ├── dashboard/         # User dashboard
│   │   ├── generator/        # Certificate editor
│   │   └── login/           # Authentication
│   ├── components/
│   │   ├── certificate/     # Core components
│   │   │   ├── canvas.tsx          # Main editor
│   │   │   ├── download-button.tsx  # PNG export
│   │   │   ├── draggable-text.tsx  # Text elements
│   │   │   └── template-selector.tsx
│   │   ├── ui/             # Shadcn components
│   │   └── auth/          # Auth components
│   ├── styles/
│   │   └── globals.css    # Custom theme system
│   └── types/            # TypeScript definitions
```

## 💡 Core Components

- **Canvas**: Main editing workspace
- **DownloadButton**: High-quality PNG export
- **DraggableText**: Text manipulation
- **TemplateSelector**: Template management

## 🚀 Usage Guide

1. **Authentication**

   - Login to access dashboard
   - View personal certificates

2. **Creating Certificates**

   - Choose a template
   - Add/edit text elements
   - Customize fonts and colors
   - Position elements freely

3. **Exporting Work**
   - Preview final design
   - Export as high-quality PNG
   - Custom filename support

## 🧪 Development

```bash
# Run test suite
npm run test

# Production build
npm run build

# Start production
npm start
```

## 🤝 Contributing

1. Fork repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Submit Pull Request

## 📄 License

MIT License - See [LICENSE](LICENSE)

## 🙏 Acknowledgments

- Shadcn/ui for component library
- html2canvas for export functionality
- Merriweather font family
