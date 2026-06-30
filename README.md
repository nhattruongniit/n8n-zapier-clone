# 🚀 n8n Clone – Workflow Automation Platform

A modern **n8n-inspired workflow automation platform** built with **Next.js**, **TypeScript**, and **Tailwind CSS**. Create, connect, and automate workflows with a visual editor, AI integrations, and real-time execution monitoring.

```bash
# install dependencies
$ npm install

# run the development server localhost:3000
$ npm run dev

# Prisma Studio
$ npx prisma studio

# generate schema to code 
$ yarn prisma generate

# create migrations version every update schema
$ yarn prisma migrate dev --create-only --name ${name}

# apply migration file to db
$ yarn prisma migrate deploy
```

## ✨ Features

* 🔐 User Authentication
* 💳 Payment & Subscription Management
* ⚡ Real-time Workflow Execution
* 🎨 Visual Workflow Builder (React Flow)
* 🤖 AI Integration (OpenAI & Gemini)
* 📊 Workflow Execution History
* 🌙 Modern UI with shadcn/ui
* 📱 Responsive Design
* 🛡️ Error Monitoring with Sentry
* 🤖 AI Code Review with CodeRabbit


## 🛠️ Tech Stack

### Frontend

* Next.js 15 (App Router) - https://nextjs.org/docs/app/getting-started/installation
* React 19 - https://reactjs.org/docs/getting-started.html
* TypeScript - https://www.typescriptlang.org/docs/
* Tailwind CSS v4 - https://tailwindcss.com/docs/installation
* shadcn/ui - https://ui.shadcn.com/docs/installation/next
* React Flow - https://reactflow.dev/docs/
* tRPC - https://trpc.io/docs/client/nextjs/app-router-setup
* zod - https://zod.dev/
* tanstack/react-query - https://tanstack.com/query/v4/docs/overview

### Backend

* Next.js Route Handlers
* Prisma ORM - https://www.prisma.io/docs/guides/frameworks/nextjs
* PostgreSQL (Neon) - https://neon.com/

### Authentication

* Better Auth (or replace with your auth provider)

### Database

* Neon PostgreSQL

### Payments

* Stripe

### AI

* OpenAI
* Google Gemini

### DevOps & Tooling

* ESLint
* Prettier
* CodeRabbit - https://www.coderabbit.ai/
* Sentry
* GitHub Actions (optional)


## 📦 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/nhattruongniit/n8n-zapier-clone
cd n8n-zapier-clone
```

### 2. Install dependencies

```bash
npm install
```

or

```bash
pnpm install
```

### 3. Configure environment variables

Create a `.env` file in the project root.

```env
DATABASE_URL=
```

### 4. Generate Prisma Client

```bash
npx prisma generate
```

### 5. Run database migrations

```bash
npx prisma migrate dev
```

### 6. Start the development server

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

---

## 📂 Project Structure

```text
src/
├── app/
├── components/
├── features/
├── hooks/
├── lib/
├── server/
├── services/
├── types/
└── utils/

prisma/
public/
```


## 📄 License

This project is licensed under the MIT License.
