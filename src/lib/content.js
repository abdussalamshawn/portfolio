const slugOf = (path) => path.split('/').pop().slice(0, -3);

const load = (files) =>
  Object.entries(files)
    .map(([path, file]) => ({
      ...file.frontmatter,
      slug: slugOf(path),
      Content: file.Content,
    }))
    .sort((a, b) => new Date(b.date) - new Date(a.date));

export const writing = () => load(import.meta.glob('../data/writing/*.md', { eager: true }));
export const photography = () => load(import.meta.glob('../data/photography/*.md', { eager: true }));
export const design = () => load(import.meta.glob('../data/design/*.md', { eager: true }));

export const featuredFirst = (items, count) =>
  [...items.filter((i) => i.featured), ...items.filter((i) => !i.featured)].slice(0, count);

export const fmtDate = (date, options = { year: 'numeric', month: 'long', day: 'numeric' }) =>
  date ? new Date(date).toLocaleDateString('en-US', { ...options, timeZone: 'UTC' }) : '';
