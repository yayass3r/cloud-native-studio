<div align="center">

![Cloud-Native Studio](public/logo.png#gh-dark-mode-only)

# ⚡ Cloud-Native Studio

**بيئة تطوير سحابية متكاملة تعمل بالكامل داخل المتصفح**

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![WebContainers](https://img.shields.io/badge/WebContainers-API-blue?logo=stackblitz)](https://webcontainers.io/)
[![Monaco Editor](https://img.shields.io/badge/Monaco-Editor-007ACC?logo=visualstudiocode)](https://microsoft.github.io/monaco-editor/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS%204-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)

[English](#english) | [العربية](#arabic)

---

</div>

## English

### 🚀 Overview

Cloud-Native Studio is a full-stack IDE that runs entirely in the browser, powered by **WebContainers**. It provides a complete development environment with code editing, terminal access, live preview, and AI-powered assistance — no backend server needed.

### ✨ Features

| Feature | Technology |
|---------|-----------|
| **Code Editor** | Monaco Editor (VS Code engine) with syntax highlighting, autocomplete, and multi-language support |
| **Terminal** | xterm.js with GitHub dark theme, interactive stdin support |
| **Live Preview** | iframe-based with desktop/tablet/mobile viewport switching |
| **AI Assistant** | Arabic RTL chat interface powered by z-ai-web-dev-sdk |
| **File Explorer** | Tree view with file type icons |
| **Command Bar** | Quick npm commands (install, dev, build) |
| **Mobile Responsive** | Bottom tab navigation optimized for touch devices |
| **Auto Boot** | WebContainer boots and runs `npm install` automatically |

### 🛠 Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Container Runtime**: @webcontainer/api
- **Editor**: @monaco-editor/react
- **Terminal**: @xterm/xterm + @xterm/addon-fit
- **UI**: Tailwind CSS 4 + shadcn/ui
- **State**: Zustand
- **Animations**: Framer Motion
- **Language**: TypeScript

### 📦 Installation

```bash
# Clone the repository
git clone https://github.com/yayass3r/cloud-native-studio.git
cd cloud-native-studio

# Install dependencies
npm install

# Run development server
npm run dev
```

### 🔧 Configuration

The project requires **COOP/COEP headers** for `SharedArrayBuffer` support (needed by WebContainers). These are configured in `next.config.ts`:

```
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Embedder-Policy: credentialless
```

### 📁 Project Structure

```
src/
├── app/
│   ├── api/ai-chat/route.ts    # AI chat API endpoint
│   ├── globals.css              # Global styles & theme
│   ├── layout.tsx               # Root layout with COOP/COEP
│   └── page.tsx                 # Main page (IDE)
├── components/
│   ├── ide/
│   │   ├── ai-chat.tsx          # AI assistant panel
│   │   ├── code-editor.tsx      # Monaco editor wrapper
│   │   ├── command-bar.tsx      # Quick command bar
│   │   ├── file-explorer.tsx    # File tree browser
│   │   ├── ide-layout.tsx       # Main IDE layout
│   │   ├── live-preview.tsx     # Live preview iframe
│   │   ├── mobile-nav.tsx       # Mobile bottom navigation
│   │   ├── promo-box.tsx        # Project info dialog
│   │   └── terminal.tsx         # xterm.js terminal
│   └── ui/                      # shadcn/ui components
├── hooks/
│   ├── use-mobile.ts            # Mobile detection hook
│   └── use-webcontainer.ts      # WebContainer lifecycle
└── store/
    └── ide-store.ts             # Zustand state management
```

---

## العربية

### 🚀 نظرة عامة

Cloud-Native Studio هي بيئة تطوير متكاملة تعمل بالكامل داخل المتصفح، مدعومة بتقنية **WebContainers**. توفر بيئة تطوير كاملة تشمل تحرير الأكواد، الطرفية التفاعلية، المعاينة الحية، ومساعد ذكاء اصطناعي — بدون حاجة لخادم خلفي.

### ✨ المميزات

| الميزة | التقنية |
|--------|---------|
| **محرر الأكواد** | Monaco Editor (محرك VS Code) مع تلوين الأكواد والإكمال التلقائي |
| **الطرفية التفاعلية** | xterm.js بمظهر GitHub الداكن، تدعم الإدخال التفاعلي |
| **المعاينة الحية** | iframe مع أوضاع عرض سطح المكتب / الجهاز اللوحي / الهاتف |
| **المساعد الذكي** | واجهة دردشة عربية RTL مدعومة بـ z-ai-web-dev-sdk |
| **مستعرض الملفات** | عرض شجري مع أيقونات حسب نوع الملف |
| **شريط الأوامر** | أوامر npm سريعة (install, dev, build) |
| **متجاوب مع الهاتف** | شريط تنقل سفلي محسّن للأجهزة اللمسية |
| **تشغيل تلقائي** | WebContainer يشغل `npm install` تلقائياً |

### 🛠 التقنيات المستخدمة

- **الإطار**: Next.js 16 (App Router)
- **بيئة التشغيل**: @webcontainer/api
- **المحرر**: @monaco-editor/react
- **الطرفية**: @xterm/xterm + @xterm/addon-fit
- **الواجهة**: Tailwind CSS 4 + shadcn/ui
- **إدارة الحالة**: Zustand
- **الانتقالات**: Framer Motion
- **اللغة**: TypeScript

### 📦 التثبيت

```bash
# استنساخ المستودع
git clone https://github.com/yayass3r/cloud-native-studio.git
cd cloud-native-studio

# تثبيت التبعيات
npm install

# تشغيل خادم التطوير
npm run dev
```

---

<div align="center">

**Built with ❤️ using Next.js, WebContainers, and AI**

</div>
