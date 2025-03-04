import en from './en';
import ja from './ja';
import zh from './zh';
import ko from './ko';
import ru from './ru';
import de from './de';
import fr from './fr';
import es from './es';
import pt from './pt';
import nl from './nl';
import it from './it';
import hi from './hi';

export const messages = {
  en,
  ja,
  zh,
  ko,
  ru,
  de,
  fr,
  es,
  pt,
  nl,
  it,
  hi
};

export type LocaleType = keyof typeof messages;