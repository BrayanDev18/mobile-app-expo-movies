import * as Localization from 'expo-localization';

export const deviceRegion = () => Localization.getLocales()[0]?.regionCode ?? 'US';
