# Contributing to Knowledge Core

Danke für dein Interesse, zu Knowledge Core beizutragen! Wir freuen uns über Contributions aller Art.

## Code of Conduct

Wir erwarten von allen Contributors, dass sie respektvoll und konstruktiv miteinander umgehen.

## Wie kann ich beitragen?

### Bug Reports

Wenn du einen Bug findest:

1. Überprüfe, ob das Problem bereits gemeldet wurde
2. Erstelle ein neues Issue mit:
   - Beschreibung des Problems
   - Schritte zur Reproduktion
   - Erwartetes vs. tatsächliches Verhalten
   - System-Informationen (OS, Node-Version, etc.)

### Feature Requests

Für neue Features:

1. Erstelle ein Issue mit dem Label "enhancement"
2. Beschreibe:
   - Was möchtest du erreichen?
   - Warum ist das nützlich?
   - Wie könnte es implementiert werden?

### Pull Requests

#### Setup

```bash
# Fork das Repository
git clone https://github.com/yourusername/knowledge-core.git
cd knowledge-core

# Dependencies installieren
pnpm install

# Neuen Branch erstellen
git checkout -b feature/mein-feature
```

#### Development

```bash
# Development-Server starten
pnpm dev

# Code und Formatierung prüfen
pnpm check

# Typen, Tests und Produktions-Build prüfen
pnpm type-check
pnpm test
pnpm build
```

#### Commit Guidelines

Verwende aussagekräftige Commit-Messages:

```
feat: Add new Quiz component
fix: Resolve navigation bug in sidebar
docs: Update installation guide
style: Format code with Biome
refactor: Simplify theme toggle logic
test: Add tests for Quiz component
chore: Update dependencies
```

#### Pull Request Process

1. **Update Dokumentation** - falls dein PR das API ändert
2. **Tests hinzufügen** - für neue Features
3. **Code formatieren** - `pnpm format`
4. **Beschreibung** - erkläre was und warum
5. **Screenshots** - bei UI-Änderungen

### Dokumentation

Hilf uns, die Docs zu verbessern:

- Tippfehler korrigieren
- Beispiele hinzufügen
- Erklärungen verbessern
- Neue Guides schreiben

## Development Guidelines

### Code Style

- TypeScript für alle neuen Dateien
- Biome für Linting und Formatierung
- Aussagekräftige Variablennamen

### Komponenten

Neue UI-Komponenten gehören nach `packages/ui/src/components/`:

```typescript
---
export interface Props {
  title: string;
  // ...
}

const { title } = Astro.props;
---

<div class="my-component">
  {title}
</div>
```

### Styles

- Nutze Tailwind-Klassen
- CSS-Variablen aus `tokens.css`
- Dark Mode unterstützen
- Responsive Design

### Content

- MDX für alle Inhalte
- Zod-Schemas für Frontmatter
- Aussagekräftige Titel und Beschreibungen
- Tags für Durchsuchbarkeit

## Project Structure

```
knowledge-core/
├── apps/           # Anwendungen
│   ├── docs/       # Dokumentation
│   └── courses/    # Kurse
├── packages/       # Shared Packages
│   ├── ui/         # Komponenten
│   ├── styles/     # Theming
│   ├── content-model/  # Types
│   └── config/     # Configs
```

## Testing

Vitest deckt Content-Schemas, Sidebar-/Lesson-Utilities, i18n und die Request-Validierung des Chat-Workers ab:

```bash
pnpm test
```

Für neue Logik sollen passende Unit-Tests ergänzt werden. UI-Interaktionen benötigen zusätzlich einen manuellen Browser-Test oder einen fokussierten E2E-Test.

## Fragen?

- Erstelle ein Issue für Fragen
- Diskutiere in GitHub Discussions
- Schau in bestehende Issues

## Lizenz

Indem du beiträgst, stimmst du zu, dass deine Contributions unter der MIT-Lizenz lizenziert werden.

---

Danke für deine Contribution! 🎉
