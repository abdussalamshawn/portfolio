// Reads a photo's width and height from its first few bytes, so each page can reserve
// the right space before the photo loads. Works for WebP and PNG; anything else gives null.
const cache = new Map();

const text = (b, i) => String.fromCharCode(b[i], b[i + 1], b[i + 2], b[i + 3]);

const webp = (b) => {
  if (b.length < 30 || text(b, 0) !== 'RIFF' || text(b, 8) !== 'WEBP') return null;
  const kind = text(b, 12);
  if (kind === 'VP8 ') {
    return { width: (b[26] | (b[27] << 8)) & 0x3fff, height: (b[28] | (b[29] << 8)) & 0x3fff };
  }
  if (kind === 'VP8L') {
    const bits = b[21] | (b[22] << 8) | (b[23] << 16) | (b[24] << 24);
    return { width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 };
  }
  if (kind === 'VP8X') {
    return {
      width: 1 + (b[24] | (b[25] << 8) | (b[26] << 16)),
      height: 1 + (b[27] | (b[28] << 8) | (b[29] << 16)),
    };
  }
  return null;
};

const png = (b) => {
  if (b.length < 24 || b[0] !== 0x89 || text(b, 1).slice(0, 3) !== 'PNG') return null;
  const read = (i) => ((b[i] << 24) | (b[i + 1] << 16) | (b[i + 2] << 8) | b[i + 3]) >>> 0;
  return { width: read(16), height: read(20) };
};

export const sizeOf = (url) => {
  if (typeof url !== 'string' || !url.startsWith('https://')) return Promise.resolve(null);
  if (!cache.has(url)) {
    cache.set(
      url,
      fetch(url, { headers: { Range: 'bytes=0-63' } })
        .then((res) => (res.ok ? res.arrayBuffer() : null))
        .then((buffer) => {
          if (!buffer) return null;
          const bytes = new Uint8Array(buffer);
          const found = webp(bytes) || png(bytes);
          return found && found.width > 0 && found.height > 0 ? found : null;
        })
        .catch(() => null),
    );
  }
  return cache.get(url);
};
