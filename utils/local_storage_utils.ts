export function storeItem(key: string, value: any) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function getStoredItem(key: string) {
  const item = localStorage.getItem(key);
  return JSON.parse(item ?? "{}");
}

export function clearStorage() {
  localStorage.clear();
}
