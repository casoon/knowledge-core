import type { SidebarBadge } from './docs.js';

export type { SidebarBadge };

/** A manual external/internal link entry */
export interface SidebarLinkItem {
  label: string;
  link: string;
  badge?: SidebarBadge;
}

/** A reference to a content collection entry by its id */
export interface SidebarDocItem {
  slug: string;
  badge?: SidebarBadge;
}

/** A group with explicitly listed children */
export interface SidebarGroup {
  label: string;
  collapsed?: boolean;
  items: SidebarEntry[];
}

/** A group whose items are auto-generated from a directory prefix */
export interface SidebarAutoGroup {
  label: string;
  collapsed?: boolean;
  autogenerate: { directory: string };
}

export type SidebarEntry = SidebarLinkItem | SidebarDocItem | SidebarGroup | SidebarAutoGroup;

export type SidebarConfig = SidebarEntry[];

/** Type-safe helper — identical to the value passed in, used for IDE inference */
export function defineSidebar(config: SidebarConfig): SidebarConfig {
  return config;
}

// Type guards
export function isSidebarLinkItem(e: SidebarEntry): e is SidebarLinkItem {
  return 'link' in e && 'label' in e;
}

export function isSidebarDocItem(e: SidebarEntry): e is SidebarDocItem {
  return 'slug' in e;
}

export function isSidebarGroup(e: SidebarEntry): e is SidebarGroup {
  return 'items' in e && 'label' in e;
}

export function isSidebarAutoGroup(e: SidebarEntry): e is SidebarAutoGroup {
  return 'autogenerate' in e && 'label' in e;
}
