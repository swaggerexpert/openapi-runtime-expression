import { identifiers, utilities } from 'apg-lite';

const source = (state, chars, phraseIndex, phraseLength, data) => {
  if (state === identifiers.SEM_PRE) {
    data.push(['source', utilities.charsToString(chars, phraseIndex, phraseLength)]);
  } else if (state === identifiers.SEM_POST) {
    /* not used in this example */
  }
  return identifiers.SEM_OK;
};

export default source;
