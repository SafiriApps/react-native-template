import { waitFor } from '@testing-library/react-native';
import i18n from 'i18next';

// We will mock expo-localization getLocales and spy on getLanguage from utils.
jest.mock('expo-localization', () => ({
  getLocales: jest.fn(() => [{ languageTag: 'en-US' }]),
}));

describe('i18n initialization', () => {
  beforeEach(() => {
    jest.resetModules();
    i18n?.off?.('initialized', () => {});
  });

  it('initializes with app language when provided by getLanguage()', async () => {
    // Spy on the real utils module before loading i18n entry to affect its import
    const utils = require('../../lib/i18n/utils');
    jest.spyOn(utils, 'getLanguage').mockReturnValue('ar');

    // (Re)load the module under test with mocked dependencies
    jest.isolateModules(() => {
      require('../../lib/i18n'); // executes init
    });

    await waitFor(() => {
      expect(i18n.language).toBe('ar');
    });
  });

  it('falls back to device locale when no app language is set', async () => {
    const utils = require('../../lib/i18n/utils');
    jest.spyOn(utils, 'getLanguage').mockReturnValue(undefined);

    const { getLocales } = require('expo-localization') as {
      getLocales: jest.Mock;
    };
    getLocales.mockReturnValue([{ languageTag: 'fr-FR' }]);

    jest.isolateModules(() => {
      require('../../lib/i18n');
    });

    await waitFor(() => {
      // languageTag is used directly; resources may not include it, but i18n will still set the language
      expect(i18n.language).toBe('fr-FR');
    });
  });

  it('uses JSON compatibility v4 for RN environments', async () => {
    const utils = require('../../lib/i18n/utils');
    jest.spyOn(utils, 'getLanguage').mockReturnValue(undefined);

    jest.isolateModules(() => {
      require('../../lib/i18n');
    });

    // config option asserted
    expect(i18n.options?.compatibilityJSON).toBe('v4');
  });
});