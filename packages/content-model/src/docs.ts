import { z } from 'zod';

export const docsCategorySchema = z.enum([
  'getting-started',
  'guides',
  'api',
  'cookbook',
  'components',
]);

export const docsStatusSchema = z.enum(['stable', 'beta', 'deprecated']);

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
});

export type DocsCategory = z.infer<typeof docsCategorySchema>;
export type DocsStatus = z.infer<typeof docsStatusSchema>;
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
}
