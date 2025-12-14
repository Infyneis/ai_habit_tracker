# ✨ HabitFlow - AI Habit Tracker `#2/365 - 1 Year Challenge`

> *Building something new every day for a year. Day 2: An AI-powered habit tracker with beautiful animations and a lavender theme.*

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?style=for-the-badge&logo=postgresql)
![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?style=for-the-badge&logo=prisma)
![Ollama](https://img.shields.io/badge/Ollama-Llama_3.2-white?style=for-the-badge)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=for-the-badge&logo=docker)

---

## 💜 Overview

**HabitFlow** is a beautiful, AI-powered habit tracking application designed to help you build lasting habits. With personalized affirmations, smart suggestions, and delightful animations, staying consistent has never felt so good.

---

## 🎯 Features

| Feature | Description |
|---------|-------------|
| 🔥 **Streak Tracking** | Keep your momentum going with beautiful streak counters |
| 🤖 **AI Affirmations** | Daily personalized affirmations powered by Llama 3.2 |
| 💡 **Smart Suggestions** | AI-powered habit suggestions based on your patterns |
| 🏷️ **Categories & Tags** | Organize habits with custom categories and tags |
| 🔔 **Reminders** | In-app, push, and email notifications |
| 📊 **Analytics** | Weekly and monthly progress charts |
| 🌙 **Dark Mode** | Beautiful lavender theme in light & dark modes |
| ✨ **Animations** | Delightful micro-interactions and celebrations |

---

## 🏗️ Architecture

```
ai_habit_tracker/
├── 🐳 docker-compose.yml      # PostgreSQL + Ollama services
├── 📦 prisma/
│   └── schema.prisma          # Database models
├── 🎨 src/
│   ├── app/
│   │   ├── page.tsx           # Dashboard
│   │   ├── habits/            # Habits management
│   │   ├── stats/             # Analytics & charts
│   │   ├── settings/          # User preferences
│   │   └── api/               # REST endpoints
│   │       ├── habits/        # CRUD operations
│   │       ├── completions/   # Track progress
│   │       └── ai/            # Ollama integration
│   ├── components/
│   │   ├── ui/                # shadcn/ui components
│   │   ├── habits/            # Habit cards & forms
│   │   ├── dashboard/         # Stats & widgets
│   │   ├── animations/        # Confetti & effects
│   │   └── layout/            # Navigation
│   └── lib/
│       ├── prisma.ts          # Database client
│       └── ollama.ts          # AI client
└── 🎭 public/                 # Static assets
```

---

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose
- Node.js 18+
- pnpm (recommended)

### 1. Clone & Install

```bash
git clone <your-repo>
cd ai_habit_tracker
pnpm install
```

### 2. Prerequisites

```bash
# Install Ollama (macOS)
brew install ollama
```

### 3. Start Everything

```bash
# One command to rule them all! 🚀
./start.sh
```

This script will:
- 🐳 Start PostgreSQL via Docker
- 🦙 Start Ollama and pull Llama 3.2
- 🗄️ Setup the database
- 🚀 Launch the dev server

Open [http://localhost:3000](http://localhost:3000) and start building habits! 🎉

---

## 🎨 Theme

HabitFlow features a stunning **lavender color palette** with full light and dark mode support:

| Mode | Primary | Background | Accent |
|------|---------|------------|--------|
| ☀️ Light | `#a855f7` | `#faf5ff` | `#c084fc` |
| 🌙 Dark | `#a855f7` | `#1a1625` | `#7c3aed` |

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL 16 + Prisma ORM
- **AI**: Ollama with Llama 3.2
- **UI**: shadcn/ui + Radix UI
- **Styling**: Tailwind CSS 4
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Validation**: Zod
- **Notifications**: Sonner

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/habits` | List all habits |
| `POST` | `/api/habits` | Create a habit |
| `GET` | `/api/habits/[id]` | Get habit details |
| `PUT` | `/api/habits/[id]` | Update a habit |
| `DELETE` | `/api/habits/[id]` | Delete a habit |
| `POST` | `/api/completions` | Mark habit complete |
| `DELETE` | `/api/completions` | Remove completion |
| `POST` | `/api/ai/affirmation` | Generate affirmation |
| `POST` | `/api/ai/suggestions` | Get habit suggestions |

---

## 🐳 Docker Services

```yaml
services:
  postgres:     # Database on port 5432
  ollama:       # AI on port 11434
  mailhog:      # Email testing on port 8025
```

---

## 📜 License

MIT License - Build amazing things!

---

<div align="center">

Made with 💜 for habit builders everywhere

**Day 2 of 365** | [Year Coding Challenge](https://github.com/Infyneis)

</div>
