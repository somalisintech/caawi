# Caawi Project

## Overview

Caawi is a pioneering digital mentorship platform created by Somalis in Tech, designed to foster connections between
mentors and mentees within the Somali tech community. It aims to support professional and personal development through
meaningful interactions, making mentorship more accessible, intuitive, and culturally relevant for our community members
worldwide.

## Features

- **Personalised Mentorship**: Matches mentors and mentees based on professional and personal development goals.
- **Cultural Resonance**: Tailored for the Somali tech community, ensuring relevance and understanding.
- **Global Network**: Offers access to a diverse, worldwide network of professionals and peers.

## Technology Stack

The platform is built with Next.js, Prisma, and Tailwind CSS, featuring robust authentication via Next Auth to ensure
secure user connections.

## Getting Started

### Prerequisites

- Node.js
- Docker (if setting up a local PostgreSQL database)
- Doppler CLI (for managing environment variables)

### Running the Application Locally

After executing `doppler setup`, your environment is set to the development configuration, which usually connects to a
remote database. To run the application with a local database:

1. **Adjust `DATABASE_URL` for Local Development**: Manually change the `DATABASE_URL` in your Doppler configuration to
   point to your local database (e.g., `postgres://postgres:password@localhost:5432/postgres`).

2. **Local Database Configuration** (Optional): If you prefer using a local database and have updated
   your `DATABASE_URL` accordingly, use Docker to start your PostgreSQL database. Ensure Docker is installed, then
   run `docker-compose up`.

3. **Database Migrations**: Before applying migrations, confirm they are intended for your local setup to avoid
   affecting production data.
   ```bash
   npm run migrate
   ```
4. **Database Seeding**: To seed the database with initial data:
   ```bash
   npm run seed
   ```
5. **Start the Application**: Finally, launch the application:
   ```bash
   npm run dev
   ```

## Development Scripts

- `npm run build`: Builds the application for production.
- `npm run start`: Runs the built application in production mode.
- `npm run lint`: Enforces code quality.
- `npm run check-types`: Ensures TypeScript correctness.

## Contributing

We welcome contributions! For guidelines on how to get involved, please consult our contributing guide.

## Support

For support, reach out to us at team@somalisintech.com or visit our [website](https://somalisintech.com).
