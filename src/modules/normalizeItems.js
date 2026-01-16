export function normalizeItems(items = []) {
  const map = new Map();

  for (const item of items) {
    const key = JSON.stringify({
      name: item.name,
      unit_price: item.unit_price,
      original_unit_price: item.original_unit_price,
      discounts:
        item.discounts?.map((d) => ({
          name: d.name,
          amount: d.amount
        })) || []
    });

    if (!map.has(key)) {
      map.set(key, {
        ...item,
        quantity: item.quantity || 1,
        total_price: Number(((item.unit_price || 0) * (item.quantity || 1)).toFixed(2))
      });
    } else {
      const existing = map.get(key);
      existing.quantity += item.quantity || 1;
      existing.total_price = Number(
        ((existing.unit_price || 0) * existing.quantity).toFixed(2)
      );
    }
  }

  return Array.from(map.values());
}
