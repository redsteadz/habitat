# HobbyStreak - Habit Tracking App

HobbyStreak is a modern habit tracking application built with Next.js, focusing on positive reinforcement through visually appealing animations and intuitive design. Track your daily activities, build consistent habits, and visualize your progress over time.

## Features

- 🎯 Daily habit tracking with streaks
- ✨ Visually appealing animations and UI
- 🌓 Dark/Light theme support
- 📊 Progress visualization
- 🔐 GitHub authentication
- 🚀 Real-time updates
- 📱 Responsive design

## Tech Stack

- **Framework:** Next.js 15.3
- **Styling:** Tailwind CSS, Framer Motion
- **Database:** PostgreSQL with Drizzle ORM
- **Authentication:** NextAuth.js
- **UI Components:** Radix UI, shadcn/ui
- **Deployment:** Vercel/Netlify ready

## Getting Started

### Prerequisites

- Node.js (18.18.0 or higher)
- PostgreSQL
- pnpm/npm/yarn/bun

### Environment Setup

1. Clone the repository:

```bash
git clone https://github.com/redsteadz/habitat
cd hobbyist
```

2. Create a `.env` file in the root directory:

```env
DATABASE_URL="postgresql://admin:root@localhost:5432/test_db"
GITHUB_ID=your_github_id
GITHUB_SECRET=your_github_secret
```

### Development

1. Start the PostgreSQL database using Docker:

```bash
cd src/server/db
docker-compose up -d
```

2. Install dependencies:

```bash
pnpm install
```

3. Set up the database:

```bash
pnpm db:generate  # Generate migrations
pnpm db:push      # Push migrations to database
pnpm db:seed      # (Optional) Seed the database
```

4. Start the development server:

```bash
pnpm dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

### Database Management

- `pnpm db:migrate` - Run database migrations
- `pnpm db:generate` - Generate new migrations
- `pnpm db:push` - Push schema changes
- `pnpm db:studio` - Open Drizzle Studio

## Project Structure

```
src/
├── app/              # Next.js app router
├── components/       # Reusable components
├── lib/             # Utility functions
├── server/          # Server-side code
│   └── db/          # Database configuration
└── middleware.ts    # Next.js middleware
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

[Your chosen license]

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Animations powered by [Framer Motion](https://www.framer.com/motion/)
