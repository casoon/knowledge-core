/**
 * Shiki transformer: turns every inline style Shiki and Astro put on code blocks
 * (`color:#e1e4e8`, `overflow-x:auto` …) into a class (`shiki-color-e1e4e8`,
 * `shiki-overflow-x-auto` …), because the CSP blocks style attributes. The classes
 * are defined in shiki.css for the github-dark theme.
 */
export const shikiStyleToClass = {
  name: 'style-to-class',
  root(root) {
    const visit = (node) => {
      if (node.type !== 'element') return;
      const style = node.properties?.style;
      if (typeof style === 'string') {
        const classes = style
          .split(';')
          .map((declaration) => declaration.trim())
          .filter(Boolean)
          .map((declaration) => {
            const [property, ...value] = declaration.split(':');
            const name = `${property}-${value.join(':')}`.trim().toLowerCase();
            return `shiki-${name.replace(/[^a-z0-9]+/g, '-').replace(/-$/, '')}`;
          });
        const existing = node.properties.class;
        node.properties.class = [existing, ...classes].filter(Boolean).join(' ');
        node.properties.style = undefined;
      }
      for (const child of node.children ?? []) visit(child);
    };
    for (const child of root.children) visit(child);
  },
};
