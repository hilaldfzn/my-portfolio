# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start the development server at http://localhost:3000
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint to check for code issues

## Project Architecture

This is a Next.js 14 portfolio website built with TypeScript, featuring:

### Frontend Stack
- **Next.js 14** with App Router architecture
- **TypeScript** for type safety
- **Tailwind CSS** for styling with custom design system
- **Framer Motion** for animations and transitions
- **Radix UI** for accessible component primitives
- **next-themes** for dark/light theme support

### Project Structure
- `src/app/` - Next.js App Router pages and layouts
- `src/components/` - Reusable React components
  - `sections/` - Main page sections (hero, about, projects, etc.)
  - `ui/` - Base UI components following shadcn/ui patterns
  - `layout/` - Header and footer components
- `src/hooks/` - Custom React hooks
- `src/lib/` - Utility functions and configurations
- `public/assets/` - Static assets including images and CV

### Key Features
- **Responsive Design** - Mobile-first approach with Tailwind breakpoints
- **Dark Theme** - Default dark theme with theme switching capability
- **Animation System** - Framer Motion for page transitions and interactions
- **Contact Form** - Email functionality using Resend API
- **CV Download** - Robust PDF download with fallback handling
- **Performance Optimized** - Lazy loading, image optimization, and code splitting

### Component Patterns
- All components use TypeScript with proper type definitions
- UI components follow shadcn/ui conventions with `cn()` utility for class merging
- Client components use "use client" directive when needed for interactivity
- Components are organized by feature and reusability

### Styling System
- Custom CSS variables for theming in `globals.css`
- Tailwind config extends with custom colors, animations, and utilities
- Component-specific styles use Tailwind classes
- Responsive design with `sm:`, `md:`, `lg:`, `xl:` breakpoints

### State Management
- React hooks for local state
- Toast notifications for user feedback
- Theme state managed by next-themes provider

### Development Notes
- Path aliases configured with `@/*` pointing to project root
- ESLint configured with Next.js and TypeScript rules
- Strict TypeScript configuration enabled
- Font optimization using next/font with Inter