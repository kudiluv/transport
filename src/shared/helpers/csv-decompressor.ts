export const csvDecompressor = (input: string, delemitter = ';') => {
  const lines = input.split('\n');
  const headers = lines[0].split(delemitter);
  const rows = lines.slice(1);

  const cache = [];
  cache.length = headers.length;
  const decompressedRows = rows.map((row) => {
    const items = row.split(delemitter);
    const prevLength = items.length;
    items.length = headers.length;
    const filled = items.fill('', prevLength, headers.length);

    const decompressedItems = filled.map((item, index) => {
      if (item) {
        return item;
      }
      const cachedValue = cache[index];

      if (cachedValue) {
        return cachedValue;
      }
      return '';
    });

    decompressedItems.forEach((value, index) => {
      cache[index] = value;
    });

    return decompressedItems;
  });

  return decompressedRows;
};