# JBRseo - Next.js Project

A Next.js 14+ application with TypeScript, Tailwind CSS, shadcn/ui, Prisma ORM, and MongoDB, optimized for Vercel deployment.

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **ORM**: Prisma
- **Database**: MongoDB
- **Deployment**: Vercel

## Project Structure

```
├── app/              # Next.js App Router pages and layouts
├── components/       # UI components
│   └── ui/          # shadcn/ui components
├── actions/          # Server actions and business logic
├── helpers/          # Utility functions and hooks
├── prisma/           # Prisma schema and migrations
└── public/           # Static assets
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- MongoDB database (local or Atlas)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
Create a `.env` file in the root directory:
```env
DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

3. Generate Prisma Client:
```bash
npx prisma generate
```

4. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## shadcn/ui Components

To add shadcn/ui components, use:
```bash
npx shadcn@latest add [component-name]
```

Components will be installed in `components/ui/`.

## Prisma

### Generate Prisma Client
```bash
npx prisma generate
```

### Database Migrations
For MongoDB, Prisma uses `db push` instead of migrations:
```bash
npx prisma db push
```

### Prisma Studio
View your database:
```bash
npx prisma studio
```

## Vercel Deployment

### Environment Variables

Add these in your Vercel project settings:
- `DATABASE_URL` - MongoDB connection string
- `NEXT_PUBLIC_APP_URL` - Your app URL

### Build Configuration

The project includes a `vercel-build` script that:
1. Generates Prisma Client
2. Builds the Next.js application

This runs automatically on Vercel deployments.

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run postinstall` - Generate Prisma Client (runs after npm install)

## Folder Structure Rules

- **UI components** → `components/`
- **Server actions/Business logic** → `actions/`
- **Utility functions/Hooks** → `helpers/`

See README files in each directory for more details.




# jbrseo_whitelist
# jbrseo-whitelist-homepage
