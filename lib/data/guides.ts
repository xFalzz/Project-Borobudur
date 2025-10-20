import { Guide } from '../types';

const languageSets: string[][] = [
  ['ID', 'EN'],
  ['ID', 'EN', 'ES'],
  ['ID'],
  ['ID', 'EN', 'JP'],
  ['ID', 'DE'],
  ['ID', 'EN', 'FR'],
];

export const guides: Guide[] = Array.from({ length: 70 }, (_, idx) => {
  const id = idx + 1;
  const languages = languageSets[id % languageSets.length];
  return {
    id,
    name: `Guide ${String(id).padStart(2, '0')}`,
    languages,
    checkInTime: null,
    tag: null,
  };
});


