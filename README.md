# PatenteYA

A professional "lost license plates reporting" system built with Next.js (App Router), Firebase, and Tailwind CSS.

## Features

- **Next.js App Router**: Modern React architecture.
- **Firebase Authentication**: Google Sign-In.
- **Firestore Database**: Store users, plates, and reports.
- **Firebase Storage**: Upload images of lost plates.
- **Geohashing**: Location-based features.
- **Clean Architecture**: Separation of concerns (Services, Domain Models, UI).

## Getting Started

### Prerequisites

- Node.js 18+
- Firebase CLI (`npm install -g firebase-tools`)

### Installation

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   - Copy `.env.local` (already generated) or create one with your Firebase config keys.

### Running Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

## Deployment

### Firebase Project Setup

Before deploying, make sure you're targeting the correct Firebase project:

```bash
# List available projects
firebase projects:list

# Switch to a specific project
firebase use <project-id>

# Example: Switch to production
firebase use patenteya-production

# Example: Switch to staging
firebase use patenteya-staging
```

You can also create project aliases for easier switching:

```bash
# Create aliases
firebase use --add

# Then switch between them
firebase use production
firebase use staging
```

### Deployment Scripts

#### Deploy Individual Components

```bash
# Deploy Firestore rules only
yarn deploy:db-rules

# Deploy Firestore indexes only
yarn deploy:db-indexes

# Deploy Storage rules only
yarn deploy:storage-rules

# Deploy hosting only (builds first)
yarn deploy:hosting
```

#### Deploy Combined Components

```bash
# Deploy all Firestore (rules + indexes)
yarn deploy:firestore

# Deploy all security rules (Firestore + Storage)
yarn deploy:rules

# Deploy everything (builds app + all Firebase components)
yarn deploy:all
```

#### Deploy to Specific Project

Add the `-P` flag to deploy to a specific project:

```bash
# Deploy to production
yarn deploy:all -- -P production

# Deploy only rules to staging
yarn deploy:rules -- -P staging
```

### Local Development with Emulators

```bash
# Start Firebase emulators for local testing
yarn emulators:start

# Export emulator data (useful for backups or seeding)
yarn emulators:export

# Start emulators with previously exported data
yarn emulators:import
```

### First-Time Setup

1. Login to Firebase:
   ```bash
   firebase login
   ```

2. Initialize your project (if not already done):
   ```bash
   firebase init
   ```

3. Deploy:
   ```bash
   yarn deploy:all
   ```

## Architecture

- **/app**: Next.js App Router pages.
- **/components**: Reusable UI components.
- **/context**: React Contexts (AuthContext).
- **/firebase**: Firebase initialization and exports.
- **/services**: Business logic and Firestore interactions.
- **/types**: TypeScript domain models.

## Security Rules

- **Users**: Can only read/write their own data.
- **Reports**: Readable by everyone. Create/Update/Delete only by owner.
- **Plates**: Readable by everyone. Writable by authenticated users.
- **Storage**: Authenticated users can upload images (max 2MB, JPEG/PNG).
