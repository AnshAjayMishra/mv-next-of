# MockVault - Interview Platform

MockVault is a comprehensive interview platform that supports both online and offline interviews. It allows administrators to create interview panels, faculty members to evaluate students, and students to view their interview schedules and results.

## Features

- Admin panel creation with technical and communication faculty assignments
- Student interview scheduling
- Faculty evaluation system with scoring and feedback
- Student dashboard for viewing interview schedules and results
- Secure authentication using Clerk
- Real-time data management using Convex

## Tech Stack


- Next.js 14 with App Router
- TypeScript
- Tailwind CSS
- Convex for backend
- Clerk for authentication
- Shadcn UI components

## Getting Started

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd mockvault
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Create a `.env.local` file in the root directory
   - Add the following variables:
     ```
     NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
     CLERK_SECRET_KEY=your_clerk_secret_key
     NEXT_PUBLIC_CONVEX_URL=your_convex_url
     CONVEX_DEPLOYMENT=your_convex_deployment
     ```

4. Set up Clerk:
   - Create a Clerk account at https://clerk.com
   - Create a new application
   - Copy the publishable and secret keys to your `.env.local` file

5. Set up Convex:
   - Install the Convex CLI:
     ```bash
     npm install -g convex
     ```
   - Initialize Convex in your project:
     ```bash
     npx convex dev
     ```
   - Copy the Convex URL and deployment to your `.env.local` file

6. Run the development server:
   ```bash
   npm run dev
   ```

7. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

- `/src/app` - Next.js app router pages
- `/src/components` - Reusable React components
- `/convex` - Convex backend functions and schema
- `/public` - Static assets

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
