# Tuition Attendance Management System

A modern, full-stack attendance management system built with React, TypeScript, and Neon Database.

## Features

- ✅ Student management (add, edit, delete students)
- ✅ Daily attendance tracking
- ✅ Real-time attendance statistics
- ✅ Modern, responsive UI with Tailwind CSS
- ✅ TypeScript for type safety
- ✅ Neon Database for backend services

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Neon Database account

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Neon Database Setup

1. Create a new project at [neon.tech](https://neon.tech)
2. Go to your project dashboard
3. Navigate to Connection Details
4. Copy your connection string

### 3. Environment Configuration

1. Copy `env.example` to `.env.local`:
```bash
cp env.example .env.local
```

2. Update `.env.local` with your Neon connection string:
```
VITE_NEON_DATABASE_URL=postgresql://username:password@hostname/database?sslmode=require
```

### 4. Database Setup

Run the following SQL in your Neon SQL editor:

Use the provided `neon_setup.sql` file or copy the SQL from the file in the project root.

### 5. Run the Application

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/          # Reusable UI components
├── context/            # React context for state management
├── pages/              # Page components
├── types/              # TypeScript type definitions
├── databaseClient.ts   # Neon database client configuration
└── main.tsx           # Application entry point
```

## API Requirements

This application uses Neon Database as the backend, so you need:

1. **Neon Database Account**: Free tier available
2. **Database Tables**: Students and Attendance tables (SQL provided in neon_setup.sql)
3. **Environment Variables**: Neon connection string

No additional external APIs are required - everything is handled through Neon Database.

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Netlify

1. Build the project: `npm run build`
2. Deploy the `dist` folder to Netlify
3. Add environment variables in Netlify dashboard

## Support

For issues and questions, please check the Supabase documentation or create an issue in the repository.
