# Instant Infra

A modern web application for tracking cloud infrastructure deployments and challenges.

## Features

- **Project Tracker**: Monitor cloud infrastructure projects and their completion status
- **Cloud Provider Support**: AWS, GCP, Azure, and Oracle Cloud
- **Deployment Tracking**: Track various deployment types (EC2, Compute Engine, VMs, etc.)
- **Interactive Game**: Spin wheel game for project selection
- **Local Database**: Uses local JSON data for development and deployment

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **UI Components**: Radix UI + Tailwind CSS
- **State Management**: React Query + Context API
- **Database**: Local JSON database (no external dependencies)
- **Routing**: React Router DOM
- **Build Tool**: Vite

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd instant-infra.com
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## Local Database

The application uses a local JSON database located in `src/lib/localDatabase.ts`. This file contains:

- **Challenges**: Infrastructure deployment challenges with completion status
- **Cloud Providers**: Supported cloud service providers (AWS, GCP, Azure, Oracle)
- **Deployments**: Various deployment types for each provider

### Data Structure

```typescript
interface Challenge {
  id: string;
  provider_name: string;
  deployment_name: string;
  is_done: boolean;
  created_at: string;
}

interface CloudProvider {
  id: string;
  name: string;
  color: string;
}

interface Deployment {
  id: string;
  name: string;
  provider_id: string;
}
```

### Adding New Data

To add new challenges, providers, or deployments, edit the `localData` object in `src/lib/localDatabase.ts`.

## Project Structure

```
src/
├── components/          # React components
├── contexts/           # React contexts (Auth, etc.)
├── hooks/              # Custom React hooks
├── lib/                # Utilities and local database
├── pages/              # Page components
├── services/           # Data services
├── types/              # TypeScript type definitions
└── ui/                 # Reusable UI components
```

## Authentication

The application includes a simple local authentication system that simulates user login/logout functionality. In a production environment, you can replace this with your preferred authentication provider.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
