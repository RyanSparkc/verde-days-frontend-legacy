export function toProductList(products) {
  return Array.isArray(products) ? products : Object.values(products);
}
