import { createMMKV } from 'react-native-mmkv';

export const storage = createMMKV();

/**
 * Retrieve and parse a JSON value stored under the given key in MMKV storage.
 *
 * @param key - The storage key to read
 * @returns The parsed value as `T`, or `null` if the key is not present or the stored value cannot be parsed
 */
export function getItem<T>(key: string): T | null {
  const value = storage.getString(key);
  if (value === undefined) {
    return null;
  }

  try {
    return (JSON.parse(value) as T) ?? null;
  } catch (error) {
    console.warn(`Failed to parse storage value for key "${key}"`, error);
    return null;
  }
}

/**
 * Store a value under the given key in MMKV storage after serializing it to JSON.
 *
 * @param key - The storage key to set; if a value already exists it will be overwritten
 * @param value - The value to serialize and store as JSON
 */
export async function setItem<T>(key: string, value: T) {
  storage.set(key, JSON.stringify(value));
}

/**
 * Removes the value associated with the provided storage key.
 *
 * @param key - The storage key whose value should be removed
 */
export async function removeItem(key: string) {
  storage.remove(key);
}