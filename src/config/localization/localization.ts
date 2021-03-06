import LocalizedStrings, { LocalizedStringsMethods } from 'react-localization';
import { Setup } from '../setup';
import { en } from './en';
import { fa } from './fa';
import { II18 } from './i18.model';

interface ILocalization extends LocalizedStringsMethods, II18 {}

export const Localization: ILocalization = new LocalizedStrings({
    en: en,
    fa: fa,
});

Localization.setLanguage(Setup.internationalization.flag);
