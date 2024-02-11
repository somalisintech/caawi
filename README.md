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
- PNPM
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
   pnpm migrate
   ```
4. **Database Seeding**: To seed the database with initial data:
   ```bash
   pnpm seed
   ```
5. **Start the Application**: Finally, launch the application:
   ```bash
   pnpm dev
   ```

## Development Scripts

- `pnpm build`: Builds the application for production.
- `pnpm start`: Runs the built application in production mode.
- `pnpm lint`: Enforces code quality.
- `pnpm check-types`: Ensures TypeScript correctness.

## Commit Message Guidelines

To ensure consistency and readability of our project's history, we enforce specific commit message rules
using `commitlint`. This helps in tracking changes and linking them back to our project management tools. Here’s what
you need to know:

- **Commit Message Structure**: Our commit messages are structured to include a type, scope (optional), and a subject,
  followed by a body that details the change and, optionally, a footer that can reference issue tracker IDs.

  Example:
  ```text
  feat(database): add indexing to improve query performance
  
  The new indexing significantly speeds up user search queries. Benchmarks indicate a 50% improvement on average.
  
  CAAWI-123
  ```

- **Type**: Indicates the kind of change you're making, such as `feat` (new feature), `fix` (bug fix), `docs` (
  documentation), etc.

- **Scope** (Optional): Provides additional context on where the change applies, such as `database`, `frontend`, etc.

- **Subject**: A brief description of the change.

- **Body** (Mandatory for JIRA ID): Should provide a detailed description of the change. **Include the JIRA job ID (
  e.g., CAAWI-1234) here to link the commit to our project management tool.**

- **Footer** (Optional): Can include additional notes, such as `BREAKING CHANGE` or references to issue tracker IDs.

### Enforced Rules:

- **Header**: Must not exceed 100 characters. This encourages succinct and precise summaries of changes.
- **Body**: Must include a JIRA job ID for traceability (e.g., "Refs CAAWI-1234"). This is crucial for linking commits
  to specific tasks or issues in our project management tool.
- **No Trailing Period**: Commit titles should not end with a period.

For a detailed list of all the `commitlint` rules we follow, please refer to our `commitlint.config.js` file in the
repository.

## Contributing

We welcome contributions! For guidelines on how to get involved, please consult our contributing guide.

## Support

For support, reach out to us at team@somalisintech.com or visit our [website](https://somalisintech.com).
