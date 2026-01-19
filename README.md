# ⚛ Electron Base Template

<div align="center">

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Electron](https://img.shields.io/badge/Electron-191970?style=flat&logo=Electron&logoColor=white)](https://electronjs.org/)
[![Rsbuild](https://img.shields.io/badge/Rsbuild-FF6B35?style=flat&logo=rspack&logoColor=white)](https://rsbuild.dev/)
[![Mantine](https://img.shields.io/badge/Mantine-339AF0?style=flat&logo=mantine&logoColor=white)](https://mantine.dev/)

**A modern Electron template with Rsbuild, Mantine UI, SQLite database, and TanStack Query**

[Features](#-features) • [Quick Start](#-quick-start) • [Configuration](#-configuration)

</div>

---

## 🛠️ Technology Used

- **Electron** — Cross-platform desktop application framework
- **Sequelize & Sequelize-Typescript** — Best Database ORM for TS apps, with many features and decators
- **React** — Modern user interface library
- **TypeScript** — Strongly typed JavaScript
- **Rsbuild** — Lightning-fast Rust-powered bundler compatible with Webpack
- **Mantine** — Elegant React component framework
- **Sequelize** — TypeScript ORM for relational databases (with SQLite)
- **TanStack Query (React Query)** — Powerful data fetching & caching
- **ESLint + Husky** — Enforced code standards and pre-commit hooks

## ✨ Features

### 🎨 **User Interface & Experience**

- **Mantine UI** - Comprehensive component library with 100+ accessible components
- **Custom Titlebar** - Native-looking titlebar with integrated window controls
- **Responsive Design** - Adaptive layouts that work across different screen sizes
- **Theme Support** - Built-in dark/light mode with Mantine's theming system
- **Cross-Platform Consistency** - Unified experience across Windows, macOS, and Linux

### 🗄️ **Database & State**

- **SQLite3 + Sequelize** - Embedded relational database with TypeScript ORM
- **TanStack React Query** - Server state management with caching and persistence
- **Migrations** - Database versioning with Umzug migration system


## 🚀 Quick Start

### Prerequisites

- **Node.js** (LTS or higher)
- **pnpm** (v10 or higher)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/setitch/electron-boilerplate
   cd electron-base
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Start development**

   ```bash
   pnpm start:dev
   ```

NOTE: `start:dev` sets environment variable to ,,developlemnt'' while `start` does not.
### Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm start:dev` | Start the app in development mode with hot reloading |
| `pnpm start` | Start the app in production mode |
| `pnpm package` | Package the app for the current platform |
| `pnpm make` | Create distributable packages for the current platform |
| `pnpm lint` | Run ESLint |
| `pnpm lint:fix` | Run ESLint with auto-fix |
| `pnpm clean` | Clean build artifacts and dependencies |

## 📁 Project Structure

```txt
├── src/
│   ├── main.ts                   # Main Electron process - here new IPC handlers should be registered
│   ├── preload.ts                # readonly: Preload script for secure IPC
│   ├── app/                      # React application, all code should be here.
│   ├── app/                      # React application, all code should be here.
│   │   ├── App.tsx               # Main app component, should register listeners for menu.
│   │   ├── error-boundary.tsx    # Helper class of React Element that catch errors better!
│   │   ├── components/           # Reusable UI components, example ones provided in directory structure
│   │   │   └── ... directory     # directory structure for components
│   │   ├── hooks /               # hooks for the react to use (database gooks, event, files eveyrhting that need node/electron from react)
│   │   ├── lib/                  # libraries and tools/functions that should be accesible in react
│   │   ├── providers /           # Providers for application
│   │   ├── screens/              # Application screens/pages
│   │   ├── screens/              # Application screens/pages
│   │   │   ├── fragments /       # React wide fragments available for every screen
│   │   │   └── ...... /          # each screen in own directory with own structure for screen based components
│   │   └── styles /              # css files
│   ├── consts/                   # files containing costs values for use in app (any part of it - common consts)
│   ├── electron/                 # Electron-specific code
│   │   ├── ipc/                  # IPC handlers
│   │   ├── menu/                 # node menu handlers
│   │   ├── workers/              # node workers
│   │   └── services/             # node services 
│   │       └── file-storage.service.ts      # service used by file IPC for actually interact with files in db and disk
│   ├── database/                 # SQLite database setup
│   │   ├── classes/              # Database classes
│   │   │   └── migration-helper.class.ts    # Helper class with migration functions
│   │   ├── migrations/           # Database migrations
│   │   └── models/               # Database Models in Sequelize
│   ├── consts/                   # Constants and channel definitions
│   └── @types/                   # TypeScript declarations
├── config/                       # Rsbuild configuration files
│   ├── rsbuild.config.ts         # Renderer config
│   ├── rsbuild.main.config.ts    # Main process config
│   └── rsbuild.preload.config.ts # Preload script config
└── assets/                  # Static assets (icons, fonts, images)
```

## 📄 License

This project is licensed under the [MIT License](./LICENSE).

---

<div align="center">

Based on [Reactronite](https://github.com/flaviodelgrosso/reactronite) by Flavio Del Grosso Thanks for the Idea!

Created by [Artur (Seti) Łabudziński](https://github.com/setitch)

</div>