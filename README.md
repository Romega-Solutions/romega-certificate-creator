# CertGen - Professional Certificate Generator

A modern, responsive certificate generator built with Next.js 14 and Tailwind CSS. Create, customize, and export professional certificates with an intuitive drag-and-drop interface.

![CertGen Preview](./preview.png)

## 🚀 Features

- **🔐 Secure Authentication**: Protected routes with session management
- **🎨 Drag & Drop Editor**: Intuitive interface for positioning elements
- **📝 Advanced Text Customization**: Font selection, colors, sizing, and positioning
- **🖼️ Template Management**: Multiple pre-built templates with custom upload support
- **💾 High-Quality Export**: Download certificates as PNG at 2x resolution
- **🌗 Dark/Light Mode**: Seamless theme switching with custom Romega Solutions color system
- **📱 Responsive Design**: Works flawlessly across all devices
- **⚡ Real-Time Preview**: See changes instantly as you edit
- **🎯 Precise Positioning**: Pixel-perfect element placement
- **🔤 Local Font Support**: Merriweather font loaded locally to avoid CORS issues

## 🔐 Authentication

The application features secure authentication to ensure only authorized Romega Solutions team members can create and manage certificates.

### Default Credentials

**Username:** `admin`  
**Password:** `admin123`

### Security Features

- Session-based authentication
- Protected routes with middleware
- Automatic redirect to login for unauthenticated users
- Secure logout functionality
- Client-side route protection

### Changing Credentials

For production deployment, update the credentials in `src/lib/auth.ts`:

```typescript
export const DEMO_CREDENTIALS = {
  username: "your_new_username",
  password: "your_strong_password",
};
```

**Better Practice - Use Environment Variables:**

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_ADMIN_USERNAME=your_username
NEXT_PUBLIC_ADMIN_PASSWORD=your_strong_password
```

Then update `src/lib/auth.ts` to use these variables.

## 🏗️ Project Structure

```text
certgen/
├── public/
│   └── templates/              # Certificate templates
├── src/
│   ├── app/                    # Next.js app router
│   │   ├── page.tsx           # Landing page
│   │   ├── login/             # Authentication page
│   │   ├── dashboard/         # User dashboard
│   │   └── generator/         # Certificate editor
│   ├── components/
│   │   ├── auth/              # Authentication components
│   │   │   ├── login-form.tsx
│   │   │   └── protected-route.tsx
│   │   ├── certificate/       # Core certificate components
│   │   │   ├── canvas.tsx              # Main editing workspace
│   │   │   ├── download-button.tsx     # PNG export functionality
│   │   │   ├── draggable-text.tsx      # Text element manipulation
│   │   │   ├── text-controls.tsx       # Text customization panel
│   │   │   ├── image-controls.tsx      # Image management
│   │   │   ├── template-selector.tsx   # Template browser
│   │   │   └── batch-generator.tsx     # Bulk certificate generation
│   │   ├── layout/            # Layout components
│   │   │   ├── navbar.tsx
│   │   │   └── sidebar.tsx
│   │   ├── onboarding/        # User guidance
│   │   │   ├── tour.tsx
│   │   │   └── generator-tour.tsx
│   │   └── ui/                # Shadcn/ui components
│   │       ├── button.tsx
│   │       └── accordion.tsx
│   ├── hooks/
│   │   └── use-auth.ts        # Authentication hook
│   ├── lib/
│   │   ├── auth.ts            # Auth utilities
│   │   ├── utils.ts           # Helper functions
│   │   └── batch-generator.ts # Batch processing
│   ├── types/
│   │   ├── certificates.ts    # Certificate type definitions
│   │   └── batch.ts           # Batch generation types
│   ├── styles/
│   │   └── globals.css        # Global styles + Romega Solutions theme
│   └── assets/
│       └── fonts/             # Local font files
│           ├── Merriweather_24pt-Bold.ttf
│           └── Merriweather_24pt-Regular.ttf
├── .env.local                 # Environment variables (create this)
├── next.config.js             # Next.js configuration
├── tailwind.config.js         # Tailwind + RS color system
└── package.json
```

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command         | Action                                       |
| :-------------- | :------------------------------------------- |
| `npm install`   | Installs dependencies                        |
| `npm run dev`   | Starts local dev server at `localhost:3000`  |
| `npm run build` | Build your production site to `./.next/`     |
| `npm run start` | Preview your build locally, before deploying |
| `npm run lint`  | Run ESLint to check code quality             |

## 🛠️ Tech Stack

- **[Next.js 14](https://nextjs.org/)** - React framework with App Router
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Shadcn/ui](https://ui.shadcn.com/)** - Beautiful, accessible UI components
- **[html2canvas](https://html2canvas.hertzen.com/)** - High-quality image export
- **[Lucide Icons](https://lucide.dev/)** - Clean, customizable icons

## 🎨 Color Scheme - Romega Solutions

The project uses the official Romega Solutions color system:

### Primary Colors (Blue)

- **rs-primary-50** to **rs-primary-950**: Full range of blue shades
- **Main brand color**: `hsla(209, 100%, 45%, 1)` (rs-primary-500)

### Accent Colors (Yellow/Orange)

- **rs-accent-50** to **rs-accent-950**: Full range of yellow/orange shades
- **Secondary accent**: `hsla(42, 94%, 45%, 1)` (rs-accent-500)

### Neutral Colors

- **rs-neutral-50** to **rs-neutral-950**: Gray scale for text and backgrounds

### Typography

- **Headings**: Merriweather (serif) - Loaded locally
- **Body Text**: System fonts for optimal performance
- **Monospace**: Geist Mono for code snippets

## 📝 How to Use

1. **Login** using your credentials

2. **Navigate to Generator** from the dashboard

3. **Select a Template** or upload your own

4. **Add Text Elements**:

   - Click "Add Text" to create new elements
   - Drag elements to position them
   - Customize font, size, color, and alignment

5. **Add Images** (optional):

   - Upload logos or graphics
   - Position and resize as needed

6. **Preview in Real-Time**:

   - All changes appear instantly
   - Zoom in/out for precise editing

7. **Download Certificate**:

   - Click "Download PNG" button
   - High-quality 2x resolution export
   - Custom filename with timestamp

8. **Batch Generation** (Coming Soon):
   - Upload CSV with recipient data
   - Generate multiple certificates at once

## 💡 Core Components

### Canvas Component

Main editing workspace with:

- Drag & drop functionality
- Element selection
- Real-time preview
- Canvas scaling

### DownloadButton Component

High-quality export featuring:

- html2canvas integration
- 2x scale for crisp output
- CORS handling
- Error management

### DraggableText Component

Text manipulation with:

- Free positioning
- Visual selection feedback
- Mouse-based dragging
- Position updates

### TextControls Component

Customization panel including:

- Font family picker
- Size slider
- Color picker
- Alignment options

## 🎯 Customization

### Adding New Templates

1. Add template image to `public/templates/`
2. Update template list in `template-selector.tsx`
3. Configure default dimensions

### Styling Changes

- Modify Tailwind classes in components
- Update RS colors in `tailwind.config.js`
- Add custom CSS in `globals.css`

### Font Customization

To use different fonts:

1. Add font files to `src/assets/fonts/`
2. Update `@font-face` in `globals.css`
3. Reference in text controls

## 🖼️ Image Export Quality

The download functionality generates professional-quality images:

- **2x Resolution**: Double the display resolution
- **Scale Factor**: Configurable for higher quality
- **CORS Handling**: `useCORS` and `allowTaint` enabled
- **Background**: White (#ffffff) for compatibility
- **Format**: PNG for lossless quality
- **File Naming**: Auto-generated with timestamp

## 📱 Responsive Design

The application adapts to all screen sizes:

- Mobile-optimized interface
- Touch-friendly controls
- Responsive canvas scaling
- Adaptive sidebar
- Mobile-first approach

## 🔒 Security Best Practices

1. **Change default credentials** before production
2. **Use environment variables** for sensitive data
3. **Enable HTTPS** in production
4. **Implement rate limiting** for auth endpoints
5. **Regular security audits** of dependencies
6. **Secure session management** with HTTP-only cookies

## 🚀 Deployment

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Steps

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd certgen
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   # Edit .env.local with your credentials
   ```

4. **Build for production**

   ```bash
   npm run build
   ```

5. **Deploy to hosting provider**
   - **Vercel** (Recommended): `vercel --prod`
   - **Netlify**: Connect repository
   - **AWS/Azure**: Use appropriate deployment tools
   - Ensure environment variables are set

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

Need help? Contact:

- **IT Support**: [it@romega-solutions.com](mailto:it@romega-solutions.com)
- **Developer**: [kengarcia.romegasolutions@gmail.com](mailto:kengarcia.romegasolutions@gmail.com)

## 👀 Want to learn more?

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Shadcn/ui Documentation](https://ui.shadcn.com/)
- [html2canvas Documentation](https://html2canvas.hertzen.com/)

---

**Built with ❤️ by [Ken Patrick Garcia](mailto:kengarcia.romegasolutions@gmail.com) for Romega Solutions**

**Version:** 1.0.0  
**Last Updated:** November 2025
