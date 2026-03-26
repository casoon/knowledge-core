import { z } from 'zod';

export const docsCategorySchema = z.enum([
  'getting-started',
  'guides',
  'api',
  'cookbook',
  'components',
]);

export const docsStatusSchema = z.enum(['stable', 'beta', 'deprecated']);

export const sidebarBadgeVariantSchema = z.enum(['note', 'tip', 'danger', 'caution', 'success']);

export const sidebarBadgeSchema = z.object({
  variant: sidebarBadgeVariantSchema,
  text: z.string(),
});

export const docsPrevNextSchema = z.union([
  z.boolean(),
  z.object({ link: z.string(), label: z.string() }),
]);

export const docsFrontmatterSchema = z.object({
  title: z.string(),
  description: z.optional(z.string()),
  category: docsCategorySchema,
  order: z.number().default(0),
  sidebarGroup: z.optional(z.string()),
  tags: z.array(z.string()).default([]),
  status: docsStatusSchema.default('stable'),
  lastUpdated: z.optional(z.coerce.date()),
  author: z.optional(z.string()),
  // Starlight-inspired fields
  draft: z.boolean().default(false),
  editUrl: z.optional(z.string()),
  pagefind: z.boolean().default(true),
  sidebar: z.optional(
    z.object({
      badge: z.optional(sidebarBadgeSchema),
    })
  ),
  prev: z.optional(docsPrevNextSchema),
  next: z.optional(docsPrevNextSchema),
});

export type DocsCategory = z.infer<typeof docsCategorySchema>;
export type DocsStatus = z.infer<typeof docsStatusSchema>;
export type SidebarBadgeVariant = z.infer<typeof sidebarBadgeVariantSchema>;
export type SidebarBadge = z.infer<typeof sidebarBadgeSchema>;
export type DocsFrontmatter = z.infer<typeof docsFrontmatterSchema>;

export interface DocEntry {
  id: string;
  data: DocsFrontmatter;
  body: string;
}

export interface DocsSidebarGroup {
  title: string;
  items: DocsSidebarItem[];
  collapsed?: boolean;
}

export interface DocsSidebarItem {
  title: string;
  href: string;
  active?: boolean;
  status?: DocsStatus;
  badge?: SidebarBadge;
}
