# Knowledge Core

[![GitHub Template](https://img.shields.io/badge/GitHub-Template-blue?logo=github)](https://github.com/casoon/knowledge-core/generate)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![pnpm](https://img.shields.io/badge/maintained%20with-pnpm-cc00ff.svg)](https://pnpm.io/)

> Modernes Monorepo-Template für Dokumentations- und Kursplattformen

Ein produktionsreifes Template basierend auf **Astro**, **MDX**, **Tailwind CSS** und **pnpm Workspaces** - optimiert für die Erstellung von technischer Dokumentation und interaktiven Lernplattformen.

## ✨ Features

- 🚀 **Astro 5** - Schnelles, modernes Frontend-Framework
- 📝 **MDX** - Markdown mit React-Komponenten
- 🎨 **Tailwind CSS** - Utility-First CSS mit Dark Mode
- 📦 **pnpm Workspaces** - Monorepo-Struktur
- ⚡ **Volta** - Automatisches Node-Version-Management
- 🧩 **Shared Components** - Wiederverwendbare UI-Komponenten
- 🎓 **Interaktive Kurse** - Quiz, Übungen, Fortschritts-Tracking
- 🌙 **Dark Mode** - Mit Theme-Persistence
- 🔍 **Type-Safe** - TypeScript + Zod-Schemas

## 🎯 Use Cases

- **Technische Dokumentation** - API-Referenzen, Guides, Tutorials
- **Kursplattformen** - Interaktive Lernstrecken mit Quiz und Übungen
- **Knowledge Bases** - Interne Dokumentation für Teams
- **Developer Portals** - Entwickler-Ressourcen und Guides

## 🚀 Quick Start

### Voraussetzungen

- Node.js 24 oder höher
- pnpm 9 oder höher
- Volta (empfohlen)

### Installation

**Option 1: GitHub Template verwenden (empfohlen)**

1. Klicke auf "Use this template" oben auf der GitHub-Seite
2. Gib deinem Projekt einen Namen
3. Clone dein neues Repository:
   ```bash
   git clone https://github.com/yourusername/your-project.git
   cd your-project
   ```

**Option 2: Direktes Klonen**

```bash
git clone https://github.com/casoon/knowledge-core.git
cd knowledge-core
```

### Nach der Installation

```bash
# 1. Dependencies installieren
pnpm install

# 2. (Optional) Package-Namen personalisieren
# Ändere @knowledge-core/* in deinen eigenen Namen in:
# - package.json (alle Packages)
# - Import-Statements in den Apps

# 3. Projekt starten
pnpm dev
```

### Development

```bash
# Beide Apps starten
pnpm dev

# Nur Dokumentation
pnpm dev:docs
# → http://localhost:4321

# Nur Kursplattform
pnpm dev:courses
# → http://localhost:4322
```

### Build

```bash
# Alle Apps bauen
pnpm build

# Einzelne App
pnpm build:docs
pnpm build:courses
```

## 📁 Projektstruktur

```
knowledge-core/
├── apps/
│   ├── docs/              # Dokumentations-App
│   │   ├── src/
│   │   │   ├── content/   # MDX-Dateien
│   │   │   ├── layouts/   # Astro-Layouts
│   │   │   └── pages/     # Seiten & Routing
│   │   └── package.json
│   │
│   └── courses/           # Kursplattform-App
│       ├── src/
│       │   ├── content/
│       │   │   ├── courses/  # Kurs-Definitionen
│       │   │   └── lessons/  # Lektionen (MDX)
│       │   ├── layouts/
│       │   └── pages/
│       └── package.json
│
├── packages/
│   ├── ui/                # Shared UI-Komponenten
│   ├── styles/            # Tailwind + Theming
│   ├── content-model/     # Type Definitions
│   └── config/            # Shared Configs
│
├── package.json           # Root Package
└── pnpm-workspace.yaml
```

## 📝 Inhalte erstellen

### Dokumentationsseite

Erstelle eine MDX-Datei in `apps/docs/src/content/docs/`:

```mdx
---
title: Meine Seite
description: Beschreibung
category: guides
order: 1
tags: [tutorial]
status: stable
---

import { Callout } from '@knowledge-core/ui';

# Meine Seite

<Callout type="info">
Wichtige Information!
</Callout>
```

### Kurs erstellen

1. **Kurs-Definition** in `apps/courses/src/content/courses/my-course.json`:

```json
{
  "title": "Mein Kurs",
  "slug": "my-course",
  "description": "Kursbeschreibung",
  "level": "beginner",
  "estimatedTotalMinutes": 120,
  "tags": ["programming"],
  "published": true
}
```

2. **Lektion** in `apps/courses/src/content/lessons/`:

```mdx
---
courseSlug: my-course
title: Lektion 1
module: Basics
orderInModule: 1
estimatedMinutes: 15
goals:
  - Ziel 1
  - Ziel 2
---

import { Quiz, Exercise } from '@knowledge-core/ui';

# Lektion 1

<Exercise title="Übung" difficulty="easy">
Aufgabe hier...
</Exercise>

<Quiz questions={[...]} />
```

## 🧩 Verfügbare Komponenten

### Content-Komponenten

- **Callout** - Info, Warning, Error, Success
- **CodeBlock** - Syntax-Highlighting mit Copy-Button
- **Card** - Content-Cards
- **Tabs** / **TabPanel** - Tab-Navigation

### Kurs-Komponenten

- **Quiz** - Interaktive Quiz mit Feedback
- **Exercise** - Übungsblöcke
- **Hint** - Ausklappbare Hinweise
- **ProgressBar** - Fortschrittsanzeige
- **CourseCard** - Kurs-Übersichtskarten

## 🎨 Theming

### CSS-Variablen anpassen

Bearbeite `packages/styles/src/tokens.css`:

```css
:root {
  --color-primary: 245 90% 60%;
  --color-secondary: 210 20% 98%;
  /* ... */
}

.dark {
  --color-primary: 245 80% 70%;
  /* ... */
}
```

### Tailwind Config erweitern

Bearbeite `packages/styles/tailwind.config.js`:

```javascript
export default {
  theme: {
    extend: {
      colors: {
        // Deine Farben
      }
    }
  }
}
```

## 🔧 Scripts

```bash
# Development
pnpm dev                 # Alle Apps
pnpm dev:docs           # Nur Docs
pnpm dev:courses        # Nur Kurse

# Build
pnpm build              # Alle Apps
pnpm build:docs         # Nur Docs
pnpm build:courses      # Nur Kurse

# Preview
pnpm preview            # Alle Apps
pnpm preview:docs       # Nur Docs
pnpm preview:courses    # Nur Kurse

# Code Quality
pnpm lint               # ESLint
pnpm format             # Prettier
pnpm check              # TypeScript + Astro Check

# Clean
pnpm clean              # Alle Build-Artefakte löschen
```

## 🚢 Deployment

### Vercel (empfohlen)

1. Push zu GitHub
2. Importiere auf [Vercel](https://vercel.com)
3. Wähle Root-Verzeichnis
4. Build Command: `pnpm build:docs` oder `pnpm build:courses`
5. Output Directory: `apps/docs/dist` oder `apps/courses/dist`

### Netlify

```toml
# netlify.toml
[build]
  command = "pnpm build:docs"
  publish = "apps/docs/dist"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

### Cloudflare Pages

1. Build Command: `pnpm build:docs`
2. Build output directory: `apps/docs/dist`

## 📖 Weiterführende Dokumentation

- **[SETUP.md](SETUP.md)** - Detaillierte Setup-Anleitung und Personalisierung
- **[CONTRIBUTING.md](CONTRIBUTING.md)** - Contribution Guidelines

## 🤝 Contributing

Contributions sind willkommen! Siehe [CONTRIBUTING.md](CONTRIBUTING.md) für Details.

## 📄 Lizenz

MIT License - siehe [LICENSE](LICENSE)

## 🙏 Credits

Erstellt mit:
- [Astro](https://astro.build)
- [Tailwind CSS](https://tailwindcss.com)
- [MDX](https://mdxjs.com)
- [pnpm](https://pnpm.io)

---

**Made with ❤️ for developers and educators**
