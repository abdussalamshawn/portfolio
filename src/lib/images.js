const copy = (url, width) => {
  const { origin, pathname } = new URL(url);
  return `${origin}/cdn-cgi/image/width=${width},quality=80,format=auto,onerror=redirect${pathname}`;
};

export const resized = (url, widths, sizes) => {
  if (typeof url !== 'string' || !url.startsWith('https://')) return { src: url };
  return {
    src: copy(url, widths[widths.length - 1]),
    srcset: widths.map((w) => `${copy(url, w)} ${w}w`).join(', '),
    sizes,
  };
};
