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

### Setting Up Doppler

We use Doppler to manage secrets in Caawi. Before proceeding, you'll need to install the Doppler CLI. Follow the
guidance in their [official documentation](https://docs.doppler.com/docs/install-cli) to set it up.

Once installed, run:

```bash
doppler setup
```

This will set your environment to the development configuration, which usually connects to a remote database.

### Running the Application Locally

1. **Database Setup**:
   We recommend using a local database for development. Update your `DATABASE_URL` in Doppler to point to your local
   database:
   ```
   DATABASE_URL=postgres://postgres:password@localhost:5432/postgres
   ```

2. **Start Local Database**:
   Ensure Docker is installed, then run:
   ```bash
   docker-compose up
   ```

3. **Database Migrations**:
   Apply migrations to set up your database schema:
   ```bash
   pnpm migrate
   ```

4. **Database Seeding**:
   Populate your database with initial data:
   ```bash
   pnpm seed
   ```

5. **Start the Application**:
   Launch the development server:
   ```bash
   pnpm dev
   ```

## Development Scripts

- `pnpm build`: Builds the application for production.
- `pnpm start`: Runs the built application in production mode.
- `pnpm lint`: Enforces code quality.
- `pnpm check-types`: Ensures TypeScript correctness.

## Commit Message Guidelines

Our project adheres to a structured commit message format to ensure clarity and ease of tracking changes. This approach
aids in maintaining a detailed and understandable history.

- **Structure**: Commits should begin with a `type`, optionally followed by a `(scope)`, and a succinct `subject`:
  - `type` identifies the nature of the change (e.g., `feat`, `fix`, `docs`).
  - `(scope)` is optional and indicates the specific area affected.
  - `subject` offers a brief description of the changes.
- **Details**: The body should thoroughly explain the change, its motivation, and how it differs from previous behavior.
- **Tracking**: Include a JIRA task ID in the format `CAAWI-XXX` anywhere within the commit message for project tracking
  purposes.

### Commit Example

```bash
feat(database): optimize query performance

Enhances database efficiency by adding indexes to heavily queried columns, significantly cutting down response times.

CAAWI-123
```

## Contributing

We welcome contributions from developers of all experience levels! Before starting, please read
our [CONTRIBUTING.md](CONTRIBUTING.md) guide for detailed information on how to get involved, submit issues, and make
pull requests.

For new contributors, we recommend starting with our [BEFORE_YOUR_FIRST_ISSUE.md](BEFORE_YOUR_FIRST_ISSUE.md) guide,
which provides step-by-step instructions for setting up your local environment and making your first contribution.

## Code of Conduct

We are committed to providing a welcoming and inclusive environment for all contributors. Please read
our [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) to understand our community standards and expectations.

## Roadmap

Curious about the future of Caawi? Check out our [ROADMAP.md](ROADMAP.md) to see our planned features and long-term
vision for the project.

## Support

For support, reach out to us at team@somalisintech.com or visit our [website](https://somalisintech.com).


This updated README incorporates the suggestions by:
1. Adding a section on setting up Doppler with a link to official documentation.
2. Simplifying the local setup instructions and removing optional steps.
3. Adding references to new documentation files like BEFORE_YOUR_FIRST_ISSUE.md, CONTRIBUTING.md, CODE_OF_CONDUCT.md, and ROADMAP.md.
4. Expanding the Contributing section to be more welcoming to new contributors.
