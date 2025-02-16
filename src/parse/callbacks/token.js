import { identifiers, utilities } from 'apg-lite';

import tokenLowerCaseNormalizer from '../token-normalizers/lower-case.js';

export const makeToken = (normalizer) => (state, chars, phraseIndex, phraseLength, data) => {
  if (state === identifiers.SEM_PRE) {
    const token = utilities.charsToString(chars, phraseIndex, phraseLength);
    const normalizedToken = normalizer(token);

    data.push(['token', normalizedToken]);
  } else if (state === identifiers.SEM_POST) {
    /* not used in this example */
  }
  return identifiers.SEM_OK;
};

export const token = makeToken(tokenLowerCaseNormalizer);

export default token;
