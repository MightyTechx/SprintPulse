# InfyEnergy Mobile App

A beautiful, modern React Native mobile app for wind farm operations and task management using Expo.

## Features

- **Dashboard** - Real-time system overview with live stats and metrics
- **PTW Workflows** - Manage permits-to-work for maintenance operations
- **Maintenance Tasks** - Track and manage maintenance activities
- **Notifications** - Alert system for updates, reminders, and system events
- **Profile** - User settings, preferences, and account management
- **Authentication** - Secure login with token-based authentication

## Tech Stack

- **Framework**: Expo SDK 52 with React Native
- **Navigation**: Expo Router (file-based routing)
- **UI Library**: React Native Paper (Material Design 3)
- **Icons**: Ionicons + React Native Vector Icons
- **Animations**: React Native Reanimated
- **Storage**: MMKV for fast local storage
- **Gradients**: Expo Linear Gradient
- **Theme**: Beautiful dark theme with cyan/purple accents

## Getting Started

### Prerequisites

- Node.js 18+
- Expo CLI
- npm or yarn

### Installation

```bash
cd mobile
npm install
```

### Running the App

```bash
# Start Metro bundler
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android
```

### Building for Production

```bash
# Configure EAS Build (first time only)
eas build:configure

# Build for Android
npm run build:android

# Build for iOS
npm run build:ios
```

## Project Structure

```
mobile/
├── app/                    # Expo Router pages
│   ├── (ptw)/             # PTW workflows
│   │   ├── index.tsx       # PTW Dashboard
│   │   ├── createTicket.tsx # Create PTW ticket
│   │   ├── searchTicket.tsx # Search PTW tickets
│   │   └── notifications.tsx
│   ├── (maintenance)/      # Maintenance operations
│   │   ├── index.tsx       # Maintenance Dashboard
│   │   ├── create.tsx     # Create maintenance task
│   │   ├── search.tsx     # Search maintenance tasks
│   │   └── notifications.tsx
│   ├── auth/              # Authentication screens
│   │   └── login.tsx
│   └── _layout.tsx        # Root layout and navigation
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── GradientCard.tsx
│   │   ├── StatCard.tsx
│   │   └── CircularProgress.tsx
│   ├── services/          # API and auth services
│   ├── theme/             # Theme configuration
│   ├── types/             # TypeScript types
│   └── utils/             # Utility functions
├── assets/                # App icons and splash
└── app.json              # Expo configuration
```

## API Configuration

Update the API base URL in `src/services/api.ts`:

```typescript
const API_BASE_URL = 'http://localhost:3600'; // Your backend URL
```

## Design System

### Colors

- **Primary**: `#00D9FF` (Cyan)
- **Secondary**: `#7B61FF` (Purple)
- **Success**: `#00E676`
- **Warning**: `#FFD600`
- **Danger**: `#FF5252`
- **Background**: `#0A1628`

### Components

All components support dark theme by default with gradient overlays and glowing effects for a premium feel.

## License

MIT