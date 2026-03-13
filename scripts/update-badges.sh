#!/usr/bin/env bash
# Updates version badges in README.md based on pnpm-workspace.yaml catalog
set -euo pipefail

README="README.md"

if [ ! -f "$README" ]; then
  echo "README.md not found"
  exit 0
fi

# Extract versions from catalog (strip ^ prefix)
get_version() {
  grep "^  $1:" pnpm-workspace.yaml | head -1 | sed 's/.*\^//' | tr -d ' '
}

# Portable in-place sed (works on macOS and Linux)
sedi() {
  if sed --version >/dev/null 2>&1; then
    sed -i "$@"
  else
    sed -i '' "$@"
  fi
}

ASTRO_VERSION=$(get_version "astro")
TAILWIND_VERSION=$(get_version "tailwindcss")
BIOME_VERSION=$(get_version "'@biomejs/biome'")
ZOD_VERSION=$(get_version "zod")
TS_VERSION=$(get_version "typescript")

# Update Tech Stack table versions
if [ -n "$ASTRO_VERSION" ]; then
  sedi "s/| \[Astro\].*| [0-9][^ ]* |/| [Astro](https:\/\/astro.build) | ${ASTRO_VERSION%.*} |/" "$README"
fi

if [ -n "$TAILWIND_VERSION" ]; then
  sedi "s/| \[Tailwind CSS\].*| [0-9][^ ]* |/| [Tailwind CSS](https:\/\/tailwindcss.com) | ${TAILWIND_VERSION%.*} |/" "$README"
fi

if [ -n "$BIOME_VERSION" ]; then
  sedi "s/| \[Biome\].*| [0-9][^ ]* |/| [Biome](https:\/\/biomejs.dev) | ${BIOME_VERSION%.*} |/" "$README"
fi

if [ -n "$ZOD_VERSION" ]; then
  sedi "s/| \[Zod\].*| [0-9][^ ]* |/| [Zod](https:\/\/zod.dev) | ${ZOD_VERSION%%.*}.x |/" "$README"
fi

if [ -n "$TS_VERSION" ]; then
  sedi "s/| \[TypeScript\].*| [0-9][^ ]* |/| [TypeScript](https:\/\/www.typescriptlang.org) | ${TS_VERSION%.*} |/" "$README"
fi

echo "Badge versions updated: Astro=$ASTRO_VERSION Tailwind=$TAILWIND_VERSION Biome=$BIOME_VERSION Zod=$ZOD_VERSION TS=$TS_VERSION"
