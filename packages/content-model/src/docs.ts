import { z } from 'zod';

export const docsCategorySchema = z.enum([
  'getting-started',
  'guides',
  'api',
  'cookbook',
]);

export const docsStatusSchema = z.enum(['stable', 'beta', 'deprecated']);

export const docsFrontmatterSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  category: docsCategorySchema,
  order: z.number().default(0),
  sidebarGroup: z.string().optional(),
  tags: z.array(z.string()).default([]),
  status: docsStatusSchema.default('stable'),
  lastUpdated: z.date().optional(),
  author: z.string().optional(),
});

export type DocsCategory = z.infer<typeof docsCategorySchema>;
export type DocsStatus = z.infer<typeof docsStatusSchema>;
export type DocsFrontmatter = z.infer<typeof docsFrontmatterSchema>;

export interface DocEntry {
  slug: string;
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
