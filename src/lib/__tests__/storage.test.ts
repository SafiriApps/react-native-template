import { getItem, removeItem, setItem, storage } from '@/lib/storage';

// The jest.config maps react-native-mmkv to a local mock providing createMMKV().
// The storage instance is created at module import time using the mock.
// We rely on those jest.fn() spies to verify behavior.

describe('storage utils', () => {
  const key = 'test-key';
  const value = { a: 1, b: 'two' };

  beforeEach(() => {
    // reset spies created by __mocks__/react-native-mmkv
    (storage.set as jest.Mock).mockClear?.();
    (storage.getString as jest.Mock).mockClear?.();
    // in our impl removeItem uses storage.remove
    (storage.remove as jest.Mock).mockClear?.();
  });

  it('setItem stringifies and stores value', async () => {
    await setItem(key, value);
    expect(storage.set).toHaveBeenCalledWith(key, JSON.stringify(value));
  });

  it('getItem returns parsed value when present', () => {
    (storage.getString as jest.Mock).mockReturnValueOnce(JSON.stringify(value));
    const got = getItem<typeof value>(key);
    expect(storage.getString).toHaveBeenCalledWith(key);
    expect(got).toEqual(value);
  });

  it('getItem returns null when key is missing (undefined)', () => {
    (storage.getString as jest.Mock).mockReturnValueOnce(undefined);
    expect(getItem(key)).toBeNull();
  });

  it('getItem returns null and warns on invalid JSON', () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    (storage.getString as jest.Mock).mockReturnValueOnce('not-json');
    expect(getItem(key)).toBeNull();
    expect(warnSpy).toHaveBeenCalled();
    warnSpy.mockRestore();
  });

  it('removeItem removes key', async () => {
    await removeItem(key);
    expect(storage.remove).toHaveBeenCalledWith(key);
  });
});