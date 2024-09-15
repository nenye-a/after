import _ from 'lodash';

export const cleanWord = (word: string) => {
  return _.words(word)
    .map((subWord) => _.capitalize(subWord))
    .join(' ');
};
