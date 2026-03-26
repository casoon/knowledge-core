import type { SidebarBadge } from './docs.js';
import {
  isSidebarAutoGroup,
  isSidebarDocItem,
  isSidebarGroup,
  isSidebarLinkItem,
  type SidebarAutoGroup,
  type SidebarConfig,
  type SidebarDocItem,
  type SidebarEntry,
  type SidebarGroup,
  type SidebarLinkItem,
} from './sidebar.js';

export interface ResolvedSidebarItem {
  type: 'link';
  label: string;
  href: string;
  active: boolean;
  badge?: SidebarBadge;
}

export interface ResolvedSidebarGroup {
  type: 'group';
  label: string;
  collapsed: boolean;
  items: (ResolvedSidebarItem | ResolvedSidebarGroup)[];
}

export type ResolvedSidebarEntry = ResolvedSidebarItem | ResolvedSidebarGroup;

interface DocLike {
  id: string;
  data: {
    title: string;
    order?: number;
    status?: string;
    sidebar?: { badge?: SidebarBadge };
  };
}

function resolveEntry(
  entry: SidebarEntry,
  docs: DocLike[],
  currentPath: string,
  baseHref: string
): ResolvedSidebarEntry | null {
  if (isSidebarLinkItem(entry)) {
    return resolveLinkItem(entry, currentPath);
  }
  if (isSidebarDocItem(entry)) {
    return resolveDocItem(entry, docs, currentPath, baseHref);
  }
  if (isSidebarGroup(entry)) {
    return resolveGroup(entry, docs, currentPath, baseHref);
  }
  if (isSidebarAutoGroup(entry)) {
    return resolveAutoGroup(entry, docs, currentPath, baseHref);
  }
  return null;
}

function resolveLinkItem(entry: SidebarLinkItem, currentPath: string): ResolvedSidebarItem {
  return {
    type: 'link',
    label: entry.label,
    href: entry.link,
    active: currentPath === entry.link,
    badge: entry.badge,
  };
}

function resolveDocItem(
  entry: SidebarDocItem,
  docs: DocLike[],
  currentPath: string,
  baseHref: string
): ResolvedSidebarItem | null {
  const doc = docs.find(
    (d) => d.id === entry.slug || d.id.replace(/\.(md|mdx)$/, '') === entry.slug
  );
  if (!doc) return null;
  const href = `${baseHref}/${doc.id}`;
  return {
    type: 'link',
    label: doc.data.title,
    href,
    active: currentPath === href || currentPath.startsWith(`${href}/`),
    badge: entry.badge ?? doc.data.sidebar?.badge,
  };
}

function resolveGroup(
  entry: SidebarGroup,
  docs: DocLike[],
  currentPath: string,
  baseHref: string
): ResolvedSidebarGroup {
  return {
    type: 'group',
    label: entry.label,
    collapsed: entry.collapsed ?? false,
    items: entry.items
      .map((child) => resolveEntry(child, docs, currentPath, baseHref))
      .filter((item): item is ResolvedSidebarEntry => item !== null),
  };
}

function resolveAutoGroup(
  entry: SidebarAutoGroup,
  docs: DocLike[],
  currentPath: string,
  baseHref: string
): ResolvedSidebarGroup {
  const dir = entry.autogenerate.directory;
  const matched = docs
    .filter((d) => d.id === dir || d.id.startsWith(`${dir}/`))
    .sort((a, b) => (a.data.order ?? 0) - (b.data.order ?? 0));

  return {
    type: 'group',
    label: entry.label,
    collapsed: entry.collapsed ?? false,
    items: matched.map((doc) => {
      const href = `${baseHref}/${doc.id}`;
      return {
        type: 'link' as const,
        label: doc.data.title,
        href,
        active: currentPath === href || currentPath.startsWith(`${href}/`),
        badge: doc.data.sidebar?.badge,
      };
    }),
  };
}

/**
 * Resolve a SidebarConfig against a list of doc entries into a renderable tree.
 *
 * @param config  - The sidebar configuration (from defineSidebar())
 * @param docs    - All doc entries (filtered, e.g. no drafts)
 * @param currentPath - The current page URL pathname
 * @param baseHref    - Base href prefix for doc links (default: '/docs')
 */
export function resolveSidebar(
  config: SidebarConfig,
  docs: DocLike[],
  currentPath: string,
  baseHref = '/docs'
): ResolvedSidebarEntry[] {
  return config
    .map((entry) => resolveEntry(entry, docs, currentPath, baseHref))
    .filter((item): item is ResolvedSidebarEntry => item !== null);
}
