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

const wide = { small: 0.65, regular: 0.85, large: 1 };
const phone = { small: 0.75, regular: 0.9, large: 1 };

// cols is 3 for the wide layout and 2 for the phone layout
export const wallImage = (url, size, cols) => {
  const share = cols === 3 ? wide : phone;
  const f = share[size] ?? share.regular;
  const sizes = cols === 3 ? `${Math.round(300 * f)}px` : `${Math.round(45 * f)}vw`;
  return resized(url, [360, 640, 960], sizes);
};
