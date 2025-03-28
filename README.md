1.Framework & Architecture:
    Next.js 15 with App Router architecture
    React 18.3 for UI components
    Client-side components with 'use client' directive
    Organized folder structure with route groups

2.Database:
    PostgreSQL database (Neon serverless Postgres)
    Drizzle ORM for database operations
    Schema with two main tables:
    Budget: id, name, amount, icon, createdBy
    Expense: id, amount, description, budgetId, createdAt, createdBy

3.Authentication:
    Clerk for authentication and user management
    Protected routes with middleware
    User email used as the createdBy identifier

4.UI Components:
    Shadcn UI component library
    Tailwind CSS for styling
    Lucide React for icons
    Responsive design with mobile and desktop layouts
    Loading states with skeleton loaders

5.Data Visualization:
    Recharts for data visualization
    Dashboard with charts and summaries

6.Key Features:
    Create and manage budgets with icons and amounts
    Track expenses against budgets
    View spending analytics and summaries
    Dashboard with overview of all budgets and expenses
    CRUD operations for budgets and expenses

7.State Management:
    React useState and useEffect for local state management
    API calls using Drizzle ORM