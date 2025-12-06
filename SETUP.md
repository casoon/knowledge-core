# Setup Guide

Willkommen bei deinem neuen Knowledge Core Projekt! Folge diesen Schritten für eine optimale Einrichtung.

## 🎯 Initiale Schritte

### 1. Dependencies installieren

```bash
pnpm install
```

Dies installiert alle benötigten Pakete für beide Apps und alle Shared Packages.

### 2. Projekt personalisieren

#### Package-Namen ändern

Ersetze `@knowledge-core` mit deinem eigenen Scope (z.B. `@mein-projekt`):

**Betroffene Dateien:**

```bash
# In allen package.json Dateien:
packages/ui/package.json
packages/styles/package.json
packages/content-model/package.json
packages/config/package.json

# Name-Feld ändern:
{
  "name": "@mein-projekt/ui",  // statt @knowledge-core/ui
  ...
}
```

**Import-Statements aktualisieren:**

In den Apps (`apps/docs/` und `apps/courses/`) alle Imports anpassen:

```typescript
// Vorher:
import { Callout } from '@knowledge-core/ui';
import '@knowledge-core/styles/global.css';

// Nachher:
import { Callout } from '@mein-projekt/ui';
import '@mein-projekt/styles/global.css';
```

**Schneller Weg - Mit find & replace:**

```bash
# macOS/Linux:
find . -type f \( -name "*.json" -o -name "*.ts" -o -name "*.astro" -o -name "*.mdx" \) \
  -not -path "*/node_modules/*" \
  -exec sed -i '' 's/@knowledge-core/@mein-projekt/g' {} +

# Windows (PowerShell):
Get-ChildItem -Recurse -Include *.json,*.ts,*.astro,*.mdx |
  Where-Object { $_.FullName -notmatch 'node_modules' } |
  ForEach-Object { (Get-Content $_.FullName) -replace '@knowledge-core','@mein-projekt' | Set-Content $_.FullName }
```

#### Branding anpassen

**Logo & Titel:**

Bearbeite `packages/ui/src/components/navigation/NavBar.astro`:

```typescript
// Ändere den Logo-Text
logo = 'Mein Projekt'; // statt "Knowledge Core"
```

**Footer:**

Bearbeite `packages/ui/src/components/layout/Footer.astro`:

```typescript
projectName = 'Mein Projekt'; // statt 'Knowledge Core'
```

**Startseiten:**

- `apps/docs/src/pages/index.astro`
- `apps/courses/src/pages/index.astro`

### 3. Theming anpassen

#### Farben ändern

Bearbeite `packages/styles/src/tokens.css`:

```css
:root {
  /* Deine Primärfarbe */
  --color-primary: 245 90% 60%; /* HSL-Format */

  /* Weitere Anpassungen... */
}
```

**Hilfreiche Tools:**

- [HSL Color Picker](https://hslpicker.com/)
- [Tailwind Color Generator](https://uicolors.app/create)

### 4. Beispiel-Content entfernen/anpassen

**Dokumentation:**

```bash
apps/docs/src/content/docs/
├── getting-started/
│   ├── installation.mdx      # Anpassen
│   └── structure.mdx          # Anpassen
└── guides/
    └── creating-content.mdx   # Behalten oder anpassen
```

**Kurse:**

```bash
apps/courses/src/content/
├── courses/
│   └── rust-basics.json       # Löschen oder ersetzen
└── lessons/
    └── rust-basics-*.mdx      # Löschen oder ersetzen
```

### 5. Repository-Informationen aktualisieren

**package.json (Root):**

```json
{
  "name": "mein-projekt",
  "description": "Deine Beschreibung",
  "repository": {
    "type": "git",
    "url": "https://github.com/dein-username/dein-projekt.git"
  },
  "author": "Dein Name"
}
```

**README.md:**

- Ersetze alle Verweise auf "Knowledge Core"
- Aktualisiere Repository-URLs
- Passe Beschreibungen an

## 🚀 Development

```bash
# Beide Apps starten
pnpm dev

# Nur Dokumentation (Port 4321)
pnpm dev:docs

# Nur Kurse (Port 4322)
pnpm dev:courses
```

## 🏗️ Build & Deploy

### Lokal bauen

```bash
# Alle Apps
pnpm build

# Einzelne App
pnpm build:docs
pnpm build:courses
```

### Deployment

#### Vercel

1. Pushe zu GitHub
2. Importiere auf [Vercel](https://vercel.com)
3. Wähle das Projekt
4. Vercel erkennt Astro automatisch
5. Für separate Deployments:
   - **Docs**: Root Directory = `apps/docs`, Build Command = `cd ../.. && pnpm build:docs`
   - **Courses**: Root Directory = `apps/courses`, Build Command = `cd ../.. && pnpm build:courses`

#### Netlify

Erstelle `netlify.toml`:

```toml
# Für Docs
[build]
  command = "pnpm install && pnpm build:docs"
  publish = "apps/docs/dist"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

#### Cloudflare Pages

- Build Command: `pnpm install && pnpm build:docs`
- Build output directory: `apps/docs/dist`

## 📝 Content erstellen

### Dokumentationsseite

```bash
# Neue Datei erstellen
apps/docs/src/content/docs/guides/mein-guide.mdx
```

```mdx
---
title: Mein Guide
description: Beschreibung
category: guides
order: 1
tags: [tutorial]
status: stable
---

import { Callout } from '@mein-projekt/ui';

# Mein Guide

<Callout type="info">Wichtige Information!</Callout>
```

### Kurs erstellen

**1. Kurs-Definition:**

```bash
apps/courses/src/content/courses/mein-kurs.json
```

```json
{
  "title": "Mein Kurs",
  "slug": "mein-kurs",
  "description": "Kursbeschreibung",
  "level": "beginner",
  "estimatedTotalMinutes": 120,
  "tags": ["programming"],
  "published": true
}
```

**2. Lektion erstellen:**

```bash
apps/courses/src/content/lessons/mein-kurs-lektion-1.mdx
```

```mdx
---
courseSlug: mein-kurs
title: Lektion 1
module: Grundlagen
orderInModule: 1
estimatedMinutes: 15
goals:
  - Ziel 1
  - Ziel 2
---

import { Quiz, Exercise } from '@mein-projekt/ui';

# Lektion 1

<Exercise title="Übung" difficulty="easy">
  Aufgabe hier...
</Exercise>
```

## 🎨 Erweiterte Anpassungen

### Neue Komponenten hinzufügen

```bash
packages/ui/src/components/
├── layout/
├── navigation/
├── content/
└── custom/              # Deine eigenen Komponenten
    └── MyComponent.astro
```

### Tailwind erweitern

```javascript
// packages/styles/tailwind.config.js
export default {
  theme: {
    extend: {
      // Deine Anpassungen
    },
  },
};
```

## ✅ Checkliste

- [ ] `pnpm install` ausgeführt
- [ ] Package-Namen geändert (@knowledge-core → @mein-projekt)
- [ ] Branding angepasst (Logo, Titel, Footer)
- [ ] Farben/Theming personalisiert
- [ ] Beispiel-Content entfernt/angepasst
- [ ] Repository-Informationen aktualisiert
- [ ] README.md angepasst
- [ ] Erstes `pnpm dev` getestet
- [ ] Git initialisiert und erster Commit

## 🆘 Probleme?

### Dependencies-Fehler

```bash
# Alles löschen und neu installieren
pnpm clean
rm -rf node_modules
pnpm install
```

### Build-Fehler

```bash
# TypeScript-Check
pnpm check

# Linting
pnpm lint
```

### Port bereits belegt

```bash
# Ändere den Port in package.json:
"dev": "astro dev --port 4323"
```

## 📚 Weitere Ressourcen

- [Astro Dokumentation](https://docs.astro.build)
- [Tailwind CSS Docs](https://tailwindcss.com)
- [MDX Dokumentation](https://mdxjs.com)
- [pnpm Workspaces](https://pnpm.io/workspaces)

---

Viel Erfolg mit deinem Projekt! 🚀
