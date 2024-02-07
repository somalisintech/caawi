# Caawi Project

## Overview

Caawi is a pioneering digital mentorship platform conceived by Somalis in Tech, aimed at bridging mentors and mentees within the Somali tech community. This initiative seeks to enhance professional and personal development by cultivating meaningful relationships. It aspires to revolutionize the mentorship landscape, ensuring it's more accessible, intuitive, and culturally attuned for our community members worldwide.

## Features

- **Personalised Mentorship**: Connect with mentors or mentees that align with your professional aspirations and personal growth goals.
- **Cultural Resonance**: A platform built by and for the Somali tech community, ensuring relevance and understanding.
- **Global Network**: Access a worldwide network of professionals and peers for a diverse mentorship experience.

## Technology Stack

Built with Next.js, Prisma, and Tailwind CSS, Caawi leverages the latest web technologies for a seamless user experience. It incorporates robust authentication mechanisms with Next Auth, ensuring secure and trustworthy connections between users.

## Getting Started

### Prerequisites

- Node.js
- Docker (for running a PostgreSQL database locally)
- Doppler CLI (for environment variable management)

### Running the Application Locally

1. **Environment Setup**: Use Doppler CLI for environment variable management. Install Doppler and initialise the project with `doppler setup`.

2. **Database Configuration**: Utilise Docker to run a PostgreSQL database. Ensure Docker is installed and execute `docker-compose up` to start the database.

3. **Database Migrations**: After the database is operational, set up the required tables by executing `npm run migrate`.

4. **Database Seeding**: Optionally, populate the database with initial data via `npm run seed`.

5. **Application Launch**: Start the application with `npm run dev` and navigate to the provided local server address.

## Development Scripts

- `npm run build` to build the application for production.
- `npm run start` to run the built application in production mode.
- `npm run lint` and `npm run lint:fix` for code quality and standards enforcement.
- `npm run check-types` for TypeScript type checking.

## Contributing

Contributions are welcome! Please refer to the contributing guidelines for more information on how to get involved.

## Support

For support, contact team@somalisintech.com or visit our [website](https://somalisintech.com).
