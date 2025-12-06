# Rust Basics Course

Dieser Kurs wurde aus dem Template ausgelagert und kann später als eigenständiger Rust-Kurs verwendet werden.

## Inhalt

- **Course Definition**: `courses/rust-basics.json`
- **Lektionen**:
  - `lessons/rust-basics-intro.mdx` - Einführung in Rust
  - `lessons/rust-basics-installation.mdx` - Rust installieren
  - `lessons/rust-basics-first-project.mdx` - Erstes Cargo-Projekt

## Features

Der Kurs demonstriert:
- ✅ Quiz-Komponente
- ✅ Exercise-Komponente
- ✅ Hint-Komponente
- ✅ Tabs (Multi-Platform Installation)
- ✅ Callouts
- ✅ Code-Beispiele

## Verwendung

Um diesen Kurs in ein Knowledge Core Projekt zu integrieren:

```bash
# 1. Kurs-Definition kopieren
cp courses/rust-basics.json your-project/apps/courses/src/content/courses/

# 2. Lektionen kopieren
cp lessons/*.mdx your-project/apps/courses/src/content/lessons/

# 3. Imports anpassen (falls Package-Namen geändert wurden)
# Von @knowledge-core/ui zu deinem Package-Namen
```

## Weiterentwicklung

Dieser Kurs kann erweitert werden mit:
- Weiteren Modulen (Ownership, Error Handling, etc.)
- Video-Content
- Praktischen Projekten
- Community-Beiträgen

## Lizenz

MIT - Siehe LICENSE im Root-Verzeichnis
