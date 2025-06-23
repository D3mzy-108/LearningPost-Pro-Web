export function storeItem(key: string, value: any) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function getStoredItem(key: string) {
  if (typeof window !== "undefined") {
    const item = localStorage.getItem(key);
    return JSON.parse(item ?? "{}");
  } else {
    return {};
  }
}

export function clearStorage() {
  localStorage.clear();
}
