<div align="center">

# 🚀 Foresight

### A modern frontend application built with cutting-edge tools

<img src="https://skillicons.dev/icons?i=react,ts,vite,tailwind,redux,materialui" alt="tech stack icons" />

<br/>

![React](https://img.shields.io/badge/React-19.x-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-6.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind](https://img.shields.io/badge/TailwindCSS-4.x-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-5.x-433E38?style=for-the-badge&logo=react&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-7.x-CA4245?style=for-the-badge&logo=reactrouter&logoColor=white)

![Recharts](https://img.shields.io/badge/Recharts-3.x-8884d8?style=flat-square)
![Axios](https://img.shields.io/badge/Axios-1.x-5A29E4?style=flat-square&logo=axios&logoColor=white)
![Shadcn UI](https://img.shields.io/badge/Shadcn%20UI-Latest-000000?style=flat-square)
![PRs Welcome](https://img.shields.io/badge/PRs-Welcome-brightgreen?style=flat-square)

</div>

---

## 📖 Table of Contents

- [About the Project](#-about-the-project)
- [Tech Stack](#-tech-stack)
- [Features](#-features)
- [Folder Structure](#-folder-structure)
- [Prerequisites](#-prerequisites)
- [Install Node.js](#-install-nodejs)
- [Check Node.js Version](#-how-to-check-nodejs-version)
- [Update Node.js](#-what-if-my-node-version-is-older)
- [Clone the Repository](#-clone-the-repository)
- [Download ZIP Method](#-download-zip-method)
- [Open the Project](#-open-project-in-vs-code)
- [Install Dependencies](#-install-project-dependencies)
- [Environment Variables](#-environment-variables)
- [Run Development Server](#-start-development-server)
- [Project Dependencies](#-project-dependencies)
- [Development Dependencies](#-development-dependencies)
- [Common Commands](#-common-commands)
- [Troubleshooting](#-troubleshooting)
- [FAQ](#-frequently-asked-questions)
- [Recommended Extensions](#-recommended-vs-code-extensions)

---

## 📥 Clone the Repository

```bash
git clone https://github.com/your-username/foresight.git
cd foresight
```

---

## 📦 Download ZIP Method

If you don't want to use Git:

1. Open the GitHub repository
2. Click **Code**
3. Click **Download ZIP**
4. Wait for the download to finish
5. Extract the ZIP

Example:

```
Downloads/
    foresight-main.zip
```

Right-click → **Extract All** (or **Extract Here**)

Open the extracted folder and rename if desired:

```
foresight-main  →  foresight
```

---

## 💻 Open Project in VS Code

**Method 1**

Open VS Code → **File** → **Open Folder** → select `foresight` → **Open**

**Method 2**

Inside the project folder, open a terminal and run:

```bash
code .
```

---

## 📦 Install Project Dependencies

Inside the project folder, run:

```bash
npm install
```

This command downloads every dependency listed in `package.json`. A new folder named `node_modules` will be created automatically.

> ⏳ Installation may take several minutes depending on internet speed.

---

## 🔐 Environment Variables

Create a new file in the project root:

```
.env
```

Example layout:

```
foresight/
├── src/
├── public/
└── .env
```

Add the following variables:

```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=Foresight
VITE_APP_ENV=development
VITE_APP_VERSION=1.0.0
```

> ⚠️ **Important:** All Vite environment variables **must** begin with `VITE_`, otherwise they cannot be accessed inside the application.

### Access Environment Variables

```ts
const api = import.meta.env.VITE_API_URL;
```

---

## ▶️ Start Development Server

```bash
npm run dev
```

Output:

```
VITE v8.x

Local: http://localhost:5173
```

Open your browser at 👉 `http://localhost:5173`

---

## 📌 About the Project

**Foresight** is a modern frontend application developed using **React 19** and **TypeScript**. The project uses **Vite** as the build tool for lightning-fast development and optimized production builds.

The project follows modern frontend development practices including:

| ✅ Practice | Description |
|---|---|
| 🧩 Component-based architecture | Modular, reusable UI building blocks |
| 🛡️ Type-safe development | Powered by TypeScript |
| ⚡ Fast HMR | Instant feedback while coding |
| 🎨 Tailwind CSS v4 styling | Utility-first design system |
| 🧭 Client-side routing | Seamless navigation via React Router |
| 🗃️ Global state management | Centralized store via Zustand |
| 📱 Responsive UI | Looks great on any screen size |
| ♻️ Reusable components | DRY, maintainable code |
| 🌗 Theme support | Light / Dark mode |
| 📊 Charts & data visualization | Powered by Recharts |

---

## 🛠️ Tech Stack

<div align="center">
<img src="https://skillicons.dev/icons?i=react,ts,vite,tailwind,vscode,git,github,nodejs" />
</div>

| Technology | Version | Purpose |
|------------|----------|---------|
| ⚛️ React | 19.x | UI Library |
| 🔷 TypeScript | 6.x | Static typing |
| ⚡ Vite | 8.x | Build tool / dev server |
| 🎨 Tailwind CSS | 4.x | Styling |
| 🐻 Zustand | 5.x | State management |
| 🧭 React Router DOM | 7.x | Routing |
| 📊 Recharts | 3.x | Charts & graphs |
| 🌐 Axios | 1.x | HTTP client |
| 🧱 Shadcn UI | Latest | UI components |

---

## ✨ Features

- ⚛️ React 19
- 🔷 TypeScript
- ⚡ Vite
- 🎨 Tailwind CSS v4
- 🐻 Zustand State Management
- 🌐 Axios API Integration
- 📱 Responsive Design
- 🌗 Light/Dark Theme
- 📊 Charts
- ♻️ Reusable Components
- 🚀 Fast Build
- 🧹 ESLint
- ✅ Production Ready

---

## 📁 Folder Structure

```
foresight/
│
├── 📂 public/
│
├── 📂 src/
│   ├── 📂 assets/
│   ├── 📂 components/
│   ├── 📂 pages/
│   ├── 📂 layouts/
│   ├── 📂 hooks/
│   ├── 📂 services/
│   ├── 📂 store/
│   ├── 📂 utils/
│   ├── 📂 routes/
│   ├── 📄 App.tsx
│   └── 📄 main.tsx
│
├── 🔒 .env
├── 📦 package.json
├── ⚙️ vite.config.ts
├── ⚙️ tsconfig.json
├── 📘 README.md
└── 📦 node_modules/
```

---

## ✅ Prerequisites

Before running this project, make sure your computer has the following software installed.

- 🟢 Node.js
- 📦 npm
- 🔧 Git
- 💻 VS Code (Recommended)

---

## 🟢 Install Node.js

### Required Node.js Version

This project is tested using:

```
| Requirement | Minimum Version |
|-------------|-----------------|
| Node.js     | 22.x or later   |
| npm         | 10.x or later   |
```

> ⚠️ Older versions may cause dependency installation issues.

---

## 🔍 How to Check Node.js Version

Open your terminal.

**Windows**

Press `Win + R` → type `cmd` or `powershell`

Run:

```bash
node -v
```

Example output:

```
v22.16.0
```

Check npm version:

```bash
npm -v
```

Example output:

```
10.9.2
```

---

### ❓ What if Node.js is Not Installed?

Download Node.js from 👉 [nodejs.org](https://nodejs.org)

Install the latest **LTS** version, restart your terminal, then verify:

```bash
node -v
npm -v
```

---

### 🔄 What if My Node Version is Older?

Example:

```
Current Version   →   v16
Project Requires  →   v22
```

Update Node.js using one of the following methods.

**Method 1 (Recommended)**

Download latest LTS from [nodejs.org](https://nodejs.org/en/download) → Install → Restart terminal → Check again:

```bash
node -v
```

**Method 2 (Using nvm)**

Linux/macOS:

```bash
nvm install 22
nvm use 22
```

Windows: Install [nvm-windows](https://github.com/coreybutler/nvm-windows), then:

```bash
nvm install 22
nvm use 22
```

---

## 🔧 Install Git

Download from 👉 [git-scm.com/downloads](https://git-scm.com/downloads)

Verify:

```bash
git --version
```

---

## 📥 Clone the Repository

```bash
git clone https://github.com/your-username/foresight.git
cd foresight
```

---

## 📦 Download ZIP Method

If you don't want to use Git:

1. Open the GitHub repository
2. Click **Code**
3. Click **Download ZIP**
4. Wait for the download to finish
5. Extract the ZIP

Example:

```
Downloads/
    foresight-main.zip
```

Right-click → **Extract All** (or **Extract Here**)

Open the extracted folder and rename if desired:

```
foresight-main  →  foresight
```

---

## 💻 Open Project in VS Code

**Method 1**

Open VS Code → **File** → **Open Folder** → select `foresight` → **Open**

**Method 2**

Inside the project folder, open a terminal and run:

```bash
code .
```

---

## 📦 Install Project Dependencies

Inside the project folder, run:

```bash
npm install
```

This command downloads every dependency listed in `package.json`. A new folder named `node_modules` will be created automatically.

> ⏳ Installation may take several minutes depending on internet speed.

---

## 🔐 Environment Variables

Create a new file in the project root:

```
.env
```

Example layout:

```
foresight/
├── src/
├── public/
└── .env
```

Add the following variables:

```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=Foresight
VITE_APP_ENV=development
VITE_APP_VERSION=1.0.0
```

> ⚠️ **Important:** All Vite environment variables **must** begin with `VITE_`, otherwise they cannot be accessed inside the application.

### Access Environment Variables

```ts
const api = import.meta.env.VITE_API_URL;
```

---

## ▶️ Start Development Server

```bash
npm run dev
```

Output:

```
VITE v8.x

Local: http://localhost:5173
```

Open your browser at 👉 `http://localhost:5173`

---

## 📦 Project Dependencies

| Package | Purpose |
|---|---|
| ⚛️ **React / React DOM** | UI Library |
| 🧭 **React Router DOM** | Routing between pages |
| 🌐 **Axios** | HTTP client for REST API requests |
| 🐻 **Zustand** | Lightweight state management |
| 🎨 **Tailwind CSS** | Utility-first CSS framework |
| 🔗 **Tailwind Merge** | Merges Tailwind classes safely |
| 🧬 **Class Variance Authority** | Creates reusable component variants |
| ✨ **Lucide React** | Beautiful SVG icons |
| 📊 **Recharts** | Charts and graphs |
| 🌗 **Next Themes** | Theme switching (Dark / Light) |
| 🧱 **Shadcn UI** | Modern accessible UI components |
| 🔤 **Geist Font** | Modern typography |

---

## 🧪 Development Dependencies

| Package | Purpose |
|---|---|
| 🔷 **TypeScript** | Static type checking |
| ⚡ **Vite** | Fast bundler |
| 🧹 **ESLint** | Code quality checking |
| 🔄 **Babel** | JavaScript compiler |
| ⚙️ **React Compiler Plugin** | React optimization |
| 📝 **Type Definitions** | IntelliSense and typing support |

---

## 🧭 Common Commands

```bash
# Install packages
npm install

# Start server
npm run dev

# Build
npm run build

# Preview
npm run preview

# Lint
npm run lint
```

---

## 🩹 Troubleshooting

<details>
<summary><b>❌ node command not found</b></summary>

Install Node.js, then restart your terminal.
</details>

<details>
<summary><b>❌ npm command not found</b></summary>

Reinstall Node.js.
</details>

<details>
<summary><b>❌ Cannot find module</b></summary>

Run:
```bash
npm install
```
</details>

<details>
<summary><b>❌ Port already in use</b></summary>

Run:
```bash
npm run dev -- --port 3000
```
or stop the application already using port 5173.
</details>

<details>
<summary><b>🗑️ Delete node_modules</b></summary>

Sometimes packages become corrupted.

Delete `node_modules` and `package-lock.json`, then reinstall:
```bash
npm install
```
</details>

<details>
<summary><b>🧼 Clear npm Cache</b></summary>

```bash
npm cache clean --force
```
</details>

---

## ❓ Frequently Asked Questions

**Where should I put API URLs?**
Inside the `.env` file.

**Can I change the port?**
Yes:
```bash
npm run dev -- --port 3000
```

**Should I commit `.env`?**
No. Add it to `.gitignore`.

**What folder should I deploy?**
```
dist/
```

---

## 🧩 Recommended VS Code Extensions

- 🧹 ESLint
- 🎯 Prettier
- 🎨 Tailwind CSS IntelliSense
- 🔍 Error Lens
- 🌿 GitLens
- 🏷️ Auto Rename Tag
- 🏷️ Auto Close Tag
- 🗂️ Material Icon Theme

---


<div align="center">

Made with ❤️ using React, TypeScript & Vite

</div>
