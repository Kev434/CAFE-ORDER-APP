# Cafe Order App - Frontend

Next.js frontend for the Cafe Order App.

## Prerequisites

- Node.js 18+
- npm
- Supabase account (for authentication)
- Backend API running on `http://localhost:8080`

## Setup

1. Clone the repository and switch to the frontend branch:
   ```bash
   git clone https://github.com/Kev434/CAFE-ORDER-APP.git
   cd CAFE-ORDER-APP
   git checkout frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file:
   ```bash
   cp .env.local.example .env.local
   ```
   Then fill in your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   NEXT_PUBLIC_API_URL=http://localhost:8080/api
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

The app starts on `http://localhost:3000`.
